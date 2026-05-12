import { CheckCircle2, Calendar, Clock, CreditCard, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const AMAKA_WA = '4915213928938'

interface Props {
  bookingRef:    string
  serviceName:   string
  durationMin:   number
  date:          string
  time:          string
  paymentMethod: 'stripe' | 'on_site'
  customerPhone?: string
}

function formatDate(ds: string): string {
  const [y, m, d] = ds.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

function buildWhatsAppUrl(ref: string, serviceName: string, durationMin: number, date: string, time: string): string {
  const msg = [
    `Hallo Amaka, ich habe soeben einen Termin gebucht:`,
    `Ref: ${ref}`,
    `Massage: ${serviceName} – ${durationMin} Min.`,
    `Datum: ${formatDate(date)}`,
    `Uhrzeit: ${time.slice(0, 5)} Uhr`,
    `Bitte bestätigen. Danke!`,
  ].join('\n')
  return `https://wa.me/${AMAKA_WA}?text=${encodeURIComponent(msg)}`
}

export const ConfirmScreen = ({ bookingRef, serviceName, durationMin, date, time, paymentMethod, customerPhone: _customerPhone }: Props) => (
  <div className="text-center py-4">
    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
    <h2 className="font-serif text-3xl text-primary-deep mb-2">Buchung bestätigt!</h2>
    <p className="text-muted-foreground mb-8">
      Wir haben Ihre Anfrage erhalten und melden uns in Kürze zur Bestätigung.
    </p>

    <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-left max-w-sm mx-auto mb-8 space-y-4">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Buchungsnummer</p>
        <p className="font-mono font-bold text-primary text-lg">{bookingRef}</p>
      </div>
      <div className="flex items-start gap-3">
        <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Massage</p>
          <p className="font-medium text-foreground">{serviceName} – {durationMin} Min.</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Datum</p>
          <p className="font-medium text-foreground">{formatDate(date)}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Uhrzeit</p>
          <p className="font-medium text-foreground">{time.slice(0, 5)} Uhr</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Zahlung</p>
          <p className="font-medium text-foreground">
            {paymentMethod === 'on_site' ? 'Bar oder Karte vor Ort' : 'Online-Kartenzahlung'}
          </p>
        </div>
      </div>
    </div>

    {/* WhatsApp confirmation — opens chat to Amaka with booking details pre-filled */}
    <a
      href={buildWhatsAppUrl(bookingRef, serviceName, durationMin, date, time)}
      target="_blank"
      rel="noreferrer"
      className="block max-w-sm mx-auto mb-3"
    >
      <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2">
        <MessageCircle className="h-4 w-4" />
        Buchung per WhatsApp bestätigen
      </Button>
    </a>
    <p className="text-xs text-muted-foreground mb-8">
      Öffnet WhatsApp mit Ihren Buchungsdetails – einfach absenden.
    </p>

    <p className="text-sm text-muted-foreground mb-6">
      Bei Fragen:{' '}
      <a href="tel:015906306248" className="text-primary font-medium hover:underline">0159 06306248</a>
      {' '}oder{' '}
      <a href="https://wa.me/4915213928938" target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">
        WhatsApp
      </a>
    </p>

    <Link to="/">
      <Button className="gradient-purple text-primary-foreground px-8">
        Zur Startseite
      </Button>
    </Link>
  </div>
)
