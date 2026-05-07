# AMAKA MASSAGE — SYSTEM ARCHITECTURE
**Premium Afro Massage Website + Smart Booking System + Automation**

> Role: System Architect (Claude Cowork)
> Executor: Claude Code (VS Code)
> PM: Marcel (User)
> Updated: 2026-05-07

---

## 1. SYSTEM OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│                     amaka-massage.de                         │
│          React + TypeScript + Vite + Tailwind                │
│  Home | Services | Offers | Booking | Contact | Admin        │
└─────────────────────┬────────────────────────────────────────┘
                      │ fetch() to /api/* (Vercel Serverless)
┌─────────────────────▼────────────────────────────────────────┐
│              VERCEL SERVERLESS FUNCTIONS  /api/              │
│   booking | slots | payments | telegram | admin | reviews    │
└──────┬──────────────┬──────────────────────────┬─────────────┘
       │              │                          │
  ┌────▼─────┐  ┌─────▼──────┐           ┌──────▼──────┐
  │   NEON   │  │   STRIPE   │           │  TELEGRAM   │
  │ Postgres │  │  Payments  │           │     Bot     │
  └──────────┘  └────────────┘           └─────────────┘
```

**Decision: STAY on Vercel.**
The frontend is already deployed there. Vercel Serverless Functions (`/api` directory) replace Supabase Edge Functions directly. Neon is Vercel's recommended Postgres partner — first-class integration, free tier, serverless-native driver.

---

## 2. TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Already deployed on Vercel |
| Styling | Tailwind CSS + shadcn/ui | Already in place |
| Hosting | **Vercel** | Keep — no migration needed |
| Database | **Neon** (serverless PostgreSQL) | Vercel-native partner, free tier |
| DB Driver | `@neondatabase/serverless` | HTTP-mode, works in Vercel Functions |
| ORM | **Drizzle ORM** | TypeScript-first, lightweight, Neon-native |
| API layer | **Vercel Serverless Functions** (`/api`) | Replaces Supabase Edge Functions |
| Admin Auth | **JWT** (`jose`) + bcrypt | Single admin user, env-var credentials |
| Payments | **Stripe** | PaymentIntent flow + webhooks |
| Telegram | **Telegraf.js** | Webhook-based, called from /api function |
| Realtime slots | **Polling** (5s interval) | Simple, zero extra dependency |
| QR Codes | `qrcode` npm package | Client-side generation |
| Reviews (P1) | Static JSON | Fast, no API cost at launch |
| Reviews (P2) | Google Places API | Live fetching via /api/reviews |
| AI Chat | Rule-based FAQ component | Pure frontend, zero cost |

---

## 3. BRAND & CONTENT RULES

### Global Text Replacements
All generic massage wording → replaced with:
- "Afro Massage"
- "Premium Afro Massage"
- "Afro Massage by Amaka"

### Service Names (strict)
| Old | New |
|---|---|
| Traditional Massage | Traditional Afro Massage |
| Aroma Oil Massage | Afro Aroma Oil Massage |
| Deep Tissue Massage | Afro Deep Tissue Massage |
| Hot Stone Massage | Afro Hot Stone Massage |
| Foot Massage | Afro Foot Massage |
| Head & Face Massage | Afro Head & Face Massage |

### Pricing (fixed — already correct in codebase)
| Service | 30 min | 60 min | 90 min |
|---|---|---|---|
| Traditional Afro | 25 € | 45 € | 60 € |
| Afro Aroma Oil | 30 € | 50 € | 70 € |
| Afro Deep Tissue | 35 € | 55 € | 75 € |
| Afro Hot Stone | — | 60 € | 80 € |
| Afro Foot | 25 € | 40 € | — |
| Afro Head & Face | 25 € | 40 € | — |

### Design Tokens
```
Primary:    #5A2A83  (Deep Purple)
Accent:     #9B59B6  (Soft Purple)
Background: #FFFFFF  (White)
Text:       #111111  (Near Black)
Success:    #27AE60  (Green — available slots)
Danger:     #E74C3C  (Red — booked slots)
```

---

## 4. WEBSITE STRUCTURE

```
/              → Home
/services      → Afro Massage Services & Prices
/offers        → Offers & Packages
/booking       → Booking System (NEW)
/contact       → Contact
/admin         → Admin Dashboard (protected, NEW)
/admin/login   → Admin Login
```

### Home Page Sections (order)
1. Hero — headline + CTA "Book Now"
2. About — Afro Massage by Amaka
3. Services preview (3 cards)
4. Google Reviews (3–5 stars, static Phase 1)
5. Offers teaser
6. CTA banner — Book / WhatsApp
7. AI Chat widget (fixed bottom right, above WhatsApp button)

---

## 5. PROJECT STRUCTURE AFTER BUILD

```
amaka-massage/
├── api/                          ← Vercel Serverless Functions (NEW)
│   ├── slots.ts                  GET  /api/slots?date=YYYY-MM-DD
│   ├── bookings.ts               POST /api/bookings
│   ├── create-payment-intent.ts  POST /api/create-payment-intent
│   ├── stripe-webhook.ts         POST /api/stripe-webhook
│   ├── telegram-webhook.ts       POST /api/telegram-webhook
│   ├── cancel-booking.ts         POST /api/cancel-booking
│   ├── admin/
│   │   ├── login.ts              POST /api/admin/login
│   │   ├── bookings.ts           GET  /api/admin/bookings
│   │   ├── slots.ts              POST/PUT /api/admin/slots
│   │   └── manual-booking.ts     POST /api/admin/manual-booking
│   └── reviews.ts                GET  /api/reviews  (Phase 2)
│
├── src/
│   ├── assets/
│   │   ├── hero-massage.png      ✅ done
│   │   └── [service images]
│   ├── components/
│   │   ├── site/
│   │   │   ├── Navbar.tsx        ✅ logo updated
│   │   │   ├── Footer.tsx        ✅ logo + maxpromo credit
│   │   │   ├── Layout.tsx
│   │   │   ├── ReviewsSection.tsx   (Phase 6)
│   │   │   └── AiChat.tsx           (Phase 7)
│   │   ├── booking/
│   │   │   ├── ServicePicker.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── TimePicker.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── PaymentSelector.tsx
│   │   │   ├── ConfirmScreen.tsx
│   │   │   └── BookingQR.tsx
│   │   ├── admin/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── AdminCalendar.tsx
│   │   │   ├── BookingsList.tsx
│   │   │   ├── SlotManager.tsx
│   │   │   └── ManualBooking.tsx
│   │   └── ui/                   (shadcn, existing)
│   ├── data/
│   │   ├── services.ts           (update Phase 1)
│   │   └── reviews.ts            (Phase 6, static)
│   ├── hooks/
│   │   ├── useBooking.ts
│   │   └── useSlots.ts           (polling logic)
│   ├── lib/
│   │   ├── neon.ts               DB client (server-side only)
│   │   ├── stripe.ts             Stripe client
│   │   └── auth.ts               JWT verify helper
│   └── pages/
│       ├── Index.tsx             ✅ updated
│       ├── Services.tsx
│       ├── Offers.tsx
│       ├── Booking.tsx           (NEW)
│       ├── About.tsx
│       ├── Contact.tsx
│       ├── Admin.tsx             (NEW)
│       ├── AdminLogin.tsx        (NEW)
│       └── NotFound.tsx
│
├── drizzle/
│   ├── schema.ts                 Drizzle table definitions
│   └── migrations/
│       └── 0001_initial.sql
│
├── public/
│   ├── logo.png                  ✅ done
│   ├── favicon.png               ✅ done
│   └── robots.txt
│
├── .env.local                    (never committed)
├── drizzle.config.ts
├── vercel.json
├── index.html                    ✅ favicon wired
└── package.json
```

---

## 6. DATABASE SCHEMA (Drizzle / Neon PostgreSQL)

### `services`
```typescript
id           uuid PK default gen_random_uuid()
name         text NOT NULL         -- "Traditional Afro Massage"
description  text
slug         text UNIQUE           -- "traditional-afro-massage"
is_active    boolean default true
created_at   timestamp default now()
```

### `service_prices`
```typescript
id           uuid PK
service_id   uuid FK → services.id ON DELETE CASCADE
duration_min integer NOT NULL      -- 30 | 60 | 90
price_eur    numeric(6,2) NOT NULL
```

### `time_slots`
```typescript
id           uuid PK
slot_date    date NOT NULL
slot_time    time NOT NULL          -- "10:00", "11:00" etc.
is_available boolean default true
locked_until timestamptz            -- NULL when free
UNIQUE (slot_date, slot_time)
```

### `bookings`
```typescript
id                      uuid PK
slot_id                 uuid FK → time_slots.id
service_id              uuid FK → services.id
price_id                uuid FK → service_prices.id
customer_name           text NOT NULL
customer_phone          text NOT NULL
payment_method          text NOT NULL   -- 'stripe' | 'on_site'
payment_status          text default 'pending'  -- 'pending'|'paid'|'refunded'|'failed'
stripe_payment_intent_id text
booking_status          text default 'pending'  -- 'pending'|'confirmed'|'cancelled'
telegram_msg_id         integer         -- for editing Telegram messages
created_at              timestamptz default now()
```

---

## 7. API ROUTES (Vercel Serverless Functions)

### Public endpoints
```
GET  /api/slots?date=YYYY-MM-DD
     → Returns all slots for a date with is_available + locked_until status
     → Frontend polls this every 5s during booking flow

POST /api/bookings
     Body: { slot_id, service_id, price_id, customer_name, customer_phone, payment_method }
     → Checks slot available + not locked
     → Sets locked_until = now() + 15 min
     → Inserts booking (status: pending)
     → Calls Telegram notification
     → Returns { booking_id, client_secret? }

POST /api/create-payment-intent
     Body: { booking_id }
     → Verifies booking is pending
     → Creates Stripe PaymentIntent
     → Stores stripe_payment_intent_id
     → Returns { client_secret }

POST /api/stripe-webhook
     → Verifies Stripe signature
     → payment_intent.succeeded → confirm booking, free lock
     → payment_intent.payment_failed → cancel booking, free lock

POST /api/telegram-webhook
     → Handles Amaka's Confirm / Cancel button presses
     → Confirm: booking_status = 'confirmed', edit Telegram message
     → Cancel: calls cancel logic, refund if paid, free slot
```

### Protected endpoints (require JWT Bearer token)
```
POST /api/admin/login
     Body: { password }
     → Compares against ADMIN_PASSWORD_HASH env var
     → Returns signed JWT (24h expiry)

GET  /api/admin/bookings?from=&to=&status=
     → Returns bookings list with filters

POST /api/admin/slots
     Body: { date_from, date_to, times[], interval_min }
     → Bulk-generates time_slots rows

PUT  /api/admin/slots/:id
     Body: { is_available }
     → Toggle slot on/off

POST /api/admin/manual-booking
     → Create booking bypassing the public flow

POST /api/cancel-booking
     Body: { booking_id }
     → booking_status = 'cancelled'
     → If paid → Stripe refund
     → time_slot.is_available = true, locked_until = null
     → Edit Telegram message
```

---

## 8. BOOKING SYSTEM LOGIC

### User Flow (6 steps)
```
1. SELECT SERVICE     → service card grid
2. SELECT DATE        → calendar (disabled: past + fully booked days)
3. SELECT TIME SLOT   → fetch /api/slots?date=X, poll every 5s
                        Green = available | Red = booked/locked
4. ENTER DETAILS      → name + phone (German phone validation)
5. SELECT PAYMENT     → "Pay by card" (Stripe) | "Pay on-site"
6. CONFIRM            → POST /api/bookings → lock slot → show QR
```

### Double-Booking Prevention (layered)
```
Layer 1 — Frontend:    Grey out unavailable slots in UI
Layer 2 — API check:   if locked_until > now() OR is_available = false → 409 Conflict
Layer 3 — DB:          UNIQUE(slot_date, slot_time) — rejects duplicates at DB level
Layer 4 — Lock expiry: Cron job (Vercel Cron, every 5 min) releases stale locks
```

### Lock Cleanup Cron (`vercel.json`)
```json
{
  "crons": [{
    "path": "/api/cleanup-locks",
    "schedule": "*/5 * * * *"
  }]
}
```
Logic: `UPDATE time_slots SET locked_until = NULL WHERE locked_until < now() AND id NOT IN (SELECT slot_id FROM bookings WHERE booking_status NOT IN ('cancelled'))`

---

## 9. STRIPE PAYMENT FLOW

```
Frontend                     /api                        Stripe
   │                            │                           │
   ├─POST /api/bookings ────────►│                           │
   │◄── { booking_id } ─────────┤                           │
   │                            │                           │
   ├─POST /api/create-payment ──►│                           │
   │   intent { booking_id }     ├─── createPaymentIntent ──►│
   │                            │◄── { client_secret } ─────┤
   │◄── { client_secret } ──────┤                           │
   │                            │                           │
   ├─ Stripe.confirmPayment() ──────────────────────────────►│
   │  (card form / Apple Pay)    │                           │
   │◄─── redirect to /success ───────────────────────────────┤
   │                            │                           │
   │             ◄──── POST /api/stripe-webhook ─────────────┤
   │                            │  payment_intent.succeeded  │
   │                     update DB + Telegram                │
