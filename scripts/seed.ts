import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { readFileSync, existsSync } from 'fs'
import * as schema from '../drizzle/schema'
import { eq, notInArray } from 'drizzle-orm'


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
    name: "Wellness Massage mit Öl",
    slug: "wellness-massage",
    description: "Klassische Ganzkörpermassage mit hochwertigen Ölen und authentischer Afro Touch Technik.",
    prices: [
      { durationMin: 60,  priceEur: '55.00' },
      { durationMin: 90,  priceEur: '80.00' },
      { durationMin: 120, priceEur: '105.00' },
      { durationMin: 150, priceEur: '130.00' },
      { durationMin: 180, priceEur: '155.00' },
    ],
  },
  {
    name: "Intensiv Massage",
    slug: "intensiv-massage",
    description: "Intensive Tiefenmassage mit Bio Sheabutteröl, Bio Kokosöl & Aboniki Menthol. Bei Migräne, Stress und starker körperlicher Belastung.",
    prices: [
      { durationMin: 30,  priceEur: '45.00' },
      { durationMin: 60,  priceEur: '75.00' },
      { durationMin: 90,  priceEur: '110.00' },
      { durationMin: 120, priceEur: '145.00' },
    ],
  },
  {
    name: "Aromaölmassage",
    slug: "aromaoelmassage",
    description: "Entspannende Massage mit wärmenden ätherischen Ölen für tiefe Ruhe und Hautpflege.",
    prices: [
      { durationMin: 30,  priceEur: '40.00' },
      { durationMin: 60,  priceEur: '60.00' },
      { durationMin: 90,  priceEur: '85.00' },
      { durationMin: 120, priceEur: '115.00' },
      { durationMin: 150, priceEur: '140.00' },
      { durationMin: 180, priceEur: '170.00' },
    ],
  },
  {
    name: "Teilkörper-Massage",
    slug: "teilkoerper-massage",
    description: "Gesicht & Kopf / Nacken & Rücken / Fuß / Kopf-Nacken-Beine – gezielte Entspannung einzelner Zonen.",
    prices: [
      { durationMin: 30, priceEur: '35.00' },
      { durationMin: 60, priceEur: '50.00' },
      { durationMin: 90, priceEur: '70.00' },
    ],
  },
  {
    name: "Hot-Stone Massage",
    slug: "hot-stone-massage",
    description: "Warme Basaltsteine lösen tiefe Muskelverspannungen – ideal bei Stress, Kälte und hartnäckigen Rückenproblemen.",
    prices: [
      { durationMin: 60,  priceEur: '65.00' },
      { durationMin: 90,  priceEur: '95.00' },
      { durationMin: 120, priceEur: '125.00' },
    ],
  },
  {
    name: "Entspannungsmassage nach OP",
    slug: "massage-nach-op",
    description: "Behutsame Massage zur Regeneration nach Operationen. Nur mit ärztlicher Freigabe.",
    prices: [
      { durationMin: 30,  priceEur: '40.00' },
      { durationMin: 60,  priceEur: '70.00' },
      { durationMin: 90,  priceEur: '100.00' },
      { durationMin: 120, priceEur: '135.00' },
    ],
  },
  {
    name: "Seelische Auszeit – Gesprächsbegleitung",
    slug: "seelische-auszeit",
    description: "Ein sicherer, ruhiger Ort zum Abschalten und Reden. Mit jeder Massage 20 % Rabatt.",
    prices: [
      { durationMin: 60,  priceEur: '55.00' },
      { durationMin: 90,  priceEur: '80.00' },
      { durationMin: 120, priceEur: '105.00' },
      { durationMin: 150, priceEur: '130.00' },
      { durationMin: 180, priceEur: '160.00' },
    ],
  },
  {
    name: "Kombi 1 – Tiefenentspannung Komplett",
    slug: "kombi-1-tiefenentspannung",
    description: "Wellness 60 Min. + Kopf-Schulter-Nacken 30 Min. + Fuß 30 Min. = 2 Std.",
    prices: [
      { durationMin: 120, priceEur: '105.00' },
    ],
  },
  {
    name: "Kombi 2 – Aroma Auszeit",
    slug: "kombi-2-aroma-auszeit",
    description: "Aromaöl 60 Min. + Kopf-Gesicht 30 Min. + Fuß 30 Min. = 2 Std.",
    prices: [
      { durationMin: 120, priceEur: '115.00' },
    ],
  },
  {
    name: "Kombi 3 – Hot-Stone Power",
    slug: "kombi-3-hot-stone-power",
    description: "Hot-Stone 90 Min. + Kopf-Nacken 30 Min. + Fuß 30 Min. = 2 Std.",
    prices: [
      { durationMin: 120, priceEur: '115.00' },
    ],
  },
  {
    name: "Kombi 4 – Wellness + Intensiv 120",
    slug: "kombi-4-wellness-intensiv",
    description: "Wellness 60 Min. + Intensiv 60 Min. = 2 Std.",
    prices: [
      { durationMin: 120, priceEur: '125.00' },
    ],
  },
  {
    name: "Kombi 5 – Wellness + Intensiv 90",
    slug: "kombi-5-wellness-intensiv-kompakt",
    description: "Wellness 60 Min. + Intensiv 30 Min. = 90 Min.",
    prices: [
      { durationMin: 90, priceEur: '95.00' },
    ],
  },
]

