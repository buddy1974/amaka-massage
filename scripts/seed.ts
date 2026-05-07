import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { readFileSync, existsSync } from 'fs'
import * as schema from '../drizzle/schema'
import { eq } from 'drizzle-orm'

// Load .env.local for local runs
for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) {
    readFileSync(f, 'utf-8').split('\n').forEach(line => {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    })
    break
  }
}

const db = drizzle(neon(process.env.DATABASE_URL!), { schema })

const seedData = [
  {
    name: 'Traditional Afro Massage',
    slug: 'traditional-afro-massage',
    description: 'Classic full-body relaxation with African-inspired smooth, flowing strokes.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '45.00' },
      { durationMin: 90, priceEur: '60.00' },
    ],
  },
  {
    name: 'Afro Aroma Oil Massage',
    slug: 'afro-aroma-oil-massage',
    description: 'Warm essential oils with African botanicals for deep calm and skin nourishment.',
    prices: [
      { durationMin: 30, priceEur: '30.00' },
      { durationMin: 60, priceEur: '50.00' },
      { durationMin: 90, priceEur: '70.00' },
    ],
  },
  {
    name: 'Afro Deep Tissue Massage',
    slug: 'afro-deep-tissue-massage',
    description: 'Firm, targeted pressure to release tension deep in the muscles.',
    prices: [
      { durationMin: 30, priceEur: '35.00' },
      { durationMin: 60, priceEur: '55.00' },
      { durationMin: 90, priceEur: '75.00' },
    ],
  },
  {
    name: 'Afro Hot Stone Massage',
    slug: 'afro-hot-stone-massage',
    description: 'Warm basalt stones melt away stress and stiffness in harmony with the body.',
    prices: [
      { durationMin: 60, priceEur: '60.00' },
      { durationMin: 90, priceEur: '80.00' },
    ],
  },
  {
    name: 'Afro Foot Massage',
    slug: 'afro-foot-massage',
    description: 'Reflexology-inspired pressure to restore energy to tired feet.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
    ],
  },
  {
    name: 'Afro Head & Face Massage',
    slug: 'afro-head-face-massage',
    description: 'Soothing Afro techniques to release tension in the head, scalp, and face.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
    ],
  },
]

async function seed() {
  console.log('🌱 Seeding database...\n')

  for (const s of seedData) {
    const existing = await db
      .select({ id: schema.services.id })
      .from(schema.services)
      .where(eq(schema.services.slug, s.slug))
      .limit(1)

    if (existing.length > 0) {
      console.log(`  ↳ ${s.name} already exists, skipping`)
      continue
    }

    const [svc] = await db
      .insert(schema.services)
      .values({ name: s.name, slug: s.slug, description: s.description, isActive: true })
      .returning({ id: schema.services.id })

    for (const p of s.prices) {
      await db.insert(schema.servicePrices).values({
        serviceId: svc.id,
        durationMin: p.durationMin,
        priceEur: p.priceEur,
      })
    }

    console.log(`  ✓ ${s.name} (${s.prices.length} price tiers)`)
  }

  console.log('\n✅ Seeding complete!')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
