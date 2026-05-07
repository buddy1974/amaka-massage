import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/lib/neon'
import { timeSlots } from '../drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

function pad(n: number) { return String(n).padStart(2, '0') }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { date, month } = req.query

  try {
    // Return distinct available dates for the given month (for calendar)
    if (month && typeof month === 'string') {
      const [y, m] = month.split('-').map(Number)
      const from = `${y}-${pad(m)}-01`
      const lastDay = new Date(y, m, 0).getDate()
      const to = `${y}-${pad(m)}-${pad(lastDay)}`

      const rows = await db
        .selectDistinct({ slotDate: timeSlots.slotDate })
        .from(timeSlots)
        .where(and(eq(timeSlots.isAvailable, true), gte(timeSlots.slotDate, from), lte(timeSlots.slotDate, to)))

      return res.status(200).json(rows.map(r => r.slotDate))
    }

    // Return all slots for a specific date (for time picker)
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'date or month query parameter required' })
    }

    const rows = await db
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.slotDate, date))
      .orderBy(timeSlots.slotTime)

    const now = new Date()
    return res.status(200).json(rows.map(s => ({
      id: s.id,
      slot_time: s.slotTime,
      is_available: s.isAvailable,
      locked: s.lockedUntil ? new Date(s.lockedUntil) > now : false,
    })))
  } catch (err) {
    console.error('[slots]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
