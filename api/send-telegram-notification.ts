import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sendBookingNotification } from '../src/lib/telegram'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { booking_id } = req.body
  if (!booking_id) return res.status(400).json({ error: 'booking_id required' })

  try {
    await sendBookingNotification(booking_id)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[send-telegram-notification]', err)
    return res.status(500).json({ error: 'Failed to send notification' })
  }
}
