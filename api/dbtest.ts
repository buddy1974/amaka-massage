// Temporary diagnostic — delete after root cause confirmed
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../src/lib/neon'
import { services } from '../drizzle/schema'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const rows = await db.select({ id: services.id, name: services.name }).from(services).limit(3)
    return res.status(200).json({ ok: true, rows })
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
    return res.status(500).json({ ok: false, error: msg })
  }
}
