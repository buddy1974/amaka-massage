import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, ClipboardList, BarChart2, LogOut, RefreshCw,
  ChevronLeft, ChevronRight, Plus, Check, X, Phone, Clock, Flower2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authStorage, authHeader } from '@/lib/auth'
import { isOpenDay, getSlotsForDate } from '@/lib/openingHours'
import { toast } from 'sonner'

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  paymentMethod: string
  paymentStatus: string
  bookingStatus: string
  createdAt: string
  slotDate: string
  slotTime: string
  serviceName: string
  durationMin: number
  priceEur: string
}

interface Slot {
  id: string
  slotDate: string
  slotTime: string
  isAvailable: boolean
  lockedUntil: string | null
}

function statusColor(s: string) {
  return s === 'confirmed' ? 'bg-green-100 text-green-800'
    : s === 'pending' ? 'bg-yellow-100 text-yellow-800'
    : s === 'paid' ? 'bg-blue-100 text-blue-800'
    : 'bg-red-100 text-red-700'
}

function fmt(date: string, time: string) {
  const d = new Date(`${date}T${time}`)
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }) +
    ' · ' + time.slice(0, 5)
}

function isoDate(d: Date) { return d.toISOString().slice(0, 10) }

type Tab = 'bookings' | 'slots' | 'stats'

