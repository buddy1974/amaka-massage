import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { db } from '../src/lib/neon'
import { bookings, servicePrices, services } from '../drizzle/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { booking_id } = req.body
  if (!booking_id) return res.status(400).json({ error: 'booking_id required' })

  try {
    const rows = await db
      .select({
        priceEur: servicePrices.priceEur,
        bookingStatus: bookings.bookingStatus,
        customerName: bookings.customerName,
        serviceName: services.name,
      })
      .from(bookings)
      .innerJoin(servicePrices, eq(bookings.priceId, servicePrices.id))
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, booking_id))
      .limit(1)

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Booking not found' })
    }

    const booking = rows[0]

    if (booking.bookingStatus !== 'pending') {
      return res.status(400).json({ error: `Booking status is '${booking.bookingStatus}', expected 'pending'` })
    }

    const priceEur = Number(booking.priceEur)
    const amountCents = Math.round(priceEur * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      metadata: {
        booking_id,
        customer_name: booking.customerName,
        service_name: booking.serviceName ?? '',
      },
      automatic_payment_methods: { enabled: true },
    })

    await db
      .update(bookings)
      .set({ stripePaymentIntentId: paymentIntent.id })
      .where(eq(bookings.id, booking_id))

    return res.status(200).json({
      client_secret: paymentIntent.client_secret,
      amount: priceEur,
    })
  } catch (err) {
    console.error('[create-payment-intent]', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
