import { useState, type FormEvent } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'

interface StripeFormInnerProps {
  onSuccess: () => void
  onError: (msg: string) => void
}

const StripeFormInner = ({ onSuccess, onError }: StripeFormInnerProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/booking` },
      redirect: 'if_required',
    })

    if (error) {
      onError(error.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      <Button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full gradient-purple text-primary-foreground py-3 text-base"
      >
        {loading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
          : <><Lock className="mr-2 h-4 w-4" /> Pay now</>
        }
      </Button>
    </form>
  )
}

interface Props {
  clientSecret: string
  onSuccess: () => void
}

export const StripePaymentForm = ({ clientSecret, onSuccess }: Props) => {
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-2">Card Payment</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Secure payment powered by Stripe.
      </p>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="max-w-md">
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
          <StripeFormInner onSuccess={onSuccess} onError={setError} />
        </Elements>
      </div>
    </div>
  )
}
