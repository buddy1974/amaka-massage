import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, bookings } from './_lib.js'
import { desc } from 'drizzle-orm'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  const result: Record<string, unknown> = {
    token_set:    !!token,
    token_prefix: token ? token.slice(0, 10) + '…' : null,
    chat_id_env:  chatId ?? null,
  }

  if (!token) return res.status(200).json(result)

  // 1. Verify bot identity
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/getMe`)
    const d = await r.json()
    result.bot = d.ok ? `@${d.result.username} (id ${d.result.id})` : d
  } catch (e) { result.getMe_error = String(e) }

  // 2. Get recent updates — shows who has messaged the bot and their chat IDs
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=10`)
    const d = await r.json()
    if (d.ok && d.result.length > 0) {
      result.recent_chats = d.result.map((u: { message?: { chat: { id: number; first_name?: string; username?: string }; from?: { username?: string } } }) => ({
        chat_id:    u.message?.chat?.id,
        name:       u.message?.chat?.first_name,
        username:   u.message?.chat?.username ?? u.message?.from?.username,
      }))
    } else {
      result.recent_chats = d.ok
        ? 'NO MESSAGES YET — Amaka must open @Amakamassagebot in Telegram and press Start'
        : d
    }
  } catch (e) { result.getUpdates_error = String(e) }

  // 3. Try sending with current env chat_id
  if (chatId) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    chatId,
          text:       '🔔 Test — Amaka Buchungssystem aktiv ✅',
          parse_mode: 'HTML',
        }),
      })
      const d = await r.json()
      result.sendMessage = d.ok ? 'SENT ✅' : d
    } catch (e) { result.sendMessage_error = String(e) }
  }

  // 4. Last booking in DB
  try {
    const db   = getDb()
    const rows = await db
      .select({ id: bookings.id, createdAt: bookings.createdAt, customerName: bookings.customerName })
      .from(bookings).orderBy(desc(bookings.createdAt)).limit(1)
    result.last_booking = rows[0] ?? 'none'
  } catch (e) { result.db_error = String(e) }

  return res.status(200).json(result)
}
