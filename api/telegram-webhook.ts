import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { db } from '../src/lib/neon'
import { bookings, services, servicePrices } from '../drizzle/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder')
const TG     = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

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
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

async function getBooking(bookingId: string) {
  const rows = await db
    .select({
      id:                      bookings.id,
      customerName:            bookings.customerName,
      customerPhone:           bookings.customerPhone,
      paymentMethod:           bookings.paymentMethod,
      paymentStatus:           bookings.paymentStatus,
      stripePaymentIntentId:   bookings.stripePaymentIntentId,
      bookingDate:             bookings.bookingDate,
      bookingTime:             bookings.bookingTime,
      durationMin:             bookings.durationMin,
      serviceName:             services.name,
      priceEur:                servicePrices.priceEur,
    })
    .from(bookings)
    .innerJoin(services,      eq(bookings.serviceId, services.id))
    .innerJoin(servicePrices, eq(bookings.priceId,   servicePrices.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  return rows[0] ?? null
}

type B = NonNullable<Awaited<ReturnType<typeof getBooking>>>

function buildText(b: B, bookingId: string, suffix: string): string {
  const ref      = `AMK-${bookingId.split('-')[0].toUpperCase()}`
  const payLabel = b.paymentMethod === 'on_site' ? '💵 Bar/Karte vor Ort' : '💳 Online-Karte'
  const dateStr  = b.bookingDate ? formatDate(b.bookingDate) : '?'
  const timeStr  = b.bookingTime ? b.bookingTime.slice(0, 5) : '?'
  const dur      = b.durationMin ?? 60
  const price    = b.priceEur ? Number(b.priceEur).toFixed(2) : '?'
  return (
    `📅 <b>BUCHUNG</b>\n\n` +
    `👤 <b>${b.customerName}</b>\n` +
    `📞 ${b.customerPhone}\n\n` +
    `💆 ${b.serviceName} – ${dur} Min.\n` +
    `💶 ${price} €\n` +
    `📆 ${dateStr}\n` +
    `🕐 ${timeStr} Uhr\n` +
    `${payLabel}\n\n` +
    `Ref: <code>${ref}</code>` +
    suffix
  )
}

async function editMessage(chatId: number, messageId: number, text: string): Promise<void> {
  await tg('editMessageText', {
    chat_id:      chatId,
    message_id:   messageId,
    text,
    parse_mode:   'HTML',
    reply_markup: { inline_keyboard: [] },
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always 200 — Telegram retries on non-200
  if (req.method !== 'POST') return res.status(200).json({ ok: true })

  try {
    const update = req.body as TelegramUpdate
    const cq     = update.callback_query
    if (!cq) return res.status(200).json({ ok: true })

    const { id: callbackQueryId, message, data } = cq
    const [action, bookingId] = data.split(':')
    if (!action || !bookingId) return res.status(200).json({ ok: true })

    const chatId    = message.chat.id
    const messageId = message.message_id

    const booking = await getBooking(bookingId)
    if (!booking) {
      await tg('answerCallbackQuery', { callback_query_id: callbackQueryId, text: '⚠️ Buchung nicht gefunden' })
      return res.status(200).json({ ok: true })
    }

    // ── CONFIRM ──────────────────────────────────────────────────────────────
    if (action === 'confirm') {
      await db.update(bookings).set({ bookingStatus: 'confirmed' }).where(eq(bookings.id, bookingId))
      await tg('answerCallbackQuery', { callback_query_id: callbackQueryId, text: '✅ Buchung bestätigt!' })
      await editMessage(chatId, messageId, buildText(booking, bookingId, '\n\n✅ BESTÄTIGT'))
    }

    // ── CANCEL ───────────────────────────────────────────────────────────────
    if (action === 'cancel') {
      await db.update(bookings).set({ bookingStatus: 'cancelled' }).where(eq(bookings.id, bookingId))

      let suffix = '\n\n❌ ABGESAGT'

      if (booking.paymentStatus === 'paid' && booking.stripePaymentIntentId) {
        await stripe.refunds.create({ payment_intent: booking.stripePaymentIntentId })
        await db.update(bookings).set({ paymentStatus: 'refunded' }).where(eq(bookings.id, bookingId))
        suffix = '\n\n❌ ABGESAGT — Rückerstattung veranlasst'
      }

      await tg('answerCallbackQuery', { callback_query_id: callbackQueryId, text: '❌ Buchung abgesagt' })
      await editMessage(chatId, messageId, buildText(booking, bookingId, suffix))
    }
  } catch (err) {
    console.error('[telegram-webhook]', err)
    // swallow — must return 200 or Telegram retries
  }

  return res.status(200).json({ ok: true })
}
