import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, services, servicePrices } from './_lib.js'
import { eq, asc } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDb()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const rows = await db
      .select({
        serviceId:          services.id,
        serviceName:        services.name,
        serviceSlug:        services.slug,
        serviceDescription: services.description,
        priceId:            servicePrices.id,
        durationMin:        servicePrices.durationMin,
        priceEur:           servicePrices.priceEur,
      })
      .from(services)
      .innerJoin(servicePrices, eq(servicePrices.serviceId, services.id))
      .where(eq(services.isActive, true))
      .orderBy(asc(services.name), asc(servicePrices.durationMin))

    type ServiceEntry = {
      id: string; name: string; slug: string; description: string
      prices: { id: string; duration_min: number; price_eur: number }[]
    }

    const map: Record<string, ServiceEntry> = {}
    for (const row of rows) {
      if (!map[row.serviceId]) {
        map[row.serviceId] = {
          id: row.serviceId,
          name: row.serviceName ?? '',
          slug: row.serviceSlug ?? '',
          description: row.serviceDescription ?? '',
          prices: [],
        }
      }
      map[row.serviceId].prices.push({
        id: row.priceId,
        duration_min: row.durationMin,
        price_eur: Number(row.priceEur),
      })
    }

    return res.status(200).json(Object.values(map))
  } catch (err) {
    console.error('[services]', err)
    return res.status(500).json({ error: 'Internal server error', debug: String(err) })
  }
}
