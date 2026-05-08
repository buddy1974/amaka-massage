import { useState } from 'react'

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
  const [step,            setStep]            = useState<BookingStep>(1)
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const [selectedPrice,   setSelectedPrice]   = useState<SelectedPrice | null>(null)
  const [selectedDate,    setSelectedDate]    = useState<string | null>(null)
  const [selectedTime,    setSelectedTime]    = useState<string | null>(null)
  const [customerName,    setCustomerName]    = useState('')
  const [customerPhone,   setCustomerPhone]   = useState('')
  const [paymentMethod,   setPaymentMethod]   = useState<'stripe' | 'on_site' | null>(null)
  const [bookingResult,   setBookingResult]   = useState<BookingResult | null>(null)
  const [submitting,      setSubmitting]      = useState(false)
  const [submitError,     setSubmitError]     = useState<string | null>(null)

  const next = () => setStep(s => Math.min(s + 1, 6) as BookingStep)
  const back = () => {
    setSubmitError(null)
    setStep(s => Math.max(s - 1, 1) as BookingStep)
  }

  const submit = async (method: 'stripe' | 'on_site') => {
    if (!selectedService || !selectedPrice || !selectedDate || !selectedTime) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:    selectedService.id,
          price_id:      selectedPrice.id,
          booking_date:  selectedDate,
          booking_time:  selectedTime,
          duration_min:  selectedPrice.durationMin,
          customer_name:  customerName,
          customer_phone: customerPhone,
          payment_method: method,
        }),
      })

      if (res.status === 409) {
        setSubmitError('Dieser Termin wurde gerade vergeben. Bitte eine andere Uhrzeit wählen.')
        setStep(3)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Buchung fehlgeschlagen. Bitte erneut versuchen.')
      }

      const data: BookingResult = await res.json()
      setBookingResult(data)
      setPaymentMethod(method)

      if (method === 'on_site') {
        setStep(6) // straight to confirmation
      }
      // stripe: stay on step 5 — PaymentSelector handles Stripe Elements
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen. Bitte erneut versuchen.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    step, selectedService, selectedPrice, selectedDate, selectedTime,
    customerName, customerPhone, paymentMethod, bookingResult,
    submitting, submitError,
    setSelectedService, setSelectedPrice, setSelectedDate, setSelectedTime,
    setCustomerName, setCustomerPhone,
    next, back, submit,
  }
}
