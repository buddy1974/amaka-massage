import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/lib/neon'
import { bookings, blockedSlots } from '../drizzle/schema'
import { and, eq, gte, lte, inArray } from 'drizzle-orm'

const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 600,  close: 1140 },
  2: { open: 600,  close: 1140 },
  3: { open: 600,  close: 1020 },
  4: { open: 600,  close: 1140 },
  5: { open: 600,  close: 1140 },
  6: { open: 780,  close: 1200 },
}

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
function minsToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
function pad(n: number) { return String(n).padStart(2, '0') }

function generateSlots(dateStr: string, durationMin: number): string[] {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dow   = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  const hours = HOURS[dow]
  if (!hours) return []
  const last = hours.close - durationMin
  if (last < hours.open) return []
  const slots: string[] = []
  for (let t = hours.open; t <= last; t += 30) slots.push(minsToTime(t))
  return slots
}

function filterFree(
  slots: string[],
  occupied: { start: number; end: number }[],
  dur: number,
): string[] {
  return slots.filter(s => {
    const start = timeToMins(s)
    const end   = start + dur
    return !occupied.some(o => start < o.end && end > o.start)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { date, month, duration } = req.query
  const dur = Math.max(30, parseInt((duration as string) || '60', 10))
  res.setHeader('Cache-Control', 'no-store')

  try {
    // ── Month view ───────────────────────────────────────────────────────────
    if (month && typeof month === 'string') {
      const [y, m] = month.split('-').map(Number)
      const days   = new Date(y, m, 0).getDate()
      const from   = `${y}-${pad(m)}-01`
      const to     = `${y}-${pad(m)}-${pad(days)}`

      const [bookingRows, blockRows] = await Promise.all([
        db.select({ bookingDate: bookings.bookingDate, bookingTime: bookings.bookingTime, durationMin: bookings.durationMin })
          .from(bookings)
          .where(and(gte(bookings.bookingDate, from), lte(bookings.bookingDate, to),
            inArray(bookings.bookingStatus, ['pending', 'confirmed']))),
        db.select({ blockDate: blockedSlots.blockDate, blockTime: blockedSlots.blockTime, durationMin: blockedSlots.durationMin })
          .from(blockedSlots)
          .where(and(gte(blockedSlots.blockDate, from), lte(blockedSlots.blockDate, to))),
      ])

      // Group by date
      const occupied: Record<string, { start: number; end: number }[]> = {}
      const dayBlocked = new Set<string>()

      for (const r of bookingRows) {
        if (!r.bookingDate || !r.bookingTime) continue
        const start = timeToMins(r.bookingTime)
        ;(occupied[r.bookingDate] ??= []).push({ start, end: start + (r.durationMin ?? 60) })
      }
      for (const r of blockRows) {
        if (!r.blockDate) continue
        if (!r.blockTime) { dayBlocked.add(r.blockDate); continue }
        const start = timeToMins(r.blockTime)
        ;(occupied[r.blockDate] ??= []).push({ start, end: start + (r.durationMin ?? 60) })
      }

      const today = new Date(); today.setHours(0, 0, 0, 0)
      const available: string[] = []

      for (let day = 1; day <= days; day++) {
        const ds = `${y}-${pad(m)}-${pad(day)}`
        if (new Date(Date.UTC(y, m - 1, day)) < today) continue
        if (dayBlocked.has(ds)) continue
        const all  = generateSlots(ds, dur)
        if (all.length === 0) continue
        const free = filterFree(all, occupied[ds] ?? [], dur)
        if (free.length > 0) available.push(ds)
      }

      return res.status(200).json(available)
    }

    // ── Day view ─────────────────────────────────────────────────────────────
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'date or month required' })
    }

    const allSlots = generateSlots(date, dur)
    if (allSlots.length === 0) return res.status(200).json([])

    const [dayBookings, dayBlocks] = await Promise.all([
      db.select({ bookingTime: bookings.bookingTime, durationMin: bookings.durationMin })
        .from(bookings)
        .where(and(eq(bookings.bookingDate, date), inArray(bookings.bookingStatus, ['pending', 'confirmed']))),
      db.select({ blockTime: blockedSlots.blockTime, durationMin: blockedSlots.durationMin })
        .from(blockedSlots)
        .where(eq(blockedSlots.blockDate, date)),
    ])

    // If whole-day block exists, every slot is unavailable
    if (dayBlocks.some(b => !b.blockTime)) {
      return res.status(200).json(allSlots.map(s => ({ slot_time: s, is_available: false })))
    }

    const occ = [
      ...dayBookings.filter(r => r.bookingTime).map(r => {
        const start = timeToMins(r.bookingTime!)
        return { start, end: start + (r.durationMin ?? 60) }
      }),
      ...dayBlocks.filter(r => r.blockTime).map(r => {
        const start = timeToMins(r.blockTime!)
        return { start, end: start + (r.durationMin ?? 60) }
      }),
    ]

    const freeSet = new Set(filterFree(allSlots, occ, dur))
    return res.status(200).json(allSlots.map(s => ({ slot_time: s, is_available: freeSet.has(s) })))

  } catch (err) {
    console.error('[slots]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
