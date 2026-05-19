/**
 * Shared DB initialisation — lives inside api/ so Vercel's bundler
 * picks it up regardless of moduleResolution settings.
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import {
  pgTable, uuid, text, boolean, date, time,
  timestamp, numeric, integer, unique,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// ── Schema ────────────────────────────────────────────────────────────────────

export const services = pgTable('services', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name:        text('name').notNull(),
  description: text('description'),
  slug:        text('slug').unique(),
  isActive:    boolean('is_active').default(true),
  createdAt:   timestamp('created_at', { withTimezone: true }).default(sql`now()`),
})

export const servicePrices = pgTable('service_prices', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  serviceId:   uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  durationMin: integer('duration_min').notNull(),
  priceEur:    numeric('price_eur', { precision: 6, scale: 2 }).notNull(),
})

export const timeSlots = pgTable('time_slots', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slotDate:    date('slot_date').notNull(),
  slotTime:    time('slot_time').notNull(),
  isAvailable: boolean('is_available').default(true),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
}, (t) => [unique().on(t.slotDate, t.slotTime)])

export const bookings = pgTable('bookings', {
  id:                     uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slotId:                 uuid('slot_id').references(() => timeSlots.id),
  serviceId:              uuid('service_id').notNull().references(() => services.id),
  priceId:                uuid('price_id').notNull().references(() => servicePrices.id),
  bookingDate:            date('booking_date'),
  bookingTime:            time('booking_time'),
  durationMin:            integer('duration_min'),
  customerName:           text('customer_name').notNull(),
  customerPhone:          text('customer_phone').notNull(),
  customerEmail:          text('customer_email'),
  paymentMethod:          text('payment_method').notNull(),
  paymentStatus:          text('payment_status').default('pending'),
  stripePaymentIntentId:  text('stripe_payment_intent_id'),
  bookingStatus:          text('booking_status').default('pending'),
  telegramMsgId:          integer('telegram_msg_id'),
  createdAt:              timestamp('created_at', { withTimezone: true }).default(sql`now()`),
})

export const blockedSlots = pgTable('blocked_slots', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  blockDate:   date('block_date').notNull(),
  blockTime:   time('block_time'),
  durationMin: integer('duration_min').default(60),
  note:        text('note'),
  createdAt:   timestamp('created_at', { withTimezone: true }).default(sql`now()`),
})

// ── DB instance — lazy so neon() is never called at module load time ──────────

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL not set')
    _db = drizzle(neon(url), {
      schema: { services, servicePrices, timeSlots, bookings, blockedSlots },
    })
  }
  return _db
}
