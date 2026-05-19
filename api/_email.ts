import { Resend } from 'resend'
import { getDb, bookings, services, servicePrices } from './_lib.js'
import { eq } from 'drizzle-orm'

const resend = new Resend(process.env.RESEND_API_KEY)

// Sender address — must be a verified domain on Resend
// Use onboarding@resend.dev for testing, switch to noreply@amaka-massage.de once domain is verified
const FROM = process.env.EMAIL_FROM ?? 'Amaka\'s City Afro Touch <onboarding@resend.dev>'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function buildHtml(params: {
  ref: string
  customerName: string
  serviceName: string
  durationMin: number
  date: string
  time: string
  priceEur: number
  paymentMethod: string
}): string {
  const { ref, customerName, serviceName, durationMin, date, time, priceEur, paymentMethod } = params
  const paymentLabel = paymentMethod === 'stripe' ? 'Online-Zahlung (Karte)' : 'Barzahlung vor Ort'

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Buchungsbestätigung – Amaka's City Afro Touch</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:36px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Traditionelle Massage Essen</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:0.5px;">Amaka's City Afro Touch</h1>
            <p style="margin:12px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">Ihre Buchung ist bestätigt ✓</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 24px;color:#374151;font-size:16px;">Hallo <strong>${customerName}</strong>,</p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
              vielen Dank für Ihre Buchung! Wir freuen uns, Sie bei uns begrüßen zu dürfen.
              Hier sind Ihre Buchungsdetails:
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border-radius:12px;border:1px solid #e9d5ff;margin-bottom:28px;">
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#6b7280;font-size:13px;width:140px;">Buchungsnummer</td>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#7c3aed;font-size:14px;font-weight:700;">${ref}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#6b7280;font-size:13px;">Massage</td>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#111827;font-size:14px;font-weight:600;">${serviceName}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#6b7280;font-size:13px;">Dauer</td>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#111827;font-size:14px;">${durationMin} Minuten</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#6b7280;font-size:13px;">Datum</td>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#111827;font-size:14px;">${formatDate(date)}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#6b7280;font-size:13px;">Uhrzeit</td>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#111827;font-size:14px;">${time} Uhr</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#6b7280;font-size:13px;">Preis</td>
                      <td style="padding:8px 0;border-bottom:1px solid #ede9fe;color:#111827;font-size:14px;font-weight:600;">${priceEur} €</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#6b7280;font-size:13px;">Zahlung</td>
                      <td style="padding:8px 0;color:#111827;font-size:14px;">${paymentLabel}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Address -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:10px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;color:#374151;font-size:14px;font-weight:600;">📍 Amaka's City Afro Touch – Traditionelle Massage Essen</p>
                  <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                    Hollestraße 9, 45127 Essen<br />
                    Tel: 01521 3928938<br />
                    <a href="https://amaka-massage.de" style="color:#7c3aed;text-decoration:none;">amaka-massage.de</a>
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;color:#6b7280;font-size:14px;line-height:1.6;">
              Bei Fragen oder um Ihren Termin zu ändern, rufen Sie uns bitte an oder schreiben Sie uns per WhatsApp:
            </p>
            <p style="margin:0;color:#374151;font-size:14px;font-weight:600;">01521 3928938</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              Amaka's City Afro Touch – Traditionelle Massage Essen · Hollestraße 9 · 45127 Essen
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendBookingEmail(bookingId: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping')
    return
  }

  const db = getDb()

  // Fetch booking + service + price details
  const rows = await db
    .select({
      customerName:  bookings.customerName,
      customerEmail: bookings.customerEmail,
      bookingDate:   bookings.bookingDate,
      bookingTime:   bookings.bookingTime,
      durationMin:   bookings.durationMin,
      paymentMethod: bookings.paymentMethod,
      serviceName:   services.name,
      priceEur:      servicePrices.priceEur,
    })
    .from(bookings)
    .innerJoin(services,      eq(services.id,      bookings.serviceId))
    .innerJoin(servicePrices, eq(servicePrices.id, bookings.priceId))
    .where(eq(bookings.id, bookingId))
    .limit(1)

  const b = rows[0]
  if (!b) { console.error('[email] booking not found:', bookingId); return }
  if (!b.customerEmail) { console.log('[email] no email address — skipping'); return }

  const ref = `AMK-${bookingId.split('-')[0].toUpperCase()}`

  const html = buildHtml({
    ref,
    customerName:  b.customerName ?? 'Kunde',
    serviceName:   b.serviceName  ?? 'Massage',
    durationMin:   b.durationMin  ?? 60,
    date:          b.bookingDate  ?? '',
    time:          b.bookingTime  ?? '',
    priceEur:      Number(b.priceEur ?? 0),
    paymentMethod: b.paymentMethod ?? 'on_site',
  })

  const { error } = await resend.emails.send({
    from:    FROM,
    to:      [b.customerEmail],
    subject: `✅ Buchungsbestätigung ${ref} – Amaka's City Afro Touch`,
    html,
  })

  if (error) {
    console.error('[email] Resend error:', error)
  } else {
   