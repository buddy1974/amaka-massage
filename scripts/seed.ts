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
    name: "AFRO ORIGIN – Traditionelle Massage",
    slug: "afro-origin-traditionelle-massage",
    description: "Klassische Ganzkörpermassage mit authentischen afrikanischen Techniken.",
    prices: [
      { durationMin: 30,  priceEur: '35.00' },
      { durationMin: 60,  priceEur: '55.00' },
      { durationMin: 90,  priceEur: '80.00' },
      { durationMin: 120, priceEur: '105.00' },
      { durationMin: 150, priceEur: '130.00' },
      { durationMin: 180, priceEur: '155.00' },
    ],
  },
  {
    name: "Aromaölmassage",
    slug: "aromaoelmassage",
    description: "Entspannende Massage mit wärmenden ätherischen Ölen und afrikanischen Botanicals.",
    prices: [
      { durationMin: 30,  priceEur: '35.00' },
      { durationMin: 60,  priceEur: '60.00' },
      { durationMin: 90,  priceEur: '85.00' },
      { durationMin: 120, priceEur: '115.00' },
      { durationMin: 150, priceEur: '140.00' },
      { durationMin: 180, priceEur: '165.00' },
    ],
  },
  {
    name: "Gesichts- und Kopfmassage",
    slug: "gesichts-kopfmassage",
    description: "Sanfte Massage von Gesicht und Kopf – Entspannung und Klarheit.",
    prices: [
      { durationMin: 30, priceEur: '35.00' },
      { durationMin: 60, priceEur: '55.00' },
    ],
  },
  {
    name: "Nacken- und Rückenmassage",
    slug: "nacken-rueckenmassage",
    description: "Gezielte Behandlung von Nacken und Rücken.",
    prices: [
      { durationMin: 30, priceEur: '35.00' },
      { durationMin: 60, priceEur: '55.00' },
      { durationMin: 90, priceEur: '75.00' },
    ],
  },
  {
    name: "Fußmassage",
    slug: "fussmassage",
    description: "Reflexzonenmassage der Füße – Energie und Entspannung.",
    prices: [
      { durationMin: 30, priceEur: '35.00' },
      { durationMin: 60, priceEur: '55.00' },
    ],
  },
  {
    name: "Teilkörper-Massage",
    slug: "teilkoerper-massage",
    description: "Massage von Kopf, Nacken und Beinen.",
    prices: [
      { durationMin: 30, priceEur: '35.00' },
      { durationMin: 60, priceEur: '55.00' },
    ],
  },
  {
    name: "Intensiv Massage mit Bio-Ölen",
    slug: "intensiv-massage",
    description: "Intensive Tiefenmassage mit Bio Sheabutteröl, Bio Kokosöl und Aboniki.",
    prices: [
      { durationMin: 60,  priceEur: '75.00' },
      { durationMin: 90,  priceEur: '110.00' },
      { durationMin: 120, priceEur: '145.00' },
    ],
  },
  {
    name: "Kombi 1 – Wellness Paket",
    slug: "kombi-massage-1",
    description: "Traditionelle Massage 60 Min. + Kopf-Schulter-Nacken 30 Min. + Fußmassage 30 Min.",
    prices: [{ durationMin: 120, priceEur: '109.00' }],
  },
  {
    name: "Kombi 2 – Wellness Paket",
    slug: "kombi-massage-2",
    description: "Wellness-Aroma Öl Massage 60 Min. + Kopf-Gesicht 30 Min. + Fußmassage 30 Min.",
    prices: [{ durationMin: 120, priceEur: '109.00' }],
  },
  {
    name: "Kombi 3 – Hot Stone Paket",
    slug: "kombi-massage-3",
    description: "Hot-Stone Massage 90 Min. + Kopf-Nacken und Fußmassage 30 Min.",
    prices: [{ durationMin: 120, priceEur: '119.00' }],
  },
  {
    name: "Physical Chat-Room",
    slug: "physical-chat-room",
    description: "Ein sicherer, angenehmer Ort zum Reden, Entspannen und Abschalten.",
    prices: [
      { durationMin: 60,  priceEur: '75.00' },
      { durationMin: 90,  priceEur: '100.00' },
      { durationMin: 120, priceEur: '140.00' },
      { durationMin: 150, priceEur: '180.00' },
      { durationMin: 180, priceEur: '215.00' },
    ],
  },
]

const ACTIVE_SLUGS = seedData.map(s => s.slug)

async function seed() {
  console.log('🌱 Seeding Amaka\'s City services...\n')

  // Deactivate any old services not in current list
  const deactivated = await db
    .update(schema.services)
    .set({ isActive: false })
    .where(notInArray(schema.services.slug, ACTIVE_SLUGS))
    .returning({ slug: schema.services.slug })
  if (deactivated.length) console.log('⚠  Deactivated:', deactivated.map(r => r.slug).join(', '))

  for (const svc of seedData) {
    // Upsert service
    const [row] = await db
      .insert(schema.services)
      .values({ name: svc.name, slug: svc.slug, description: svc.description, isActive: true })
      .onConflictDoUpdate({
        target: schema.services.slug,
        set: { name: svc.name, description: svc.description, isActive: true },
      })
      .returning({ id: schema.services.id })

    // Replace prices
    await db.delete(schema.servicePrices).where(eq(schema.servicePrices.serviceId, row.id))
    await db.insert(schema.servicePrices).values(
      svc.prices.map(p => ({ serviceId: row.id, durationMin: p.durationMin, priceEur: p.priceEur }))
    )
    console.log(`✅  ${svc.name} (${svc.prices.length} Preise)`)
  }
  console.log('\n✨ Seed abgeschlossen.')
}

seed().catch(err => { console.error(err); process.exit(1) })
