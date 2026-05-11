// Temporary diagnostic — delete after confirmed working
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db, services } from './_lib'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await db.select({ id: services.id, name: services.name }).from(services).limit(3)
    return res.status(200).json({ ok: true, rows })
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
    return res.status(500).json({ ok: false, error: msg })
  }
}
