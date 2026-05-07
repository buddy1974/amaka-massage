import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/lib/neon'
import { timeSlots, bookings } from '../drizzle/schema'
import { eq, and, or, isNull, lt, sql } from 'drizzle-orm'
import { sendBookingNotification } from '../src/lib/telegram'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { slot_id, service_id, price_id, customer_name, customer_phone, payment_method } = req.body

  if (!slot_id || !service_id || !price_id || !customer_name || !customer_phone || !payment_method) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  if (!['stripe', 'on_site'].includes(payment_method)) {
    return res.status(400).json({ error: 'Invalid payment method' })
  }

  try {
    // Atomic lock: only succeeds if slot is truly free right now
    const locked = await db
      .update(timeSlots)
      .set({ lockedUntil: sql`now() + interval '15 minutes'` })
      .where(
        and(
          eq(timeSlots.id, slot_id),
          eq(timeSlots.isAvailable, true),
          or(isNull(timeSlots.lockedUntil), lt(timeSlots.lockedUntil, sql`now()`))
        )
      )
      .returning({ id: timeSlots.id })

    if (locked.length === 0) {
      return res.status(409).json({ error: 'Slot no longer available' })
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        slotId: slot_id,
        serviceId: service_id,
        priceId: price_id,
        customerName: customer_name,
        customerPhone: customer_phone,
        paymentMethod: payment_method,
        bookingStatus: 'pending',
        paymentStatus: 'pending',
      })
      .returning({ id: bookings.id })

    const bookingId = booking.id
    const bookingRef = `AMK-${bookingId.split('-')[0].toUpperCase()}`

    // Fire-and-forget — Vercel keeps the function alive until response is sent
    sendBookingNotification(bookingId).catch(err => console.error('[telegram]', err))

    return res.status(201).json({ booking_id: bookingId, booking_ref: bookingRef })
  } catch (err) {
    console.error('[bookings POST]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