async function seed() {
  console.log('Seeding services...')
  const activeSlugsList = seedData.map(s => s.slug)

  for (const svc of seedData) {
    const existing = await db
      .select({ id: schema.services.id })
      .from(schema.services)
      .where(eq(schema.services.slug, svc.slug))
      .limit(1)

    let serviceId: string

    if (existing.length > 0) {
      serviceId = existing[0].id
      await db.update(schema.services)
        .set({ name: svc.name, description: svc.description, isActive: true })
        .where(eq(schema.services.id, serviceId))
      console.log('  updated:', svc.name)
    } else {
      const [row] = await db.insert(schema.services)
        .values({ name: svc.name, slug: svc.slug, description: svc.description, isActive: true })
        .returning({ id: schema.services.id })
      serviceId = row.id
      console.log('  inserted:', svc.name)
    }

    // Load current prices and booked price IDs (to avoid FK violation on delete)
    const currentPrices = await db
      .select({ id: schema.servicePrices.id, durationMin: schema.servicePrices.durationMin })
      .from(schema.servicePrices)
      .where(eq(schema.servicePrices.serviceId, serviceId))

    const bookedPrices = await db
      .select({ priceId: schema.bookings.priceId })
      .from(schema.bookings)
      .where(eq(schema.bookings.serviceId, serviceId))
    const bookedIds = new Set(bookedPrices.map(b => b.priceId))

    const currentByDuration = new Map(currentPrices.map(p => [p.durationMin, p.id]))
    const newDurations = new Set(svc.prices.map(p => p.durationMin))

    // Upsert: update existing durations, insert new ones
    for (const p of svc.prices) {
      const existingId = currentByDuration.get(p.durationMin)
      if (existingId) {
        await db.update(schema.servicePrices)
          .set({ priceEur: p.priceEur })
          .where(eq(schema.servicePrices.id, existingId))
      } else {
        await db.insert(schema.servicePrices)
          .values({ serviceId, durationMin: p.durationMin, priceEur: p.priceEur })
      }
    }

    // Delete prices removed from seed — only if no booking references them
    for (const cp of currentPrices) {
      if (!newDurations.has(cp.durationMin) && !bookedIds.has(cp.id)) {
        await db.delete(schema.servicePrices).where(eq(schema.servicePrices.id, cp.id))
      }
    }
  }

  // Deactivate removed services
  await db.update(schema.services)
    .set({ isActive: false })
    .where(notInArray(schema.services.slug, activeSlugsList))

  console.log('\nSeed complete!')
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })
