import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import { getDb, timeSlots } from '../_lib'
import { eq, and, gte, lte } from 'drizzle-orm'

// Opening hours — inlined from src/lib/openingHours.ts (no cross-dir import needed)
const OPENING_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: '10:00', close: '19:00' },
  2: { open: '10:00', close: '19:00' },
  3: { open: '10:00', close: '17:00' },
  4: { open: '10:00', close: '19:00' },
  5: { open: '10:00', close: '19:00' },
  6: { open: '13:00', close: '20:00' },
}
function isOpenDay(dow: number): boolean { return OPENING_HOURS[dow] !== null }
function getSlotsForDate(dateStr: string, intervalMin = 30): string[] {
  const dow = new Date(dateStr + 'T00:00:00').getDay()
  const h   = OPENING_HOURS[dow]
  if (!h) return []
  const [oH, oM] = h.open.split(':').map(Number)
  const [cH, cM] = h.close.split(':').map(Number)
  const open = oH * 60 + oM, close = cH * 60 + cM
  const slots: string[] = []
  for (let t = open; t + intervalMin <= close; t += intervalMin)
    slots.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
  return slots
}

async function verifyAdmin(req: VercelRequest): Promise<boolean> {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return false
    await jwtVerify(auth.slice(7), new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!))
    return true
  } catch { return false }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDb()
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (!(await verifyAdmin(req))) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const { date, from, to } = req.query as Record<string, string>
    if (date) return res.json(await db.select().from(timeSlots).where(eq(timeSlots.slotDate, date)))
    if (from && to) {
      return res.json(await db.select().from(timeSlots)
        .where(and(gte(timeSlots.slotDate, from), lte(timeSlots.slotDate, to))))
    }
    return res.status(400).json({ error: 'date or from+to required' })
  }

  if (req.method === 'POST') {
    const { date } = req.body as { date?: string }
    if (!date) return res.status(400).json({ error: 'date required' })
    const dow = new Date(date + 'T00:00:00').getDay()
    if (!isOpenDay(dow)) return res.status(400).json({ error: 'Closed on this day' })
    const times = getSlotsForDate(date)
    if (times.length === 0) return res.status(400).json({ error: 'No slots generated' })
    const rows = times.map(t => ({ slotDate: date, slotTime: t, isAvailable: true }))
    await db.insert(timeSlots).values(rows).onConflictDoNothing()
    return res.json({ created: rows.length, times })
  }

  if (req.method === 'PATCH') {
    const { id, isAvailable } = req.body as { id?: string; isAvailable?: boolean }
    if (!id || isAvailable === undefined) return res.status(400).json({ error: 'id and isAvailable required' })
 