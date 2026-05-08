import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/lib/neon'
import { bookings } from '../drizzle/schema'
import { and, eq, gte, lte, inArray } from 'drizzle-orm'

// ── Opening hours (mirror of src/lib/openingHours.ts) ─────────────────────
// day-of-week → open/close in minutes from midnight, or null if closed
const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,                            // Sunday — closed
  1: { open: 600,  close: 1140 },    // Monday    10:00–19:00
  2: { open: 600,  close: 1140 },    // Tuesday   10:00–19:00
  3: { open: 600,  close: 1020 },    // Wednesday 10:00–17:00
  4: { open: 600,  close: 1140 },    // Thursday  10:00–19:00
  5: { open: 600,  close: 1140 },    // Friday    10:00–19:00
  6: { open: 780,  close: 1200 },    // Saturday  13:00–20:00
}

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minsToTime(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

function pad(n: number) { return String(n).padStart(2, '0') }

/** All slot start times for a given date + service duration */
function generateSlots(dateStr: string, durationMin: number): string[] {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  const hours = HOURS[dow]
  if (!hours) return []
  const lastStart = hours.close - durationMin
  if (lastStart < hours.open) return []
  const slots: string[] = []
  for (let t = hours.open; t <= lastStart; t += 30) slots.push(minsToTime(t))
  return slots
}

/** Remove slots that overlap any booked range */
function filterFree(
  slots: string[],
  booked: { start: number; end: number }[],
  durationMin: number,
): string[] {
  return slots.filter(s => {
    const start = timeToMins(s)
    const end = start + durationMin
    return !booked.some(b => start < b.end && end > b.start)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { date, month, duration } = req.query
  const dur = Math.max(30, parseInt((duration as string) || '60', 10))

  res.setHeader('Cache-Control', 'no-store')

  try {
    // ── Month view: which dates have at least one free slot ──────────────────
    if (month && typeof month === 'string') {
      const [y, m] = month.split('-').map(Number)
      const days = new Date(y, m, 0).getDate()
      const from = `${y}-${pad(m)}-01`
      const to   = `${y}-${pad(m)}-${pad(days)}`

      // Fetch all active bookings for this month in one query
      const rows = await db
        .select({ bookingDate: bookings.bookingDate, bookingTime: bookings.bookingTime, durationMin: bookings.durationMin })
        .from(bookings)
        .where(and(
          gte(bookings.bookingDate, from),
          lte(bookings.bookingDate, to),
          inArray(bookings.bookingStatus, ['pending', 'confirmed']),
        ))

      const byDate: Record<string, { start: number; end: number }[]> = {}
      for (const r of rows) {
        if (!r.bookingDate || !r.bookingTime) continue
        const start = timeToMins(r.bookingTime)
        const d = r.bookingDate
        ;(byDate[d] ??= []).push({ start, end: start + (r.durationMin ?? 60) })
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const available: string[] = []

      for (let day = 1; day <= days; day++) {
        const ds = `${y}-${pad(m)}-${pad(day)}`
        const d  = new Date(Date.UTC(y, m - 1, day))
        if (d < today) continue
        const allSlots = generateSlots(ds, dur)
        if (allSlots.length === 0) continue
        const free = filterFree(allSlots, byDate[ds] ?? [], dur)
        if (free.length > 0) available.push(ds)
      }

      return res.status(200).json(available)
    }

    // ── Day view: all slots with availability flag ───────────────────────────
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'date or month required' })
    }

    const allSlots = generateSlots(date, dur)
    if (allSlots.length === 0) return res.status(200).json([])

    const dayRows = await db
      .select({ bookingTime: bookings.bookingTime, durationMin: bookings.durationMin })
      .from(bookings)
      .where(and(
        eq(bookings.bookingDate, date),
        inArray(bookings.bookingStatus, ['pending', 'confirmed']),
      ))

    const booked = dayRows
      .filter(r => r.bookingTime)
      .map(r => {
        const start = timeToMins(r.bookingTime!)
        return { start, end: start + (r.durationMin ?? 60) }
      })

    const freeSet = new Set(filterFree(allSlots, booked, dur))

    return res.status(200).json(
      allSlots.map(s => ({ slot_time: s, is_available: freeSet.has(s) }))
    )
  } catch (err) {
    console.error('[slots]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
