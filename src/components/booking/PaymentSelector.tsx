import { useState, useEffect, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Banknote, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'

interface StripeFormProps {
  amount: number
  onError: (msg: string) => void
}

const StripeInnerForm = ({ amount, onError }: StripeFormProps) => {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${import.meta.env.VITE_APP_URL}/booking/success`,
      },
    })
    if (error) {
      onError(error.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      <Button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full gradient-purple text-primary-foreground py-3 text-base"
      >
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
          : <><Lock className="mr-2 h-4 w-4" /> Pay €{amount.toFixed(2)}</>
        }
      </Button>
    </form>
  )
}

interface Props {
  amount: number
  bookingId: string
  bookingRef: string
  onSelect: (method: 'stripe' | 'on_site') => void
  submitting?: boolean
}

export const PaymentSelector = ({
  amount, bookingId, bookingRef, onSelect, submitting = false,
}: Props) => {
  const [pendingStripe, setPendingStripe]   = useState(false)
  const [clientSecret, setClientSecret]     = useState<string | null>(null)
  const [fetchingSecret, setFetchingSecret] = useState(false)
  const [stripeError, setStripeError]       = useState<string | null>(null)

  const handleCardClick = () => {
    if (pendingStripe || clientSecret || submitting) return
    setPendingStripe(true)
    setFetchingSecret(true)
    onSelect('stripe')
  }

  useEffect(() => {
    if (!pendingStripe || !bookingId) return
    const fetchSecret = async () => {
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_id: bookingId }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Payment setup failed')
        }
        const { client_secret } = await res.json()
        setClientSecret(client_secret)
        setStripeError(null)
      } catch (err) {
        setStripeError(err instanceof Error ? err.message : 'Payment setup failed')
        setPendingStripe(false)
      } finally {
        setFetchingSecret(false)
      }
    }
    fetchSecret()
  }, [pendingStripe, bookingId])

  const isLoading   = submitting || fetchingSecret
  const stripeActive = pendingStripe || !!clientSecret

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-2">Zahlungsart</h2>
      <p className="text-muted-foreground text-sm mb-6">Wählen Sie Ihre bevorzugte Zahlungsart.</p>

      {bookingRef && (
        <p className="text-xs text-muted-foreground mb-6">
          Buchungsnummer:{' '}
          <span className="font-mono font-bold text-primary tracking-wide">{bookingRef}</span>
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 max-w-md">

        {/* ── Pay on-site (PRIMARY — recommended) ── */}
        <button
          type="button"
          onClick={() => onSelect('on_site')}
          disabled={isLoading || !!clientSecret}
          className="
            rounded-2xl border-2 p-6 text-left transition-all
            border-primary bg-primary/5 shadow-soft
            hover:bg-primary/10
            disabled:opacity-40 disabled:cursor-not-allowed
            relative
          "
        >
          <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Recommended
          </span>
          <Banknote className="h-8 w-8 mb-3 text-primary" />
          <div className="font-bold text-primary-deep">Vor Ort zahlen</div>
          <div className="text-sm text-muted-foreground mt-1">Zahlung beim Besuch</div>
          <div className="text-xl font-bold mt-2 text-primary">Bar oder Kartenzahlung</div>
          {isLoading && !stripeActive && (
            <Loader2 className="absolute bottom-4 right-4 h-4 w-4 text-primary animate-spin" />
          )}
        </button>

        {/* ── Pay by card (secondary) ── */}
        <button
          type="button"
          onClick={handleCardClick}
          disabled={isLoading || !!clientSecret}
          className={`
            rounded-2xl border-2 p-6 text-left transition-all
            ${stripeActive
              ? 'border-primary bg-secondary/60 shadow-soft'
              : 'border-border bg-card hover:border-primary/40'
            }
            disabled:cursor-not-allowed
          `}
        >
          {isLoading && stripeActive
            ? <Loader2 className="h-8 w-8 mb-3 text-primary animate-spin" />
            : <CreditCard className={`h-8 w-8 mb-3 ${stripeActive ? 'text-primary' : 'text-muted-foreground'}`} />
          }
          <div className={`font-semibold ${stripeActive ? 'text-primary-deep' : 'text-foreground'}`}>
            Pay by card
          </div>
          <div className="text-sm text-muted-foreground mt-1">Sichere Online-Zahlung</div>
          <div className={`text-xl font-bold mt-2 ${stripeActive ? 'text-primary' : 'text-foreground/70'}`}>
            €{amount.toFixed(2)}
          </div>
        </button>
      </div>

      {stripeError && (
        <div className="mt-4 max-w-md bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm">
          {stripeError}
        </div>
      )}

      {clientSecret && (
        <div className="mt-6 max-w-md">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#5A2A83',
                  colorBackground: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '8px',
                },
              },
            }}
          >
            <StripeInnerForm amount={amount} onError={setStripeError} />
          </Elements>
        </div>
      )}
    </div>
  )
}
