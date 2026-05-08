import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import { db } from '../../src/lib/neon'
import { bookings, timeSlots, services, servicePrices } from '../../drizzle/schema'
import { eq, desc } from 'drizzle-orm'

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()

  if (!(await verifyAdmin(req))) return res.status(401).json({ error: 'Unauthorized' })

  // GET — list all bookings with joins
  if (req.method === 'GET') {
    const rows = await db
      .select({
        id: bookings.id,
        customerName: bookings.customerName,
        customerPhone: bookings.customerPhone,
        paymentMethod: bookings.paymentMethod,
        paymentStatus: bookings.paymentStatus,
        bookingStatus: bookings.bookingStatus,
        createdAt: bookings.createdAt,
        slotDate: timeSlots.slotDate,
        slotTime: timeSlots.slotTime,
        serviceName: services.name,
        durationMin: servicePrices.durationMin,
        priceEur: servicePrices.priceEur,
      })
      .from(bookings)
      .innerJoin(timeSlots, eq(bookings.slotId, timeSlots.id))
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .innerJoin(servicePrices, eq(bookings.priceId, servicePrices.id))
      .orderBy(desc(bookings.createdAt))
    return res.json(rows)
  }

  // PATCH — update booking status (confirm / cancel)
  if (req.method === 'PATCH') {
    const { id, bookingStatus } = req.body as { id?: string; bookingStatus?: string }
    if (!id || !bookingStatus) return res.status(400).json({ error: 'id and bookingStatus required' })
    await db.update(bookings).set({ bookingStatus }).where(eq(bookings.id, id))
    return res.json({ ok: true })
  }

  return res.status(405).end()
}
