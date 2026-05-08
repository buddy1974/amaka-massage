import { AlertCircle, Loader2 } from 'lucide-react'
import { useSlots } from '@/hooks/useSlots'

interface Props {
  date: string
  durationMin: number
  onSelect: (time: string) => void
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  })
}

export const TimePicker = ({ date, durationMin, onSelect }: Props) => {
  const { slots, loading, error } = useSlots(date, durationMin)

  const available = slots.filter(s =>  s.is_available)
  const booked    = slots.filter(s => !s.is_available)
  const almostFull = available.length > 0 && available.length <= 3

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-1">
        Uhrzeit wählen
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {formatDate(date)} – {durationMin} Min.
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Termine werden geladen…
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Urgency notice */}
      {!loading && almostFull && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm mb-5 bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Nur noch {available.length} freie{available.length === 1 ? 'r' : ''} Termin — jetzt buchen!
        </div>
      )}
      {!loading && available.length > 3 && (
        <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm mb-5 bg-amber-50 border border-amber-200 text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Begrenzte Plätze – frühzeitig buchen empfohlen.
        </div>
      )}

      {!loading && slots.length === 0 && (
        <p className="text-muted-foreground text-sm py-6 text-center">
          Keine freien Termine für dieses Datum. Bitte einen anderen Tag wählen.
        </p>
      )}

      {available.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Verfügbar
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {available.map(slot => (
              <button
                key={slot.slot_time}
                type="button"
                onClick={() => onSelect(slot.slot_time)}
                className="
                  relative rounded-xl border-2 border-green-200 bg-green-50 py-4
                  text-base font-semibold text-green-800 transition-all
                  hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105
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

      {booked.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Nicht verfügbar
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {booked.map(slot => (
              <button
                key={slot.slot_time}
                type="button"
                disabled
                className="
                  relative rounded-xl border-2 border-red-100 bg-red-50/50 py-4
                  text-base font-medium text-red-300 line-through cursor-not-allowed
                "
              >
                {slot.slot_time.slice(0, 5)}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-200" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
