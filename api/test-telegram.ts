import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, bookings, services, servicePrices } from './_lib.js'
import { desc, eq } from 'drizzle-orm'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  const result: Record<string, unknown> = {
    token_set:   !!token,
    token_prefix: token ? token.slice(0, 10) + '…' : null,
    chat_id:     chatId ?? null,
  }

  // Step 1: verify the bot token via getMe
  if (token) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/getMe`)
      const d = await r.json()
      result.getMe = d.ok ? `@${d.result.username}` : d
    } catch (e) {
      result.getMe_error = String(e)
    }
  }

  // Step 2: send a test message
  if (token && chatId) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    chatId,
          text:       '🔔 <b>Test-Nachricht</b>\nAmaka Buchungssystem — Telegram aktiv ✅',
          parse_mode: 'HTML',
        }),
      })
      const d = await r.json()
      result.sendMessage = d.ok ? 'sent ✅' : d
    } catch (e) {
      result.sendMessage_error = String(e)
    }
  }

  // Step 3: check the last booking in DB to confirm ID exists
  try {
    const db = getDb()
    const rows = await db
      .select({ id: bookings.id, createdAt: bookings.createdAt, customerName: bookings.customerName })
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(1)
    result.last_booking = rows[0] ?? 'none'
  } catch (e) {
    result.db_error = String(e)
  }

  return res.status(200).json(result)
}