```

### Refund Flow (Amaka cancels)
```
Amaka hits ❌ Cancel in Telegram
  → POST /api/cancel-booking { booking_id }
  → IF payment_status = 'paid':
      stripe.refunds.create({ payment_intent: booking.stripe_payment_intent_id })
      booking.payment_status = 'refunded'
  → booking.booking_status = 'cancelled'
  → time_slot.is_available = true
  → Edit Telegram message: "❌ CANCELLED — Refund issued"
```

---

## 10. TELEGRAM BOT LOGIC

### Bot Setup
- Create via @BotFather → get token
- Register webhook: `POST https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://amaka-massage.de/api/telegram-webhook`
- Store in Vercel env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`

### Notification Message (sent to Amaka on new booking)
```
📅 NEW BOOKING

👤 Sarah Müller
💆 Afro Deep Tissue Massage – 60 min
📆 Monday, 12 May 2026
🕐 14:00
💳 Pay on-site
📞 +49 176 1234 5678

Ref: AMK-0042
```
Inline keyboard: `[ ✅ Confirm ]   [ ❌ Cancel ]`

### Callback Handler (`/api/telegram-webhook`)
```
callback_data format: "confirm:BOOKING_ID" | "cancel:BOOKING_ID"

CONFIRM:
  → booking_status = 'confirmed'
  → editMessageText: remove buttons, append "✅ CONFIRMED"

CANCEL:
  → call cancel-booking logic
  → editMessageText: remove buttons, append "❌ CANCELLED"
```

---

## 11. ADMIN DASHBOARD

### Auth: Simple JWT (no auth library needed)
```
Login: POST /api/admin/login { password }
  → bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
  → If match: return JWT signed with ADMIN_JWT_SECRET, 24h expiry
  → Frontend stores JWT in memory (not localStorage)

Protected routes: check Authorization: Bearer <token>
  → jose.jwtVerify(token, ADMIN_JWT_SECRET)
  → 401 if missing or expired
```

### Dashboard Views
```
Calendar tab
  → Monthly grid
  → Each cell: "3/8 booked" style badge
  → Click day → slide-in drawer with that day's bookings
  → Green day = slots free | Red day = full | Grey = no slots

Bookings tab
  → Table: Date | Time | Name | Service | Duration | Payment | Status | Actions
  → Filters: date range, status, service
  → Per-row actions: View, Confirm, Cancel

Slots tab
  → Date range picker + time range + interval selector
  → "Generate Slots" button → POST /api/admin/slots
  → Block single dates (holidays)
  → Toggle individual slots on/off

Manual Booking tab
  → Same flow as public booking but admin-triggered
  → No payment step (admin marks as paid/on-site)
