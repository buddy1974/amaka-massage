import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/lib/neon'
import { timeSlots, bookings } from '../drizzle/schema'
import { and, isNotNull, lt, ne, notInArray, sql } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const active = await db
      .selectDistinct({ slotId: bookings.slotId })
      .from(bookings)
      .where(ne(bookings.bookingStatus, 'cancelled'))

    const activeIds = active.map(r => r.slotId).filter((id): id is string => id !== null)

    const expiredLock = and(isNotNull(timeSlots.lockedUntil), lt(timeSlots.lockedUntil, sql`now()`))

    const result = await db
      .update(timeSlots)
      .set({ lockedUntil: null })
      .where(activeIds.length > 0 ? and(expiredLock, notInArray(timeSlots.id, activeIds)) : expiredLock)
      .returning({ id: timeSlots.id })

    return res.status(200).json({ cleaned: result.length })
  } catch (err) {
    console.error('[cleanup-locks]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
