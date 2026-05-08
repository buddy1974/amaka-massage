/**
 * Opening hours for Amaka Massage – Essen
 * Single source of truth shared by API (slot generation) and frontend (calendar).
 * Day index: 0 = Sunday … 6 = Saturday  (JS getDay() convention)
 * null = closed that day.
 */

export interface DayHours {
  open: string   // "HH:MM"
  close: string  // "HH:MM" — exclusive upper bound
}

export const OPENING_HOURS: Record<number, DayHours | null> = {
  0: null,                              // Sunday   — closed
  1: { open: '10:00', close: '19:00' }, // Monday
  2: { open: '10:00', close: '19:00' }, // Tuesday
  3: { open: '10:00', close: '19:00' }, // Wednesday
  4: { open: '10:00', close: '19:00' }, // Thursday
  5: { open: '10:00', close: '19:00' }, // Friday
  6: { open: '13:00', close: '20:00' }, // Saturday
}

export function isOpenDay(dayOfWeek: number): boolean {
  return OPENING_HOURS[dayOfWeek] !== null
}

export function getHoursForDay(dayOfWeek: number): DayHours | null {
  return OPENING_HOURS[dayOfWeek] ?? null
}

export function getSlotsForDate(dateStr: string, intervalMin = 30): string[] {
  const dow = new Date(dateStr + 'T00:00:00').getDay()
  const hours = OPENING_HOURS[dow]
  if (!hours) return []

  const [openH, openM] = hours.open.split(':').map(Number)
  const [closeH, closeM] = hours.close.split(':').map(Number)

  const openTotal  = openH  * 60 + openM
  const closeTotal = closeH * 60 + closeM

  const slots: string[] = []
  for (let t = openTotal; t + intervalMin <= closeTotal; t += intervalMin) {
    const h = Math.floor(t / 60)
    const m = t % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return slots
}
