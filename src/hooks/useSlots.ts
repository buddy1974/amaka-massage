import { useState, useEffect, useRef } from 'react'

export interface SlotType {
  id: string
  slot_time: string
  is_available: boolean
  locked: boolean
}

export function useSlots(date: string | null) {
  const [slots, setSlots] = useState<SlotType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (!date) {
      setSlots([])
      setLoading(false)
      return
    }

    const fetchSlots = async () => {
      if (fetchingRef.current) return
      fetchingRef.current = true
      try {
        const res = await fetch(`/api/slots?date=${date}`)
        if (!res.ok) throw new Error('fetch failed')
        const data: SlotType[] = await res.json()
        setSlots(data)
        setError(null)
      } catch {
        setError('Could not load slots. Retrying...')
      } finally {
        fetchingRef.current = false
        setLoading(false)
      }
    }

    setLoading(true)
    fetchSlots()
    timerRef.current = window.setInterval(fetchSlots, 5000)

    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
  }, [date])

  return { slots, loading, error }
}
