import { Layout } from '@/components/site/Layout'
import { Button } from '@/components/ui/button'
import { Flower2, ChevronLeft } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { ServicePicker } from '@/components/booking/ServicePicker'
import { DatePicker } from '@/components/booking/DatePicker'
import { TimePicker } from '@/components/booking/TimePicker'
import { CustomerForm } from '@/components/booking/CustomerForm'
import { PaymentSelector } from '@/components/booking/PaymentSelector'
import { ConfirmScreen } from '@/components/booking/ConfirmScreen'

const STEP_LABELS = ['Service', 'Date', 'Time', 'Your Details', 'Payment']

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center mb-10">
    {STEP_LABELS.map((label, i) => {
      const n = i + 1
      const done = n < current
      const active = n === current
      return (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                transition-all
                ${done   ? 'bg-primary text-primary-foreground' : ''}
                ${active ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : ''}
                ${!done && !active ? 'bg-muted text-muted-foreground' : ''}
              `}
            >
              {done ? '✓' : n}
            </div>
            <span className={`text-[10px] hidden sm:block leading-none ${active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 transition-colors ${n < current ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      )
    })}
  </div>
)

const Booking = () => {
  const booking = useBooking()

  // Once a booking exists the slot is locked — prevent going back
  const canGoBack = booking.step > 1 && booking.step < 6 && !booking.bookingResult

  return (
    <Layout>
      <section className="gradient-hero py-10">
        <div className="container text-center">
          <Flower2 className="h-6 w-6 text-primary mx-auto mb-2" />
          <h1 className="font-serif text-4xl text-primary-deep">Book Your Session</h1>
          <p className="font-script text-xl text-primary mt-1">Premium Afro Massage by Amaka</p>
        </div>
      </section>

      <section className="container py-10 max-w-3xl mx-auto px-4">
        {booking.step < 6 && <StepIndicator current={booking.step} />}

        {canGoBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={booking.back}
            className="text-muted-foreground mb-6 -ml-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}

        {booking.submitError && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm mb-6">
            {booking.submitError}
          </div>
        )}

        {booking.step === 1 && (
          <ServicePicker
            onSelect={(service, price) => {
              booking.setSelectedService(service)
              booking.setSelectedPrice(price)
              booking.next()
            }}
          />
        )}

        {booking.step === 2 && (
          <DatePicker
            onSelect={date => {
              booking.setSelectedDate(date)
              booking.next()
            }}
          />
        )}

        {booking.step === 3 && booking.selectedDate && (
          <TimePicker
            date={booking.selectedDate}
            onSelect={slot => {
              booking.setSelectedSlot(slot)
              booking.next()
            }}
          />
        )}

        {booking.step === 4 && (
          <CustomerForm
            initialName={booking.customerName}
            initialPhone={booking.customerPhone}
            onSubmit={(name, phone) => {
              booking.setCustomerName(name)
              booking.setCustomerPhone(phone)
              booking.next()
            }}
          />
        )}

        {/* Step 5 — PaymentSelector owns the full payment flow:
            - on_site: calls onSelect → submit creates booking → step 6
            - stripe:  calls onSelect → submit creates booking → bookingId prop arrives
                       → PaymentSelector fetches client_secret → shows Stripe Elements inline
                       → confirmPayment redirects to /booking/success                    */}
        {booking.step === 5 && booking.selectedPrice && (
          <PaymentSelector
            amount={booking.selectedPrice.priceEur}
            bookingId={booking.bookingResult?.booking_id ?? ''}
            bookingRef={booking.bookingResult?.booking_ref ?? ''}
            onSelect={method => booking.submit(method)}
            submitting={booking.submitting}
          />
        )}

        {booking.step === 6
          && booking.bookingResult
          && booking.selectedService
          && booking.selectedDate
          && booking.selectedSlot
          && (
            <ConfirmScreen
              bookingRef={booking.bookingResult.booking_ref}
              serviceName={booking.selectedService.name}
              date={booking.selectedDate}
              time={booking.selectedSlot.slot_time}
              paymentMethod={booking.paymentMethod ?? 'on_site'}
            />
          )}
      </section>
    </Layout>
  )
}

export default Booking
