import { pgTable, uuid, text, boolean, date, time, timestamptz, numeric, integer } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const services = pgTable('services', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamptz('created_at').default(sql`now()`),
})

export const servicePrices = pgTable('service_prices', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  durationMin: integer('duration_min').notNull(),
  priceEur: numeric('price_eur', { precision: 6, scale: 2 }).notNull(),
})

export const timeSlots = pgTable('time_slots', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slotDate: date('slot_date').notNull(),
  slotTime: time('slot_time').notNull(),
  isAvailable: boolean('is_available').default(true),
  lockedUntil: timestamptz('locked_until'),
})

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slotId: uuid('slot_id').notNull().references(() => timeSlots.id),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  priceId: uuid('price_id').notNull().references(() => servicePrices.id),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').default('pending'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  bookingStatus: text('booking_status').default('pending'),
  telegramMsgId: integer('telegram_msg_id'),
  createdAt: timestamptz('created_at').default(sql`now()`),
})
