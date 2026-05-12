import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, bookings } from './_lib.js'
import { desc } from 'drizzle-orm'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  const result: Record<string, unknown> = {
    token_set:   !!token,
    chat_id_env: chatId ?? null,
  }

  if (!token) return res.status(200).json(result)

  // 1. Bot identity
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/getMe`)
    const d = await r.json()
    result.bot = d.ok ? `@${d.result.username}` : d
  } catch (e) { result.getMe_error = String(e) }

  // 2. Info about the current chat_id (type + title)
  if (chatId) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`)
      const d = await r.json()
      if (d.ok) {
        result.current_chat = {
          id:    d.result.id,
          type:  d.result.type,
          title: d.result.title ?? d.result.first_name ?? '(no title)',
        }
      } else {
        result.current_chat_error = d.description
      }
    } catch (e) { result.getChat_error = String(e) }
  }

  // 3. Send test message
  if (chatId) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    chatId,
          text:       '🔔 <b>Test</b> — Amaka Buchungssystem aktiv ✅',
          parse_mode: 'HTML',
        }),
      })
      const d = await r.json()
      result.sendMessage = d.ok ? 'SENT ✅' : d
    } catch (e) { result.sendMessage_error = String(e) }
  }

  // 4. Last booking
  try {
    const db = getDb()
    const rows = await db
      .select({ id: bookings.id, createdAt: bookings.createdAt, customerName: bookings.customerName })
      .from(bookings).orderBy(desc(bookings.createdAt)).limit(1)
    result.last_booking = rows[0] ?? 'none'
  } catch (e) { result.db_error = String(e) }

  return res.status(200).json(result)
}
