import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  durationMin: number
  onSelect: (date: string) => void
}

const DAY_HEADERS  = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTH_NAMES  = [
  'Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember',
]

function pad(n: number) { return String(n).padStart(2, '0') }

function calendarCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month - 1, 1).getDay()
  const offset   = (firstDow + 6) % 7
  const days     = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export const DatePicker = ({ durationMin, onSelect }: Props) => {
  const now  = new Date()
  const [year,           setYear]           = useState(now.getFullYear())
  const [month,          setMonth]          = useState(now.getMonth() + 1)
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [loadingCal,     setLoadingCal]     = useState(false)
  const [selected,       setSelected]       = useState<string | null>(null)

  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const fetchDates = useCallback(async (y: number, m: number, dur: number) => {
    setLoadingCal(true)
    try {
      const res = await fetch(`/api/slots?month=${y}-${pad(m)}&duration=${dur}`)
      if (res.ok) {
        const data: string[] = await res.json()
        setAvailableDates(new Set(data))
      }
    } catch { /* silent */ }
    finally { setLoadingCal(false) }
  }, [])

  useEffect(() => { fetchDates(year, month, durationMin) }, [year, month, durationMin, fetchDates])

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const canGoPrev =
    year > now.getFullYear() ||
    (year === now.getFullYear() && month > now.getMonth() + 1)

  const handleDayClick = (day: number) => {
    const ds = `${year}-${pad(month)}-${pad(day)}`
    if (ds < todayStr || !availableDates.has(ds)) return
    setSelected(ds)
  }

  const cells = calendarCells(year, month)

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-2">Datum wählen</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Grün markierte Tage haben freie Termine für {durationMin} Min.
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} disabled={!canGoPrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="font-serif text-xl text-primary-deep flex items-center gap-2">
          {MONTH_NAMES[month - 1]} {year}
          {loadingCal && (
            <span className="text-xs text-muted-foreground font-sans animate-pulse">…</span>
          )}
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
          const ds         = `${year}-${pad(month)}-${pad(day)}`
          const isPast     = ds < todayStr
          const hasSlots   = availableDates.has(ds)
          const isSelected = selected === ds
          const isDisabled = isPast || !hasSlots

          return (
            <button
              key={ds}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
              className={[
                'aspect-square rounded-lg text-sm font-medium transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : !isDisabled
                  ? 'bg-green-50 border border-green-200 text-green-800 hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer'
                  : isPast
                  ? 'text-muted-foreground/25 cursor-not-allowed'
                  : 'text-muted-foreground/30 cursor-not-allowed',
              ].join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>

      {!loadingCal && availableDates.size === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-6 py-4">
          Keine freien Termine in diesem Monat. Bitte nächsten Monat prüfen.
        </p>
      )}

      {selected && (
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => onSelect(selected)}
            className="gradient-purple text-primary-foreground px-8"
          >
            Weiter →
          </Button>
        </div>
      )}
    </div>
  )
}
