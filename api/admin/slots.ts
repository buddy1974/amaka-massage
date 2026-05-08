import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import { db } from '../../src/lib/neon'
import { timeSlots } from '../../drizzle/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

async function verifyAdmin(req: VercelRequest): Promise<boolean> {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return false
    const token = auth.slice(7)
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (!(await verifyAdmin(req))) return res.status(401).json({ error: 'Unauthorized' })

  // GET ?date=YYYY-MM-DD  OR  ?from=YYYY-MM-DD&to=YYYY-MM-DD
  if (req.method === 'GET') {
    const { date, from, to } = req.query as Record<string, string>
    if (date) {
      const rows = await db.select().from(timeSlots).where(eq(timeSlots.slotDate, date))
      return res.json(rows)
    }
    if (from && to) {
      const rows = await db
        .select()
        .from(timeSlots)
        .where(and(gte(timeSlots.slotDate, from), lte(timeSlots.slotDate, to)))
      return res.json(rows)
    }
    return res.status(400).json({ error: 'date or from+to required' })
  }

  // POST — bulk-create slots for a day { date, times: ["10:00","11:00",...] }
  if (req.method === 'POST') {
    const { date, times } = req.body as { date?: string; times?: string[] }
    if (!date || !Array.isArray(times) || times.length === 0)
      return res.status(400).json({ error: 'date and times[] required' })
    const rows = times.map((t) => ({ slotDate: date, slotTime: t, isAvailable: true }))
    await db.insert(timeSlots).values(rows).onConflictDoNothing()
    return res.json({ created: rows.length })
  }

  // PATCH — toggle slot availability { id, isAvailable }
  if (req.method === 'PATCH') {
    const { id, isAvailable } = req.body as { id?: string; isAvailable?: boolean }
    if (!id || isAvailable === undefined)
      return res.status(400).json({ error: 'id and isAvailable required' })
    await db.update(timeSlots).set({ isAvailable }).where(eq(timeSlots.id, id))
    return res.json({ ok: true })
  }

  // DELETE — remove a slot entirely
  if (req.method === 'DELETE') {
    const { id } = req.body as { id?: string }
    if (!id) return res.status(400).json({ error: 'id required' })
    await db.delete(timeSlots).where(eq(timeSlots.id, id))
    return res.json({ ok: true })
  }

  return res.status(405).end()
}
