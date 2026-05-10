import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const url = process.env.DATABASE_URL

  // Test DB without importing neon (pure env check)
  const dbStatus = url
    ? `set (${url.slice(0, 30)}…)`
    : 'NOT SET'

  // Try to actually connect
  let dbResult = 'not tested'
  if (url) {
    try {
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(url)
      const rows = await sql`SELECT count(*) as c FROM services WHERE is_active = true`
      dbResult = `ok — ${rows[0]?.c ?? 0} active services`
    } catch (e: unknown) {
      dbResult = `error: ${e instanceof Error ? e.message : String(e)}`
    }
  }

  return res.status(200).json({
    ok: true,
    node: process.version,
    DATABASE_URL: dbStatus,
    db: dbResult,
    ts: new Date().toISOString(),
  })
}
