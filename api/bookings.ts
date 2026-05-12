import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, bookings } from './_lib.js'
import { and, eq, inArray } from 'drizzle-orm'
import { sendBookingNotification } from './_telegram.js'

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDb()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const {
    service_id, price_id,
    booking_date, booking_time, duration_min,
    customer_name, customer_phone, payment_method,
  } = req.body

  if (!service_id || !price_id || !booking_date || !booking_time || !duration_min ||
      !customer_name || !customer_phone || !payment_method) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  if (!['stripe', 'on_site'].includes(payment_method)) {
    return res.status(400).json({ error: 'Invalid payment method' })
  }

  const dur = Number(duration_min)

  try {
    // Conflict check
    const dayBookings = await db
      .select({ bookingTime: bookings.bookingTime, durationMin: bookings.durationMin })
      .from(bookings)
      .where(and(
        eq(bookings.bookingDate, booking_date),
        inArray(bookings.bookingStatus, ['pending', 'confirmed']),
      ))

    const newStart = timeToMins(booking_time)
    const newEnd   = newStart + dur

    for (const b of dayBookings) {
      if (!b.bookingTime) continue
      const existStart = timeToMins(b.bookingTime)
      const existEnd   = existStart + (b.durationMin ?? 60)
      if (newStart < existEnd && newEnd > existStart) {
        return res.status(409).json({ error: 'This slot was just taken. Please choose another time.' })
      }
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        serviceId:     service_id,
        priceId:       price_id,
        bookingDate:   booking_date,
        bookingTime:   booking_time,
        durationMin:   dur,
        customerName:  customer_name,
        customerPhone: customer_phone,
        paymentMethod: payment_method,
        bookingStatus: 'pending',
        paymentStatus: 'pending',
      })
      .returning({ id: bookings.id })

    const bookingId  = booking.id
    const bookingRef = `AMK-${bookingId.split('-')[0].toUpperCase()}`

    // Await the notification — fire-and-forget dies when res.json() closes the Lambda.
    // 4 s timeout so a slow Telegram API never blocks the booking response.
    await Promise.race([
      sendBookingNotification(bookingId),
      new Promise<void>(resolve => setTimeout(resolve, 4000)),
    ]).catch(err => console.error('[telegram]', err))

    return res.status(201).json({ booking_id: bookingId, booking_ref: bookingRef })
  } catch (err) {
    console.error('[bookings POST]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