```

---

## 12. ENVIRONMENT VARIABLES

### `.env.local` (frontend + local API dev)
```
DATABASE_URL=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
TELEGRAM_BOT_TOKEN=xxx:xxx
TELEGRAM_ADMIN_CHAT_ID=123456789
ADMIN_PASSWORD_HASH=$2b$10$xxx       # bcrypt hash of Amaka's password
ADMIN_JWT_SECRET=random-64-char-string
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
VITE_APP_URL=https://amaka-massage.de
```

### Vercel Dashboard (production)
Same keys added under Project → Settings → Environment Variables.

---

## 13. GOOGLE REVIEWS

### Phase 1 — Static (ship now)
```typescript
// src/data/reviews.ts
export const reviews = [
  { author: "Lena K.", rating: 5, text: "Amazing experience, truly premium!", date: "2025-04-10" },
  { author: "Marcus B.", rating: 5, text: "Best massage in Essen. Will be back.", date: "2025-03-22" },
  // ... 3 more
]
```

### Phase 2 — Live via Google Places API
```
GET /api/reviews
  → Google Places Details endpoint
  → place_id stored in env: GOOGLE_PLACE_ID
  → Cache response 24h (simple in-memory or Vercel KV)
  → Return top 5 by rating
```

### Reviews Section UI
```
- 5-star cards in a responsive row
- Author + date + star rating
- Text (max 3 lines, "Show more" toggle)
- Bottom: "Leave us a review on Google →" button → maps link
```

---

## 14. AI CHAT (LIGHT)

Pure React component. Zero external API. Zero cost.

### Keyword → Response Map
```
prices / cost / how much  → services table with prices
hours / open / time       → Mon–Fri 10–19, Sat 13–20
book / appointment        → "Book online here →" /booking
address / where / location → Bochumer Landstraße 154, 45276 Essen + Maps link
phone / call / whatsapp   → 0159 06306248
cancel / reschedule       → "Please call or WhatsApp: 0159 06306248"
[no match]                → "Call or WhatsApp us at 0159 06306248"
```

### UI
```
Fixed bottom-right, z-index above WhatsApp button
Open/close toggle button
Chat bubble layout (user right, bot left)
Quick-reply chips: "Prices" | "Book now" | "Opening hours" | "Location"
Max-width 300px, max-height 420px, scrollable
```

---

## 15. QR CODE + BOOKING LINK

```
Booking URL:  https://amaka-massage.de/booking
Pre-selected: https://amaka-massage.de/booking?service=traditional-afro-massage