const Admin = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(isoDate(new Date()))
  const [addingSlots, setAddingSlots] = useState(false)

  const selectedDow = new Date(selectedDate + 'T00:00:00').getDay()
  const selectedIsOpen = isOpenDay(selectedDow)
  const expectedSlotCount = getSlotsForDate(selectedDate).length

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true)
    try {
      const res = await fetch('/api/admin/bookings', { headers: authHeader() })
      if (res.status === 401) { authStorage.clear(); navigate('/admin/login'); return }
      setBookings(await res.json())
    } catch { toast.error('Failed to load bookings') }
    finally { setLoadingBookings(false) }
  }, [navigate])

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true)
    try {
      const res = await fetch(`/api/admin/slots?date=${selectedDate}`, { headers: authHeader() })
      if (res.status === 401) { authStorage.clear(); navigate('/admin/login'); return }
      setSlots(await res.json())
    } catch { toast.error('Failed to load slots') }
    finally { setLoadingSlots(false) }
  }, [navigate, selectedDate])

  useEffect(() => { fetchBookings() }, [fetchBookings])
  useEffect(() => { if (tab === 'slots') fetchSlots() }, [tab, fetchSlots])

  const toggleSlot = async (slot: Slot) => {
    await fetch('/api/admin/slots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ id: slot.id, isAvailable: !slot.isAvailable }),
    })
    setSlots((prev) => prev.map((s) => s.id === slot.id ? { ...s, isAvailable: !s.isAvailable } : s))
  }

  const addDefaultSlots = async () => {
    if (!selectedIsOpen) { toast.error('This day is closed — no slots to add'); return }
    setAddingSlots(true)
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ date: selectedDate }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Failed'); return }
      toast.success(`${data.created} slot${data.created !== 1 ? 's' : ''} added for ${selectedDate}`)
      await fetchSlots()
    } catch { toast.error('Network error') }
    finally { setAddingSlots(false) }
  }

  const updateBookingStatus = async (id: string, bookingStatus: string) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ id, bookingStatus }),
    })
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, bookingStatus } : b))
    toast.success(`Booking ${bookingStatus}`)
  }

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + days)
    setSelectedDate(isoDate(d))
  }

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + parseFloat(b.priceEur), 0)

  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="gradient-purple text-primary-foreground sticky top-0 z-40 shadow-soft">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Amaka" className="h-10 w-auto object-contain brightness-0 invert" />
            <div>
              <div className="font-serif text-lg leading-tight">Admin Dashboard</div>
              <div className="text-xs opacity-70">Amaka Massage – Essen</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { authStorage.clear(); navigate('/admin/login') }}
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="bg-card border-b border-border">
        <div className="container flex gap-1 py-2">
          {([
            { key: 'bookings', label: 'Bookings', icon: ClipboardList },
            { key: 'slots',    label: 'Slots',    icon: Calendar },
            { key: 'stats',    label: 'Overview', icon: BarChart2 },
          ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8">

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-primary-deep">All Bookings</h2>
              <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loadingBookings}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loadingBookings ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>
            {bookings.length === 0 && !loadingBookings && (
              <div className="text-center py-20 text-muted-foreground">
                <Flower2 className="h-10 w-10 mx-auto mb-3 text-primary/40" /> No bookings yet.
              </div>
            )}
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="bg-card rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-primary-deep">{b.customerName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(b.bookingStatus)}`}>{b.bookingStatus}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(b.paymentStatus)}`}>
                        {b.paymentMethod === 'cash' ? '💵 cash' : `💳 ${b.paymentStatus}`}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-0.5">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmt(b.slotDate, b.slotTime)}</span>
                      <span>{b.serviceName} · {b.durationMin} min</span>
                      <span className="font-semibold text-primary">{parseFloat(b.priceEur).toFixed(0)} €</span>
                      <a href={`tel:${b.customerPhone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" />{b.customerPhone}
                      </a>
                    </div>
                  </div>
                  {b.bookingStatus === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateBookingStatus(b.id, 'confirmed')}>
                        <Check className="h-3 w-3 mr-1" /> Confirm
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(b.id, 'cancelled')}>
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  )}
                  {b.bookingStatus === 'confirmed' && (
                    <Button size="sm" variant="outline" className="shrink-0"
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}>
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLOTS */}
        {tab === 'slots' && (
          <div>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <h2 className="font-serif text-2xl text-primary-deep">Manage Slots</h2>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="icon" onClick={() => shiftDate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44" />
                <Button variant="outline" size="icon" onClick={() => shiftDate(1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <Button onClick={addDefaultSlots} disabled={addingSlots || !selectedIsOpen}
                className="gradient-purple text-primary-foreground hover:opacity-90 disabled:opacity-40">
                <Plus className="h-4 w-4 mr-1" />
                {addingSlots ? 'Adding…' : `Add ${expectedSlotCount} Slots`}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchSlots} disabled={loadingSlots}>
                <RefreshCw className={`h-4 w-4 ${loadingSlots ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {!selectedIsOpen && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-amber-800 text-sm mb-6">
                <strong>{DAY_NAMES[selectedDow]}</strong> is a closed day — no slots can be created.
              </div>
            )}

            {selectedIsOpen && slots.length === 0 && !loadingSlots && (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-3 text-primary/40" />
                No slots for this date. Click "Add {expectedSlotCount} Slots" to fill the day.
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots
                .sort((a, b) => a.slotTime.localeCompare(b.slotTime))
                .map((slot) => {
                  const locked = slot.lockedUntil && new Date(slot.lockedUntil) > new Date()
                  return (
                    <button key={slot.id} onClick={() => !locked && toggleSlot(slot)} disabled={!!locked}
                      className={`rounded-xl p-3 text-center text-sm font-medium transition-all border-2 ${
                        locked ? 'bg-yellow-50 border-yellow-200 text-yellow-700 cursor-not-allowed'
                        : slot.isAvailable ? 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100'
                        : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      }`}>
                      {slot.slotTime.slice(0, 5)}
                      <div className="text-xs mt-0.5 opacity-70">
                        {locked ? '🔒 locked' : slot.isAvailable ? '✓ open' : '✗ closed'}
                      </div>
                    </button>
                  )
                })}
            </div>
            {slots.length > 0 && (
              <p className="text-xs text-muted-foreground mt-4">
                Click any slot to toggle open / closed. Locked slots auto-release after 10 min.
              </p>
            )}
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div>
            <h2 className="font-serif text-2xl text-primary-deep mb-6">Overview</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Bookings', value: bookings.length, color: 'text-primary' },
                { label: 'Confirmed', value: bookings.filter(b => b.bookingStatus === 'confirmed').length, color: 'text-green-600' },
                { label: 'Pending', value: bookings.filter(b => b.bookingStatus === 'pending').length, color: 'text-yellow-600' },
                { label: 'Revenue (paid)', value: `${totalRevenue.toFixed(0)} €`, color: 'text-blue-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className={`text-4xl font-bold font-serif ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <h3 className="font-serif text-xl text-primary-deep mb-3">By Service</h3>
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              {Array.from(
                bookings.reduce((acc, b) => {
                  const cur = acc.get(b.serviceName) ?? { count: 0, revenue: 0 }
                  acc.set(b.serviceName, { count: cur.count + 1, revenue: cur.revenue + parseFloat(b.priceEur) })
                  return acc
                }, new Map<string, { count: number; revenue: number }>())
              ).sort((a, b) => b[1].count - a[1].count)
                .map(([name, data], i, arr) => (
                  <div key={name} className={`flex items-center justify-between px-6 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                    <span className="font-medium text-primary-deep">{name}</span>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <span>{data.count} booking{data.count !== 1 ? 's' : ''}</span>
                      <span className="font-semibold text-primary">{data.revenue.toFixed(0)} €</span>
                    </div>
                  </div>
                ))
              }
              {bookings.length === 0 && <div className="py-8 text-center text-muted-foreground text-sm">No data yet</div>}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Admin
