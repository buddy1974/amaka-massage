import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { db } from '../src/lib/neon'
import { bookings, timeSlots } from '../drizzle/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const config = { api: { bodyParser: false } }

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sig = req.headers['stripe-signature'] as string
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature' })

  let event: Stripe.Event
  try {
    const rawBody = await getRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe-webhook] signature failed:', err)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent
      const bookingId = pi.metadata?.booking_id
      if (!bookingId) return res.status(200).json({ received: true })

      const rows = await db
        .select({ slotId: bookings.slotId })
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .limit(1)

      if (rows.length > 0 && rows[0].slotId) {
        // Mark slot as permanently booked
        await db.update(timeSlots)
          .set({ isAvailable: false, lockedUntil: null })
          .where(eq(timeSlots.id, rows[0].slotId))
      }

      await db.update(bookings)
        .set({ paymentStatus: 'paid', bookingStatus: 'confirmed' })
        .where(eq(bookings.id, bookingId))
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent
      const bookingId = pi.metadata?.booking_id
      if (!bookingId) return res.status(200).json({ received: true })

      const rows = await db
        .select({ slotId: bookings.slotId })
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .limit(1)

      if (rows.length > 0 && rows[0].slotId) {
        // Release the slot back to available
        await db.update(timeSlots)
          .set({ isAvailable: true, lockedUntil: null })
          .where(eq(timeSlots.id, rows[0].slotId))
      }

      await db.update(bookings)
        .set({ paymentStatus: 'failed', bookingStatus: 'cancelled' })
        .where(eq(bookings.id, bookingId))
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('[stripe-webhook] processing error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
