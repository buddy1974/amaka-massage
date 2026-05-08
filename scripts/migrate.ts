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
  console.log('Running schema migration...')

  // 1. Add new columns to bookings
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_date DATE`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time TIME`
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_min INTEGER`

  // 2. Make slot_id nullable (it was NOT NULL before)
  await sql`ALTER TABLE bookings ALTER COLUMN slot_id DROP NOT NULL`

  console.log('✓ bookings: booking_date, booking_time, duration_min added')
  console.log('✓ bookings: slot_id is now nullable')
  console.log('Migration complete!')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
