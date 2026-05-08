export interface DayHours { open: string; close: string }

export const OPENING_HOURS: Record<number, DayHours | null> = {
  0: null,                              // Sonntag  — geschlossen
  1: { open: '10:00', close: '19:00' }, // Montag
  2: { open: '10:00', close: '19:00' }, // Dienstag
  3: { open: '10:00', close: '17:00' }, // Mittwoch
  4: { open: '10:00', close: '19:00' }, // Donnerstag
  5: { open: '10:00', close: '19:00' }, // Freitag
  6: { open: '13:00', close: '20:00' }, // Samstag
}

export function isOpenDay(dow: number): boolean { return OPENING_HOURS[dow] !== null }
export function getHoursForDay(dow: number): DayHours | null { return OPENING_HOURS[dow] ?? null }

export function getSlotsForDate(dateStr: string, intervalMin = 30): string[] {
  const dow = new Date(dateStr + 'T00:00:00').getDay()
  const h   = OPENING_HOURS[dow]
  if (!h) return []
  const [oH, oM] = h.open.split(':').map(Number)
  const [cH, cM] = h.close.split(':').map(Number)
  const open = oH * 60 + oM, close = cH * 60 + cM
  const slots: string[] = []
  for (let t = open; t + intervalMin <= close; t += intervalMin)
    slots.push(`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`)
  return slots
}