QR generation (client-side):
  import QRCode from 'qrcode'
  const url = await QRCode.toDataURL('https://amaka-massage.de/booking')
  → Renders as <img src={url} />

Admin Dashboard:
  "Download QR" button → saves PNG
  Use on: flyers, WhatsApp, Instagram stories
```

---

## 16. FOOTER

```typescript
// Mandatory line (bottom of Footer.tsx)
© {new Date().getFullYear()} Amaka Massage – Essen
Website developed by <a href="https://maxpromo.digital">maxpromo.digital</a>
```

---

## 17. CLAUDE CODE EXECUTION PLAN

Execute in strict phase order. Each step is a single Claude Code task.

---

### PHASE 0 — SETUP & INFRASTRUCTURE

**Step 0.1 — Install dependencies**
```bash
npm install drizzle-orm @neondatabase/serverless
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install telegraf
npm install jose bcryptjs qrcode
npm install --save-dev drizzle-kit @types/bcryptjs @types/qrcode
```

**Step 0.2 — Create `drizzle/schema.ts`**
Define all 4 tables with Drizzle syntax matching Section 6.

**Step 0.3 — Create `drizzle.config.ts`**
```typescript
export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: { connectionString: process.env.DATABASE_URL! }
}
```

**Step 0.4 — Run Drizzle migration**
```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

**Step 0.5 — Create `src/lib/neon.ts`**
```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
export const db = drizzle(neon(process.env.DATABASE_URL!))
```

**Step 0.6 — Create `vercel.json`**
```json
{
  "crons": [{ "path": "/api/cleanup-locks", "schedule": "*/5 * * * *" }]
}
```

**Step 0.7 — Seed initial data**
Insert 6 services + all service_prices into Neon DB.

---

### PHASE 1 — BRAND & CONTENT UPDATE

**Step 1.1** — Update `src/data/services.ts` — rename all 6 services to Afro prefix

**Step 1.2** — Update `src/pages/Index.tsx` — replace all generic copy with Afro Massage wording

**Step 1.3** — Update `src/pages/Services.tsx`, `About.tsx`, `Offers.tsx` — Afro branding throughout

**Step 1.4** — Update `src/index.css` — set CSS variables to match #5A2A83 palette

**Step 1.5** — Update `src/components/site/Footer.tsx` — add maxpromo.digital credit line

---

### PHASE 2 — BOOKING PAGE (frontend)

**Step 2.1** — Create `src/pages/Booking.tsx` — multi-step wizard shell with step state management

**Step 2.2** — Create `src/components/booking/ServicePicker.tsx`

**Step 2.3** — Create `src/components/booking/DatePicker.tsx` — calendar, disable past + full dates

**Step 2.4** — Create `src/components/booking/TimePicker.tsx` — slot grid with green/red badges, 5s polling via `useSlots` hook

**Step 2.5** — Create `src/hooks/useSlots.ts` — fetches `/api/slots?date=X` every 5s with `setInterval`

**Step 2.6** — Create `src/components/booking/CustomerForm.tsx` — name + phone with German phone regex

**Step 2.7** — Create `src/components/booking/PaymentSelector.tsx`

**Step 2.8** — Create `src/components/booking/ConfirmScreen.tsx` — booking ref + QR code

