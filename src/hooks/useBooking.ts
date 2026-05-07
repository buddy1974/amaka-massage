import { useState } from 'react'
import type { SlotType } from './useSlots'

export interface SelectedService {
  id: string
  name: string
  slug: string
}

export interface SelectedPrice {
  id: string
  durationMin: number
  priceEur: number
}

export interface BookingResult {
  booking_id: string
  booking_ref: string
}

export type BookingStep = 1 | 2 | 3 | 4 | 5 | 6

export function useBooking() {
  const [step, setStep] = useState<BookingStep>(1)
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<SelectedPrice | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'on_site' | null>(null)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const next = () => setStep(s => Math.min(s + 1, 6) as BookingStep)
  const back = () => {
    setSubmitError(null)
    setStep(s => Math.max(s - 1, 1) as BookingStep)
  }

  // Called after Stripe payment succeeds in StripePaymentForm
  const completeStripePayment = () => setStep(6)

  const submit = async (method: 'stripe' | 'on_site') => {
    if (!selectedService || !selectedPrice || !selectedSlot) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      // Step 1: Create the booking (locks the slot for 15 min)
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          service_id: selectedService.id,
          price_id: selectedPrice.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          payment_method: method,
        }),
      })

      if (bookingRes.status === 409) {
        setSubmitError('This slot was just taken. Please choose another time.')
        setStep(3)
        return
      }

      if (!bookingRes.ok) {
        const data = await bookingRes.json().catch(() => ({}))
        throw new Error(data.error || 'Booking failed. Please try again.')
      }

      const bookingData: BookingResult = await bookingRes.json()
      setBookingResult(bookingData)
      setPaymentMethod(method)

      if (method === 'on_site') {
        // On-site: done — go straight to confirmation
        setStep(6)
        return
      }

      // Stripe: fetch a PaymentIntent client_secret, then show Elements form
      const intentRes = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingData.booking_id }),
      })

      if (!intentRes.ok) {
        const data = await intentRes.json().catch(() => ({}))
        throw new Error(data.error || 'Could not initialise payment. Please try again.')
      }

      const { client_secret } = await intentRes.json()
      setStripeClientSecret(client_secret)
      // Stay on step 5 — StripePaymentForm will render
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    step, selectedService, selectedPrice, selectedDate, selectedSlot,
    customerName, customerPhone, paymentMethod, bookingResult,
    stripeClientSecret, submitting, submitError,
    setSelectedService, setSelectedPrice, setSelectedDate, setSelectedSlot,
    setCustomerName, setCustomerPhone,
    next, back, submit, completeStripePayment,
  }
}
