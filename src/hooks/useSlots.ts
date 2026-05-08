import { useState, useEffect, useRef } from 'react'

export interface SlotType {
  slot_time: string
  is_available: boolean
}

export function useSlots(date: string | null, durationMin?: number) {
  const [slots,   setSlots]   = useState<SlotType[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const timerRef    = useRef<number | null>(null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (!date) { setSlots([]); setLoading(false); return }

    const dur = durationMin ?? 60

    const fetchSlots = async () => {
      if (fetchingRef.current) return
      fetchingRef.current = true
      try {
        const res  = await fetch(`/api/slots?date=${date}&duration=${dur}`)
        if (!res.ok) throw new Error('fetch failed')
        const data: SlotType[] = await res.json()
        setSlots(data)
        setError(null)
      } catch {
        setError('Termine konnten nicht geladen werden. Erneut versuchen…')
      } finally {
        fetchingRef.current = false
        setLoading(false)
      }
    }

    setLoading(true)
    fetchSlots()
    // Refresh every 10s so concurrent visitors see updated availability
    timerRef.current = window.setInterval(fetchSlots, 10_000)

    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
  }, [date, durationMin])

  return { slots, loading, error }
}
