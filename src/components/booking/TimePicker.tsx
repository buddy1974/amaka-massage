import { Loader2 } from 'lucide-react'
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

export const TimePicker = ({ date, onSelect }: Props) => {
  const { slots, loading, error } = useSlots(date)

  const available = slots.filter(s => s.is_available && !s.locked)
  const unavailable = slots.filter(s => !s.is_available || s.locked)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="font-serif text-2xl text-primary-deep">
          Available times for {formatDate(date)}
        </h2>
        {loading && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Refreshing…
          </span>
        )}
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {!loading && slots.length === 0 && (
        <p className="text-muted-foreground text-sm">No slots available for this date. Please go back and choose another day.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {available.map(slot => (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelect(slot)}
            className="
              rounded-xl border-2 py-4 text-base font-semibold transition-all
              slot-available bg-slot-available
              hover:bg-primary hover:text-primary-foreground hover:border-primary
            "
          >
            {slot.slot_time.slice(0, 5)}
          </button>
        ))}
        {unavailable.map(slot => (
          <button
            key={slot.id}
            type="button"
            disabled
            className="
              rounded-xl border-2 py-4 text-base font-medium
              slot-booked bg-slot-booked
              opacity-50 cursor-not-allowed line-through
            "
          >
            {slot.slot_time.slice(0, 5)}
          </button>
        ))}
      </div>
    </div>
  )
}
