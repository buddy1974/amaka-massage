import { db } from './neon'
import { bookings, timeSlots, services, servicePrices } from '../../drizzle/schema'
import { eq } from 'drizzle-orm'

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

export async function sendBookingNotification(bookingId: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) return

  const rows = await db
    .select({
      customerName: bookings.customerName,
      customerPhone: bookings.customerPhone,
      paymentMethod: bookings.paymentMethod,
      slotDate: timeSlots.slotDate,
      slotTime: timeSlots.slotTime,
      serviceName: services.name,
      durationMin: servicePrices.durationMin,
    })
    .from(bookings)
    .innerJoin(timeSlots, eq(bookings.slotId, timeSlots.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(servicePrices, eq(bookings.priceId, servicePrices.id))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  if (rows.length === 0) return

  const b = rows[0]
  const ref = `AMK-${bookingId.split('-')[0].toUpperCase()}`
  const payLabel = b.paymentMethod === 'on_site' ? 'Pay on-site' : 'Card payment'

  const text =
    `📅 <b>NEW BOOKING</b>\n\n` +
    `👤 ${b.customerName}\n` +
    `💆 ${b.serviceName} – ${b.durationMin} min\n` +
    `📆 ${formatDate(b.slotDate ?? '')}\n` +
    `🕐 ${b.slotTime}\n` +
    `💳 ${payLabel}\n` +
    `📞 ${b.customerPhone}\n\n` +
    `Ref: <code>${ref}</code>`

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Confirm', callback_data: `confirm:${bookingId}` },
        { text: '❌ Cancel',  callback_data: `cancel:${bookingId}` },
      ]],
    },
  }

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) throw new Error(`Telegram error: ${await resp.text()}`)

  const data = await resp.json()
  const msgId: number | undefined = data?.result?.message_id

  if (msgId) {
    await db.update(bookings).set({ telegramMsgId: msgId }).where(eq(bookings.id, bookingId))
  }
}
