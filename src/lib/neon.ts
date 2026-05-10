import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../../drizzle/schema'

// Lazy init — avoids crashing the module if DATABASE_URL is missing/malformed
let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (_db) return _db
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL environment variable is not set')
  _db = drizzle(neon(url), { schema })
  return _db
}

// Keep the named export for backward compat — will throw clearly if URL missing
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as any)[prop]
  },
})
