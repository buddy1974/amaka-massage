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
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const next = () => setStep(s => Math.min(s + 1, 6) as BookingStep)
  const back = () => {
    setSubmitError(null)
    setStep(s => Math.max(s - 1, 1) as BookingStep)
  }

  const submit = async (method: 'stripe' | 'on_site') => {
    if (!selectedService || !selectedPrice || !selectedSlot) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/bookings', {
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

      if (res.status === 409) {
        setSubmitError('This slot was just taken. Please choose another time.')
        setStep(3)
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Booking failed. Please try again.')
      }

      const data: BookingResult = await res.json()
      setBookingResult(data)
      setPaymentMethod(method)
      setStep(6)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    step, selectedService, selectedPrice, selectedDate, selectedSlot,
    customerName, customerPhone, paymentMethod, bookingResult,
    submitting, submitError,
    setSelectedService, setSelectedPrice, setSelectedDate, setSelectedSlot,
    setCustomerName, setCustomerPhone,
    next, back, submit,
  }
}
