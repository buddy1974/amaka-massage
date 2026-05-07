import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { BookingQR } from './BookingQR'

interface Props {
  bookingRef: string
  serviceName: string
  date: string
  time: string
  paymentMethod: string
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  })
}

export const ConfirmScreen = ({ bookingRef, serviceName, date, time, paymentMethod }: Props) => {
  const navigate = useNavigate()
  const appUrl = (import.meta.env.VITE_APP_URL as string) || 'https://amaka-massage.de'
  const payLabel = paymentMethod === 'on_site' ? 'Pay on-site' : 'Card payment'

  return (
    <div className="text-center max-w-sm mx-auto py-6">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16" style={{ color: 'hsl(var(--slot-available))' }} />
      </div>
      <h2 className="font-serif text-3xl text-primary-deep">Booking Confirmed!</h2>
      <p className="text-muted-foreground mt-2 text-sm">We'll see you soon at Amaka Massage Essen.</p>

      {/* Summary */}
      <div className="bg-card rounded-2xl shadow-card p-5 mt-6 text-left space-y-3 text-sm">
        {[
          { label: 'Service', value: serviceName },
          { label: 'Date', value: formatDate(date) },
          { label: 'Time', value: time.slice(0, 5) },
          { label: 'Payment', value: payLabel },
        ].map(row => (
          <div key={row.label} className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">{row.label}</span>
            <span className="font-medium text-primary-deep text-right">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Booking reference */}
      <div className="mt-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Booking Reference</p>
        <p className="font-mono text-3xl font-bold text-primary tracking-widest">{bookingRef}</p>
      </div>

      {/* QR code */}
      <div className="flex justify-center mt-6">
        <BookingQR url={`${appUrl}/booking`} size={140} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">Scan to book again</p>

      {/* Actions */}
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Book Another
        </Button>
        <Button onClick={() => navigate('/')} className="gradient-purple text-primary-foreground">
          Go Home
        </Button>
      </div>
    </div>
  )
}
