import { neon } from '@neondatabase/serverless'
import { readFileSync, existsSync } from 'fs'

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) {
    readFileSync(f, 'utf-8').split('\n').forEach(line => {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    })
    break
  }
}

const sql = neon(process.env.DATABASE_URL!)

async function migrate() {
  console.log('Running migrations...')

  // 1. New booking columns
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_date DATE`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time TIME`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_min INTEGER`
  await sql`ALTER TABLE bookings ALTER COLUMN slot_id DROP NOT NULL`
  console.log('done: bookings date/time columns added, slot_id nullable')

  // 2. Blocked slots table for walk-in / phone bookings
  await sql`
    CREATE TABLE IF NOT EXISTS blocked_slots (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      block_date   DATE NOT NULL,
      block_time   TIME,
      duration_min INTEGER DEFAULT 60,
      note         TEXT,
      created_at   TIMESTAMP WITH TIME ZONE DEFAULT now()
    )
  `
  console.log('done: blocked_slots table ready')

  // 3. Customer email for booking confirmations
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email TEXT`
  console.log('done: bookings customer_email column added')

  console.log('\nAll migrations complete!')
}

migrate().catch(err => { console.error('Migration failed:', err); process.exit(1) })
