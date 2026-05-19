import { pgTable, uuid, text, boolean, date, time, timestamp, numeric, integer, unique } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const services = pgTable('services', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`),
})

export const servicePrices = pgTable('service_prices', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  durationMin: integer('duration_min').notNull(),
  priceEur: numeric('price_eur', { precision: 6, scale: 2 }).notNull(),
})

// Legacy — kept so FK on bookings.slot_id still resolves
export const timeSlots = pgTable('time_slots', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slotDate: date('slot_date').notNull(),
  slotTime: time('slot_time').notNull(),
  isAvailable: boolean('is_available').default(true),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
}, (t) => [unique().on(t.slotDate, t.slotTime)])

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slotId: uuid('slot_id').references(() => timeSlots.id),   // nullable — legacy only
  serviceId: uuid('service_id').notNull().references(() => services.id),
  priceId: uuid('price_id').notNull().references(() => servicePrices.id),
  bookingDate: date('booking_date'),
  bookingTime: time('booking_time'),
  durationMin: integer('duration_min'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').default('pending'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  bookingStatus: text('booking_status').default('pending'),
  telegramMsgId: integer('telegram_msg_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`),
})

// Manual blocks — phone/walk-in bookings entered by Amaka via admin
export const blockedSlots = pgTable('blocked_slots', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  blockDate: date('block_date').notNull(),
  blockTime: time('block_time'),          // NULL = whole day blocked
  durationMin: integer('duration_min').default(60),
  note: text('note'),                     // e.g. "Telefon: Maria", "Walk-in"
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`),
})
