import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isOpenDay } from '@/lib/openingHours'

interface Props {
  onSelect: (date: string) => void
}

const DAY_HEADERS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTH_NAMES = [
  'Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember',
]

function pad(n: number) { return String(n).padStart(2, '0') }

function calendarCells(year: number, month: number): (number | null)[] {
  // month is 1-indexed
  const firstDow = new Date(year, month - 1, 1).getDay() // 0=Sun
  const offset = (firstDow + 6) % 7                      // shift to Mon=0
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export const DatePicker = ({ onSelect }: Props) => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)

  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const fetchDates = useCallback(async (y: number, m: number) => {
    try {
      const res = await fetch(`/api/slots?month=${y}-${pad(m)}`)
      if (res.ok) {
        const data: string[] = await res.json()
        setAvailableDates(new Set(data))
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => { fetchDates(year, month) }, [year, month, fetchDates])

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  const canGoPrev =
    year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1)

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${pad(month)}-${pad(day)}`
    const dow = new Date(dateStr + 'T00:00:00').getDay()
    if (dateStr < todayStr || !isOpenDay(dow) || !availableDates.has(dateStr)) return
    setSelected(dateStr)
  }

  const cells = calendarCells(year, month)

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-6">Datum wählen</h2>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} disabled={!canGoPrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="font-serif text-xl text-primary-deep">
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} />
          const dateStr = `${year}-${pad(month)}-${pad(day)}`
          const dow = new Date(dateStr + 'T00:00:00').getDay()
          const isPast = dateStr < todayStr
          const isClosed = !isOpenDay(dow)
          const hasSlots = availableDates.has(dateStr)
          const isSelected = selected === dateStr
          const isDisabled = isPast || isClosed || !hasSlots

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
              title={isClosed ? 'Closed' : undefined}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-colors relative
                ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                ${!isSelected && !isDisabled ? 'hover:bg-secondary cursor-pointer text-foreground' : ''}
                ${isClosed ? 'text-muted-foreground/20 cursor-not-allowed' : ''}
                ${!isClosed && isDisabled ? 'text-muted-foreground/30 cursor-not-allowed' : ''}
              `}
            >
              {day}
              {isClosed && !isPast && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] text-muted-foreground/40 leading-none">
                  closed
                </span>
              )}
            </button>
          )
        })}
      </div>

      {availableDates.size === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          No available slots this month. Try the next month.
        </p>
      )}

      {selected && (
        <div className="mt-8 flex justify-end">
          <Button onClick={() => onSelect(selected)} className="gradient-purple text-primary-foreground px-8">
            Continue →
          </Button>
        </div>
      )}
    </div>
  )
}