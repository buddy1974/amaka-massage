import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { readFileSync, existsSync } from 'fs'
import * as schema from '../drizzle/schema'
import { eq, notInArray } from 'drizzle-orm'

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
    description: 'Classic full-body relaxation with authentic African smooth, flowing strokes.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
      { durationMin: 90, priceEur: '58.00' },
    ],
  },
  {
    name: 'Aroma Oil Massage',
    slug: 'aroma-oil-massage',
    description: 'Warm essential oils with African botanicals for deep calm and skin nourishment.',
    prices: [
      { durationMin: 30, priceEur: '30.00' },
      { durationMin: 60, priceEur: '49.00' },
      { durationMin: 90, priceEur: '69.00' },
    ],
  },
  {
    name: 'Deep Tissue Massage',
    slug: 'deep-tissue-massage',
    description: 'Firm, targeted pressure to release tension deep in the muscles.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
      { durationMin: 90, priceEur: '58.00' },
    ],
  },
  {
    name: 'Hot Stone Massage',
    slug: 'hot-stone-massage',
    description: 'Smooth heated basalt stones melt away stiffness and promote deep relaxation.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
      { durationMin: 90, priceEur: '58.00' },
    ],
  },
  {
    name: 'Foot Reflexology',
    slug: 'foot-reflexology',
    description: 'Targeted pressure on reflex points of the feet to relieve stress and restore balance.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
      { durationMin: 90, priceEur: '58.00' },
    ],
  },
  {
    name: 'Head & Shoulder Massage',
    slug: 'head-shoulder-massage',
    description: 'Focused relief for neck, shoulder, and scalp tension.',
    prices: [
      { durationMin: 30, priceEur: '25.00' },
      { durationMin: 60, priceEur: '40.00' },
      { durationMin: 90, priceEur: '58.00' },
    ],
  },
]

const ACTIVE_SLUGS = seedData.map(s => s.slug)

async function seed() {
  console.log('🌱 Seeding database...\n')

  // Step 1: deactivate any legacy services not in the current slug list
  const deactivated = await db
    .update(schema.services)
    .set({ isActive: false })
    .where(notInArray(schema.services.slug, ACTIVE_SLUGS))
    .returning({ slug: schema.services.slug })

  if (deactivated.length > 0) {
    console.log(`  🗑  Deactivated ${deactivated.length} legacy service(s): ${deactivated.map(d => d.slug).join(', ')}\n`)
  }

  // Step 2: upsert current services
  for (const s of seedData) {
    const existing = await db
      .select({ id: schema.services.id })
      .from(schema.services)
      .where(eq(schema.services.slug, s.slug))
      .limit(1)

    let serviceId: string

    if (existing.length > 0) {
      serviceId = existing[0].id
      await db.update(schema.services)
        .set({ name: s.name, description: s.description, isActive: true })
        .where(eq(schema.services.slug, s.slug))
      console.log(`  ↻ ${s.name} — updated`)
    } else {
      const [svc] = await db
        .insert(schema.services)
        .values({ name: s.name, slug: s.slug, description: s.description, isActive: true })
        .returning({ id: schema.services.id })
      serviceId = svc.id
      console.log(`  ✓ ${s.name} — created`)
    }

    // Refresh prices: delete existing then re-insert
    await db.delete(schema.servicePrices)
      .where(eq(schema.servicePrices.serviceId, serviceId))
    for (const p of s.prices) {
      await db.insert(schema.servicePrices).values({
        serviceId,
        durationMin: p.durationMin,
        priceEur: p.priceEur,
      })
    }
  }

  console.log('\n✅ Seeding complete!')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
