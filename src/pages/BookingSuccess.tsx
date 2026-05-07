import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { Layout } from '@/components/site/Layout'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, Flower2 } from 'lucide-react'

type Status = 'loading' | 'succeeded' | 'processing' | 'failed'

const SuccessContent = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe()
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!stripe || !clientSecret) return

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setStatus('succeeded')
          break
        case 'processing':
          setStatus('processing')
          break
        case 'requires_payment_method':
          setStatus('failed')
          break
        default:
          setStatus('failed')
      }
    })
  }, [stripe, clientSecret])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground">Verifying payment…</p>
      </div>
    )
  }

  if (status === 'succeeded') {
    return (
      <div className="text-center max-w-sm mx-auto py-12">
        <CheckCircle
          className="h-16 w-16 mx-auto mb-4"
          style={{ color: 'hsl(var(--slot-available))' }}
        />
        <h2 className="font-serif text-3xl text-primary-deep">Payment Confirmed!</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Your booking is confirmed. Amaka Massage Essen will see you soon.
        </p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Link to="/">
            <Button className="gradient-purple text-primary-foreground">Go Home</Button>
          </Link>
          <Link to="/booking">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Book Another
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'processing') {
    return (
      <div className="text-center max-w-sm mx-auto py-12">
        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
        <h2 className="font-serif text-3xl text-primary-deep">Payment Processing…</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Your payment is being processed. You'll receive a confirmation once it clears.
        </p>
        <Link to="/" className="inline-block mt-8">
          <Button className="gradient-purple text-primary-foreground">Go Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center max-w-sm mx-auto py-12">
      <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-primary-deep">Payment Failed</h2>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Your payment could not be processed. Please try again or choose another method.
      </p>
      <Link to="/booking" className="inline-block mt-8">
        <Button className="gradient-purple text-primary-foreground">Try Again</Button>
      </Link>
    </div>
  )
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams()
  const clientSecret = searchParams.get('payment_intent_client_secret') ?? ''

  return (
    <Layout>
      <section className="gradient-hero py-10">
        <div className="container text-center">
          <Flower2 className="h-6 w-6 text-primary mx-auto mb-2" />
          <h1 className="font-serif text-4xl text-primary-deep">Booking Status</h1>
          <p className="font-script text-xl text-primary mt-1">Premium Afro Massage by Amaka</p>
        </div>
      </section>
      <section className="container py-10 max-w-2xl mx-auto px-4">
        <Elements stripe={stripePromise}>
          <SuccessContent clientSecret={clientSecret} />
        </Elements>
      </section>
    </Layout>
  )
}

export default BookingSuccess
