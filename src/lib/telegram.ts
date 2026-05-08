import { db } from './neon'
import { bookings, services, servicePrices } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

export async function sendBookingNotification(bookingId: string): Promise<void> {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not set — skipping notification')
    return
  }

  const rows = await db
    .select({
      customerName:  bookings.customerName,
      customerPhone: bookings.customerPhone,
      paymentMethod: bookings.paymentMethod,
      bookingDate:   bookings.bookingDate,
      bookingTime:   bookings.bookingTime,
      durationMin:   bookings.durationMin,
      serviceName:   services.name,
      priceEur:      servicePrices.priceEur,
    })
    .from(bookings)
    .innerJoin(services,      eq(bookings.serviceId, services.id))
    .innerJoin(servicePrices, eq(bookings.priceId,   servicePrices.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  if (rows.length === 0) return

  const b        = rows[0]
  const ref      = `AMK-${bookingId.split('-')[0].toUpperCase()}`
  const payLabel = b.paymentMethod === 'on_site' ? '💵 Bar/Karte vor Ort' : '💳 Online-Karte'
  const dur      = b.durationMin ?? 60
  const price    = b.priceEur ? Number(b.priceEur).toFixed(2) : '?'
  const dateStr  = b.bookingDate ? formatDate(b.bookingDate) : '?'
  const timeStr  = b.bookingTime ? b.bookingTime.slice(0, 5) : '?'

  const text =
    `📅 <b>NEUE BUCHUNG</b>\n\n` +
    `👤 <b>${b.customerName}</b>\n` +
    `📞 ${b.customerPhone}\n\n` +
    `💆 ${b.serviceName} – ${dur} Min.\n` +
    `💶 ${price} €\n` +
    `📆 ${dateStr}\n` +
    `🕐 ${timeStr} Uhr\n` +
    `${payLabel}\n\n` +
    `Ref: <code>${ref}</code>\n\n` +
    `⚠️ Bitte bestätigen oder absagen:`

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Bestätigen', callback_data: `confirm:${bookingId}` },
        { text: '❌ Absagen',    callback_data: `cancel:${bookingId}`  },
      ]],
    },
  }

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })

  if (!resp.ok) throw new Error(`Telegram error: ${await resp.text()}`)

  const data  = await resp.json()
  const msgId: number | undefined = data?.result?.message_id
  if (msgId) {
    await db.update(bookings).set({ telegramMsgId: msgId }).where(eq(bookings.id, bookingId))
  }
}
