import { AlertCircle, Loader2 } from 'lucide-react'
import { useSlots, type SlotType } from '@/hooks/useSlots'

interface Props {
  date: string
  onSelect: (slot: SlotType) => void
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  })
}

const ALMOST_FULL_THRESHOLD = 3

export const TimePicker = ({ date, onSelect }: Props) => {
  const { slots, loading, error } = useSlots(date)

  const available   = slots.filter(s =>  s.is_available && !s.locked)
  const booked      = slots.filter(s => !s.is_available && !s.locked)
  const locked      = slots.filter(s =>  s.locked)
  const almostFull  = available.length > 0 && available.length <= ALMOST_FULL_THRESHOLD

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-serif text-2xl text-primary-deep">
          Verfügbare Zeiten für {formatDate(date)}
        </h2>
        {loading && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Wird aktualisiert…
          </span>
        )}
      </div>

      {/* Urgency indicator */}
      {(almostFull || available.length > 0) && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm mb-5 ${
          almostFull
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-amber-50 border border-amber-200 text-amber-700'
        }`}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          {almostFull
            ? `Only ${available.length} slot${available.length === 1 ? '' : 's'} left — book now to secure your time.`
            : 'Begrenzte Plätze heute – frühzeitig buchen empfohlen.'}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && slots.length === 0 && (
        <p className="text-muted-foreground text-sm py-4">
          Keine Termine für dieses Datum verfügbar. Bitte einen anderen Tag wählen.
        </p>
      )}

      {available.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Available
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {available.map(slot => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelect(slot)}
                className="
                  relative rounded-xl border-2 border-green-200 bg-green-50 py-4
                  text-base font-semibold text-green-800 transition-all
                  hover:bg-primary hover:text-primary-foreground hover:border-primary
                  active:scale-95
                "
              >
                {slot.slot_time.slice(0, 5)}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {(booked.length > 0 || locked.length > 0) && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Unavailable
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {booked.map(slot => (
              <button
                key={slot.id}
                type="button"
                disabled
                className="
                  relative rounded-xl border-2 border-red-100 bg-red-50 py-4
                  text-base font-medium text-red-300 line-through
                  cursor-not-allowed
                "
              >
                {slot.slot_time.slice(0, 5)}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-300" />
              </button>
            ))}
            {locked.map(slot => (
              <button
                key={slot.id}
                type="button"
                disabled
                className="
                  relative rounded-xl border-2 border-gray-100 bg-gray-50 py-4
                  text-base font-medium text-gray-300
                  cursor-not-allowed
                "
              >
                {slot.slot_time.slice(0, 5)}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gray-300" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
