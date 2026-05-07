import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { db } from '../src/lib/neon'
import { bookings, timeSlots, services, servicePrices } from '../drizzle/schema'
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

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

async function editTelegramMessage(msgId: number, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId || !msgId) return

  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: msgId,
      text,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [] }, // removes confirm/cancel buttons
    }),
  })
}

async function getBookingByPaymentIntent(paymentIntentId: string) {
  const rows = await db
    .select({
      id: bookings.id,
      slotId: bookings.slotId,
      telegramMsgId: bookings.telegramMsgId,
      customerName: bookings.customerName,
      customerPhone: bookings.customerPhone,
      paymentMethod: bookings.paymentMethod,
      serviceName: services.name,
      durationMin: servicePrices.durationMin,
      slotDate: timeSlots.slotDate,
      slotTime: timeSlots.slotTime,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(servicePrices, eq(bookings.priceId, servicePrices.id))
    .innerJoin(timeSlots, eq(bookings.slotId, timeSlots.id))
    .where(eq(bookings.stripePaymentIntentId, paymentIntentId))
    .limit(1)

  return rows[0] ?? null
}

function buildMessageText(b: NonNullable<Awaited<ReturnType<typeof getBookingByPaymentIntent>>>, bookingId: string, suffix: string): string {
  const ref = `AMK-${bookingId.split('-')[0].toUpperCase()}`
  const payLabel = b.paymentMethod === 'on_site' ? 'Pay on-site' : 'Card payment'
  return (
    `📅 <b>NEW BOOKING</b>\n\n` +
    `👤 ${b.customerName}\n` +
    `💆 ${b.serviceName} – ${b.durationMin} min\n` +
    `📆 ${formatDate(b.slotDate ?? '')}\n` +
    `🕐 ${b.slotTime}\n` +
    `💳 ${payLabel}\n` +
    `📞 ${b.customerPhone}\n\n` +
    `Ref: <code>${ref}</code>` +
    suffix
  )
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
      const booking = await getBookingByPaymentIntent(pi.id)
      if (!booking) return res.status(200).json({ received: true })

      // Mark slot as permanently booked
      if (booking.slotId) {
        await db.update(timeSlots)
          .set({ isAvailable: false, lockedUntil: null })
          .where(eq(timeSlots.id, booking.slotId))
      }

      await db.update(bookings)
        .set({ paymentStatus: 'paid', bookingStatus: 'confirmed' })
        .where(eq(bookings.id, booking.id))

      // Edit Telegram message — append ✅ PAID, remove buttons
      if (booking.telegramMsgId) {
        const text = buildMessageText(booking, booking.id, '\n\n✅ PAID')
        await editTelegramMessage(booking.telegramMsgId, text)
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent
      const booking = await getBookingByPaymentIntent(pi.id)
      if (!booking) return res.status(200).json({ received: true })

      // Release the slot lock
      if (booking.slotId) {
        await db.update(timeSlots)
          .set({ lockedUntil: null })
          .where(eq(timeSlots.id, booking.slotId))
      }

      await db.update(bookings)
        .set({ paymentStatus: 'failed', bookingStatus: 'cancelled' })
        .where(eq(bookings.id, booking.id))

      // Edit Telegram message — append ❌ PAYMENT FAILED, remove buttons
      if (booking.telegramMsgId) {
        const text = buildMessageText(booking, booking.id, '\n\n❌ PAYMENT FAILED')
        await editTelegramMessage(booking.telegramMsgId, text)
      }
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('[stripe-webhook] processing error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
