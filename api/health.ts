import type { VercelRequest, VercelResponse } from '@vercel/node'

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

  // Test 2: drizzle query inline
  let drizzleQuery = 'not tested'
  if (url) {
    try {
      const { neon } = await import('@neondatabase/serverless')
      const { drizzle } = await import('drizzle-orm/neon-http')
      const { services } = await import('../drizzle/schema')
      const { eq } = await import('drizzle-orm')
      const sql = neon(url)
      const db2 = drizzle(sql)
      const rows = await db2.select({ id: services.id, name: services.name }).from(services).where(eq(services.isActive, true))
      drizzleQuery = `ok — ${rows.length} services: ${rows.map(r => r.name).join(', ')}`
    } catch (e: unknown) {
      drizzleQuery = `error: ${e instanceof Error ? e.message : String(e)}`
    }
  }

  return res.status(200).json({
    ok: true,
    node: process.version,
    DATABASE_URL: dbStatus,
    rawNeon: rawResult,
    drizzleQuery,
    ts: new Date().toISOString(),
  })
}
