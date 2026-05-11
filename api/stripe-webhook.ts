import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { db, bookings, timeSlots } from './_lib'
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

async function editTelegramMessage(msgId: number, text: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId || !msgId) return
  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id:      chatId,
      message_id:   msgId,
      text,
      parse_mode:   'HTML',
      reply_markup: { inline_keyboard: [] },
    }),
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
      const pi      = event.data.object as Stripe.PaymentIntent
      const booking = await db.select({
        id: bookings.id, slotId: bookings.slotId, telegramMsgId: bookings.telegramMsgId,
      }).from(bookings).where(eq(bookings.stripePaymentIntentId, pi.id)).limit(1).then(r => r[0] ?? null)

      if (!booking) return res.status(200).json({ received: true })

      if (booking.slotId) {
        await db.update(timeSlots).set({ isAvailable: false, lockedUntil: null }).where(eq(timeSlots.id, booking.slotId))
      }
      await db.update(bookings).set({ paymentStatus: 'paid', bookingStatus: 'confirmed' }).where(eq(bookings.id, booking.id))

      if (booking.telegramMsgId) {
        await editTelegramMessage(booking.telegramMsgId, '✅ BEZAHLT & BESTÄTIGT')
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi      = event.data.object as Stripe.PaymentIntent
      const booking = await db.select({
        id: bookings.id, slotId: bookings.slotId, telegramMsgId: bookings.telegramMsgId,
      }).from(bookings).where(eq(bookings.stripePaymentIntentId, pi.id)).limit(1).then(r => r[0] ?? null)

      if (!booking) return res.status(200).json({ received: true })

      if (booking.slotId) {
        await db.update(timeSlots).set({ lockedUntil: null }).where(eq(timeSlots.id, booking.slotId))
      }
      await db.update(bookings).set({ paymentStatus: 'failed', bookingStatus: 'cancelled' }).where(eq(bookings.id, booking.id))

      if (booking.telegramMsgId) {
        await editTelegramMessage(booking.telegramMsgId, '❌ ZAHLUNG FEHLGESCHLAGEN')
      }
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('[stripe-webhook] processing error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
