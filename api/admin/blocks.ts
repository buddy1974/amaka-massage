import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import { db } from '../../src/lib/neon'
import { blockedSlots } from '../../drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

async function verifyAdmin(req: VercelRequest): Promise<boolean> {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return false
    await jwtVerify(auth.slice(7), new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!))
    return true
  } catch { return false }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (!(await verifyAdmin(req))) return res.status(401).json({ error: 'Unauthorized' })

  // GET ?date=YYYY-MM-DD  or  ?from=YYYY-MM-DD&to=YYYY-MM-DD
  if (req.method === 'GET') {
    const { date, from, to } = req.query as Record<string, string>
    if (date) {
      const rows = await db.select().from(blockedSlots).where(eq(blockedSlots.blockDate, date))
      return res.json(rows)
    }
    if (from && to) {
      const rows = await db.select().from(blockedSlots)
        .where(and(gte(blockedSlots.blockDate, from), lte(blockedSlots.blockDate, to)))
      return res.json(rows)
    }
    return res.status(400).json({ error: 'date or from+to required' })
  }

  // POST — create a block
  // body: { block_date, block_time?, duration_min?, note? }
  // block_time omitted / null = whole day block
  if (req.method === 'POST') {
    const { block_date, block_time, duration_min, note } = req.body as {
      block_date?: string; block_time?: string; duration_min?: number; note?: string
    }
    if (!block_date) return res.status(400).json({ error: 'block_date required' })

    const [row] = await db.insert(blockedSlots).values({
      blockDate:   block_date,
      blockTime:   block_time ?? null,
      durationMin: duration_min ?? 60,
      note:        note ?? null,
    }).returning()

    return res.status(201).json(row)
  }

  // DELETE — remove a block by id
  if (req.method === 'DELETE') {
    const { id } = req.body as { id?: string }
    if (!id) return res.status(400).json({ error: 'id required' })
    await db.delete(blockedSlots).where(eq(blockedSlots.id, id))
    return res.json({ ok: true })
  }

  return res.status(405).end()
}