**Step 2.9** — Create `src/components/booking/BookingQR.tsx`

**Step 2.10** — Wire multi-step state in `Booking.tsx` — connect all step components

---

### PHASE 3 — API ROUTES (Neon backend)

**Step 3.1** — Create `api/slots.ts` — GET handler

**Step 3.2** — Create `api/bookings.ts` — POST handler with double-booking protection

**Step 3.3** — Create `api/cleanup-locks.ts` — cron handler

**Step 3.4** — Create `api/admin/login.ts` — bcrypt + JWT

**Step 3.5** — Create `api/admin/bookings.ts` — protected GET

**Step 3.6** — Create `api/admin/slots.ts` — protected POST/PUT

**Step 3.7** — Create `api/admin/manual-booking.ts` — protected POST

**Step 3.8** — Create `src/lib/auth.ts` — JWT sign/verify helpers

---

### PHASE 4 — STRIPE

**Step 4.1** — Create `api/create-payment-intent.ts`

**Step 4.2** — Create `api/stripe-webhook.ts` — signature verification + event handling

**Step 4.3** — Add Stripe Elements to `PaymentSelector.tsx` — wrap with `<Elements>`, render `<PaymentElement>`

**Step 4.4** — Create `src/lib/stripe.ts` — `loadStripe(VITE_STRIPE_PUBLISHABLE_KEY)`

---

### PHASE 5 — TELEGRAM BOT

**Step 5.1** — Create `api/send-telegram-notification.ts` — called internally after booking insert

**Step 5.2** — Create `api/telegram-webhook.ts` — handles confirm/cancel callbacks

**Step 5.3** — Create `api/cancel-booking.ts` — shared cancellation + refund logic

**Step 5.4** — Register Telegram webhook URL (one-time setup command)

---

### PHASE 6 — ADMIN DASHBOARD (frontend)

**Step 6.1** — Create `src/pages/AdminLogin.tsx`

**Step 6.2** — Create `src/components/admin/ProtectedRoute.tsx` — JWT from memory, redirect if missing

**Step 6.3** — Create `src/pages/Admin.tsx` — tabbed layout shell

**Step 6.4** — Create `src/components/admin/AdminCalendar.tsx`

**Step 6.5** — Create `src/components/admin/BookingsList.tsx`

**Step 6.6** — Create `src/components/admin/SlotManager.tsx`

**Step 6.7** — Create `src/components/admin/ManualBooking.tsx`

---

### PHASE 7 — REVIEWS + CHAT + QR

**Step 7.1** — Create `src/data/reviews.ts` with 5 static reviews

**Step 7.2** — Create `src/components/site/ReviewsSection.tsx`

**Step 7.3** — Add `ReviewsSection` to `Index.tsx`

**Step 7.4** — Create `src/components/site/AiChat.tsx`

**Step 7.5** — Add `AiChat` to `Layout.tsx`

---

### PHASE 8 — ROUTES, SEO, FINAL WIRING

**Step 8.1** — Update `src/App.tsx` — add `/booking`, `/admin`, `/admin/login` routes

**Step 8.2** — Update `Navbar.tsx` — add highlighted "Book Now" button → `/booking`

**Step 8.3** — Update `index.html` — add LocalBusiness JSON-LD schema

**Step 8.4** — Final build + Vercel preview deploy
```bash
npm run build && vercel --prod
```

---

## 18. PRE-LAUNCH CHECKLIST

- [ ] Neon DB provisioned, schema migrated, services seeded
- [ ] `DATABASE_URL` set in Vercel env vars
- [ ] Stripe account active, webhook endpoint registered at `/api/stripe-webhook`
- [ ] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel
- [ ] Telegram bot created, webhook set to `https://amaka-massage.de/api/telegram-webhook`
- [ ] `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` in Vercel
- [ ] `ADMIN_PASSWORD_HASH` generated (`node -e "const b=require('bcryptjs');b.hash('PASSWORD',10).then(console.log)"`)
- [ ] `ADMIN_JWT_SECRET` set (random 64-char string)
- [ ] Initial time slots generated via Admin Dashboard
- [ ] Google Business Place ID added (for review link)
- [ ] amaka-massage.de DNS pointed to Vercel
- [ ] `npm run build` passes with zero errors

---

*Architecture v2 — Neon + Vercel. Ready for Claude Code execution. Start at Phase 0.*
