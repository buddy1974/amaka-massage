import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { db } from '../src/lib/neon'
import { bookings, timeSlots, services, servicePrices } from '../drizzle/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const TG = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

interface TelegramUpdate {
  update_id: number
  callback_query?: {
    id: string
    from: { id: number; first_name: string }
    message: { message_id: number; chat: { id: number } }
    data: string
  }
}

async function tg(method: string, body: object): Promise<void> {
  await fetch(`${TG}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

async function getBooking(bookingId: string) {
  const rows = await db
    .select({
      id: bookings.id,
      slotId: bookings.slotId,
      customerName: bookings.customerName,
      customerPhone: bookings.customerPhone,
      paymentMethod: bookings.paymentMethod,
      paymentStatus: bookings.paymentStatus,
      stripePaymentIntentId: bookings.stripePaymentIntentId,
      serviceName: services.name,
      durationMin: servicePrices.durationMin,
      slotDate: timeSlots.slotDate,
      slotTime: timeSlots.slotTime,
    })
    .from(bookings)
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(servicePrices, eq(bookings.priceId, servicePrices.id))
    .innerJoin(timeSlots, eq(bookings.slotId, timeSlots.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  return rows[0] ?? null
}

type BookingRow = NonNullable<Awaited<ReturnType<typeof getBooking>>>

function buildText(b: BookingRow, bookingId: string, suffix: string): string {
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

async function editMessage(chatId: number, messageId: number, text: string): Promise<void> {
  await tg('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: [] }, // removes confirm/cancel buttons
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always return 200 — Telegram retries on any non-200 response
  if (req.method !== 'POST') return res.status(200).json({ ok: true })

  try {
    const update = req.body as TelegramUpdate
    const cq = update.callback_query
    if (!cq) return res.status(200).json({ ok: true })

    const { id: callbackQueryId, message, data } = cq
    const [action, bookingId] = data.split(':')
    if (!action || !bookingId) return res.status(200).json({ ok: true })

    const chatId = message.chat.id
    const messageId = message.message_id

    const booking = await getBooking(bookingId)
    if (!booking) {
      await tg('answerCallbackQuery', { callback_query_id: callbackQueryId, text: '⚠️ Booking not found' })
      return res.status(200).json({ ok: true })
    }

    // ── CONFIRM ──────────────────────────────────────────────────────────────
    if (action === 'confirm') {
      await db.update(bookings)
        .set({ bookingStatus: 'confirmed' })
        .where(eq(bookings.id, bookingId))

      await tg('answerCallbackQuery', { callback_query_id: callbackQueryId, text: '✅ Confirmed!' })
      await editMessage(chatId, messageId, buildText(booking, bookingId, '\n\n✅ CONFIRMED by Amaka'))
    }

    // ── CANCEL ───────────────────────────────────────────────────────────────
    if (action === 'cancel') {
      await db.update(bookings)
        .set({ bookingStatus: 'cancelled' })
        .where(eq(bookings.id, bookingId))

      let suffix = '\n\n❌ CANCELLED'

      if (booking.paymentStatus === 'paid' && booking.stripePaymentIntentId) {
        await stripe.refunds.create({ payment_intent: booking.stripePaymentIntentId })
        await db.update(bookings)
          .set({ paymentStatus: 'refunded' })
          .where(eq(bookings.id, bookingId))
        suffix = '\n\n❌ CANCELLED — Refund issued'
      }

      if (booking.slotId) {
        await db.update(timeSlots)
          .set({ isAvailable: true, lockedUntil: null })
          .where(eq(timeSlots.id, booking.slotId))
      }

      await tg('answerCallbackQuery', { callback_query_id: callbackQueryId, text: '❌ Booking cancelled' })
      await editMessage(chatId, messageId, buildText(booking, bookingId, suffix))
    }
  } catch (err) {
    console.error('[telegram-webhook]', err)
    // Swallow error — must still return 200 or Telegram will retry indefinitely
  }

  return res.status(200).json({ ok: true })
}
