import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, services } from './_lib.js'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const url = process.env.DATABASE_URL
  const dbStatus = url ? `set (${url.slice(0, 30)}…)` : 'NOT SET'

  // Test 1: raw neon SQL
  let rawResult = 'not tested'
  if (url) {
    try {
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(url)
      const rows = await sql`SELECT count(*) as c FROM services WHERE is_active = true`
      rawResult = `ok — ${rows[0]?.c ?? 0} active services`
    } catch (e: unknown) {
      rawResult = `error: ${e instanceof Error ? e.message : String(e)}`
    }
  }

  // Test 2: drizzle via _lib
  let drizzleResult = 'not tested'
  try {
    const db = getDb()
    const rows = await db.select({ id: services.id, name: services.name }).from(services).limit(3)
    drizzleResult = `ok — ${rows.length} rows: ${rows.map(r => r.name).join(', ')}`
  } catch (e: unknown) {
    drizzleResult = `error: ${e instanceof Error ? e.message : String(e)}`
  }

  return res.status(200).json({
    ok: true,
    node: process.version,
    DATABASE_URL: dbStatus,
    rawNeon: rawResult,
    drizzleQuery: drizzleResult,
    ts: new Date().toISOString(),
  })
}
