import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList, CalendarDays, BarChart2, LogOut,
  RefreshCw, ChevronLeft, ChevronRight, Check, X,
  Phone, Flower2, Lock, Unlock, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authStorage, authHeader } from '@/lib/auth'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────────────
interface Booking {
  id: string
  customerName: string
  customerPhone: string
  paymentMethod: string
  paymentStatus: string
  bookingStatus: string
  createdAt: string
  bookingDate: string
  bookingTime: string
  durationMin: number
  serviceName: string
  priceEur: string
}

interface Block {
  id: string
  blockDate: string
  blockTime: string | null   // null = whole day
  durationMin: number
  note: string | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const HOURS: Record<number, { open: number; close: number } | null> = {
  0: null, 1: { open: 600, close: 1140 }, 2: { open: 600, close: 1140 },
  3: { open: 600, close: 1020 }, 4: { open: 600, close: 1140 },
  5: { open: 600, close: 1140 }, 6: { open: 780, close: 1200 },
}
const DAY_DE = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
const MON_DE = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']

function isoDate(d: Date) { return d.toISOString().slice(0, 10) }
function pad(n: number) { return String(n).padStart(2, '0') }

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number); return h * 60 + m
}
function minsToTime(m: number): string {
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
}

function getSlotsForDay(date: string): string[] {
  const [y, m, d] = date.split('-').map(Number)
  const dow   = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  const hours = HOURS[dow]
  if (!hours) return []
  const slots: string[] = []
  for (let t = hours.open; t < hours.close; t += 30) slots.push(minsToTime(t))
  return slots
}

function isOpenDate(date: string): boolean {
  const [y, m, d] = date.split('-').map(Number)
  return HOURS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()] !== null
}

function fmtDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return `${DAY_DE[dow]}, ${d}. ${MON_DE[m - 1]} ${y}`
}

function fmtShort(date: string, time: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return `${pad(d)}.${pad(m)}. · ${time.slice(0, 5)}`
}

function statusBadge(s: string) {
  return s === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200'
    : s === 'pending'   ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    : s === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200'
    : 'bg-gray-100 text-gray-600 border border-gray-200'
}

// ── Build day rows ────────────────────────────────────────────────────────────
interface DayRow {
  time: string
  booking: Booking | null
  bookingIsStart: boolean
  block: Block | null
  blockIsStart: boolean
  isFree: boolean
}

function buildDayRows(date: string, bookings: Booking[], blocks: Block[]): DayRow[] {
  const slots = getSlotsForDay(date)
  if (slots.length === 0) return []

  const dayBlock = blocks.find(b => !b.blockTime) ?? null
  if (dayBlock) {
    return slots.map((time, i) => ({
      time, booking: null, bookingIsStart: false,
      block: dayBlock, blockIsStart: i === 0, isFree: false,
    }))
  }

  return slots.map(time => {
    const mins = timeToMins(time)
    const activeBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.bookingStatus))

    const covBook = activeBookings.find(b => {
      const s = timeToMins(b.bookingTime); return mins >= s && mins < s + b.durationMin
    }) ?? null
    const covBlock = blocks.find(b => {
      if (!b.blockTime) return false
      const s = timeToMins(b.blockTime); return mins >= s && mins < s + (b.durationMin ?? 60)
    }) ?? null

    return {
      time,
      booking: covBook,
      bookingIsStart: covBook ? covBook.bookingTime.slice(0, 5) === time : false,
      block: covBlock,
      blockIsStart: covBlock ? (covBlock.blockTime?.slice(0, 5) === time) : false,
      isFree: !covBook && !covBlock,
    }
  })
}

// ── Component ────────────────────────────────────────────────────────────────
type Tab = 'bookings' | 'calendar' | 'stats'

const DURATIONS = [30, 60, 90, 120, 150, 180]

export default function Admin() {
  const navigate  = useNavigate()
  const [tab,          setTab]         = useState<Tab>('calendar')
  const [bookings,     setBookings]    = useState<Booking[]>([])
  const [calDate,      setCalDate]     = useState(isoDate(new Date()))
  const [calBlocks,    setCalBlocks]   = useState<Block[]>([])
  const [loadingCal,   setLoadingCal]  = useState(false)
  const [loadingBk,    setLoadingBk]   = useState(false)
  // Inline block form state: key = "HH:MM" or "day"
  const [blockForm,    setBlockForm]   = useState<{ key: string; duration: number; note: string } | null>(null)
  const [savingBlock,  setSavingBlock] = useState(false)
  const [blockingDay,  setBlockingDay] = useState(false)

  // ── Auth check ──────────────────────────────────────────────────────────
  const logout = () => { authStorage.clear(); navigate('/admin/login') }

  // ── Fetch bookings ──────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    setLoadingBk(true)
    try {
      const res = await fetch('/api/admin/bookings', { headers: authHeader() })
      if (res.status === 401) { logout(); return }
      setBookings(await res.json())
    } catch { toast.error('Buchungen konnten nicht geladen werden') }
    finally { setLoadingBk(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Fetch blocks for calendar date ──────────────────────────────────────
  const fetchBlocks = useCallback(async (date: string) => {
    setLoadingCal(true)
    try {
      const res = await fetch(`/api/admin/blocks?date=${date}`, { headers: authHeader() })
      if (res.status === 401) { logout(); return }
      setCalBlocks(await res.json())
    } catch { toast.error('Blöcke konnten nicht geladen werden') }
    finally { setLoadingCal(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])
  useEffect(() => { if (tab === 'calendar') fetchBlocks(calDate) }, [tab, calDate, fetchBlocks])

  // ── Update booking status ────────────────────────────────────────────────
  const updateBooking = async (id: string, bookingStatus: string) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ id, bookingStatus }),
    })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, bookingStatus } : b))
    toast.success(bookingStatus === 'confirmed' ? '✅ Bestätigt' : '❌ Abgesagt')
  }

  // ── Add block (single slot) ──────────────────────────────────────────────
  const addBlock = async (blockTime: string | null, duration: number, note: string) => {
    setSavingBlock(true)
    try {
      const res = await fetch('/api/admin/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ block_date: calDate, block_time: blockTime, duration_min: duration, note: note || null }),
      })
      if (!res.ok) { toast.error('Fehler beim Sperren'); return }
      const block = await res.json()
      setCalBlocks(prev => [...prev, block])
      setBlockForm(null)
      toast.success(blockTime ? `${blockTime.slice(0,5)} Uhr gesperrt` : 'Ganzer Tag gesperrt')
    } catch { toast.error('Netzwerkfehler') }
    finally { setSavingBlock(false) }
  }

  // ── Block entire day ─────────────────────────────────────────────────────
  const blockDay = async () => {
    setBlockingDay(true)
    await addBlock(null, 0, 'Ganztägig gesperrt')
    setBlockingDay(false)
  }

  // ── Remove block ─────────────────────────────────────────────────────────
  const removeBlock = async (id: string) => {
    await fetch('/api/admin/blocks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ id }),
    })
    setCalBlocks(prev => prev.filter(b => b.id !== id))
    toast.success('Sperre aufgehoben')
  }

  // ── Shift calendar date ──────────────────────────────────────────────────
  const shiftDay = (delta: number) => {
    const d = new Date(calDate); d.setDate(d.getDate() + delta)
    setCalDate(isoDate(d))
  }

  // ── Derived calendar state ───────────────────────────────────────────────
  const calBookings = bookings.filter(b => b.bookingDate === calDate)
  const dayRows     = buildDayRows(calDate, calBookings, calBlocks)
  const isDayOpen   = isOpenDate(calDate)
  const isDayBlocked= calBlocks.some(b => !b.blockTime)

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid' || b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + parseFloat(b.priceEur || '0'), 0)

  return (
    <div className="min-h-screen bg-secondary/30">

      {/* Header */}
      <header className="gradient-purple text-primary-foreground sticky top-0 z-40 shadow-soft">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Amaka" className="h-10 w-auto object-contain brightness-0 invert" />
            <div>
              <div className="font-serif text-lg leading-tight">Admin Dashboard</div>
              <div className="text-xs opacity-70">AMAKA'S CITY – Essen</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-card border-b border-border">
        <div className="container flex gap-1 py-2">
          {([
            { key: 'calendar',  label: 'Kalender',  icon: CalendarDays },
            { key: 'bookings',  label: 'Buchungen', icon: ClipboardList },
            { key: 'stats',     label: 'Übersicht', icon: BarChart2 },
          ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}>
              <Icon className="h-4 w-4" /> {label}
              {key === 'bookings' && bookings.filter(b => b.bookingStatus === 'pending').length > 0 && (
                <span className="bg-yellow-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {bookings.filter(b => b.bookingStatus === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-6 max-w-4xl">

        {/* ── CALENDAR TAB ──────────────────────────────────────────────── */}
        {tab === 'calendar' && (
          <div>
            {/* Date nav */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Button variant="outline" size="icon" onClick={() => shiftDay(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Input type="date" value={calDate} onChange={e => setCalDate(e.target.value)} className="w-44" />
              <Button variant="outline" size="icon" onClick={() => shiftDay(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCalDate(isoDate(new Date()))}>
                Heute
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fetchBlocks(calDate)} disabled={loadingCal}>
                  <RefreshCw className={`h-4 w-4 ${loadingCal ? 'animate-spin' : ''}`} />
                </Button>
                {isDayOpen && !isDayBlocked && (
                  <Button size="sm" variant="destructive" onClick={blockDay} disabled={blockingDay}>
                    <Lock className="h-3 w-3 mr-1" />
                    {blockingDay ? '…' : 'Tag sperren'}
                  </Button>
                )}
                {isDayBlocked && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      const db = calBlocks.find(b => !b.blockTime)
                      if (db) removeBlock(db.id)
                    }}>
                    <Unlock className="h-3 w-3 mr-1" /> Tag freigeben
                  </Button>
                )}
              </div>
            </div>

            <h2 className="font-serif text-xl text-primary-deep mb-4">{fmtDate(calDate)}</h2>

            {!isDayOpen && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-amber-800 text-sm">
                <strong>Ruhetag</strong> – kein Betrieb an diesem Tag.
              </div>
            )}

            {isDayOpen && isDayBlocked && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">Ganzer Tag gesperrt</p>
                  <p className="text-sm text-red-600">Keine Online-Buchungen möglich. Klicke "Tag freigeben" um zu entsperren.</p>
                </div>
              </div>
            )}

            {/* Legend */}
            {isDayOpen && (
              <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Frei</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Ausstehend (Online)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Bestätigt (Online)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Gesperrt (Telefon/Walk-in)</span>
              </div>
            )}

            {/* Day rows */}
            {isDayOpen && !isDayBlocked && (
              <div className="space-y-1.5">
                {dayRows.map(row => (
                  <div key={row.time}>
                    {/* Normal row */}
                    {blockForm?.key !== row.time && (
                      <div className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                        row.isFree
                          ? 'bg-green-50 hover:bg-green-100 border border-green-100'
                          : row.block
                          ? 'bg-red-50 border border-red-100'
                          : row.booking?.bookingStatus === 'confirmed'
                          ? 'bg-blue-50 border border-blue-100'
                          : 'bg-yellow-50 border border-yellow-100'
                      }`}>
                        {/* Dot */}
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          row.isFree ? 'bg-green-400'
                          : row.block ? 'bg-red-400'
                          : row.booking?.bookingStatus === 'confirmed' ? 'bg-blue-400'
                          : 'bg-yellow-400'
                        }`} />

                        {/* Time */}
                        <span className="font-mono text-sm font-semibold text-foreground w-12 shrink-0">
                          {row.time}
                        </span>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-sm">
                          {row.isFree && (
                            <span className="text-muted-foreground">Frei</span>
                          )}
                          {row.block && row.blockIsStart && (
                            <span className="font-medium text-red-800">
                              🔒 {row.block.note ?? 'Gesperrt'}{' '}
                              <span className="text-red-500 text-xs">({row.block.durationMin} Min.)</span>
                            </span>
                          )}
                          {row.block && !row.blockIsStart && (
                            <span className="text-red-400 text-xs italic">— (belegt)</span>
                          )}
                          {row.booking && row.bookingIsStart && (
                            <span className="font-medium text-foreground">
                              {row.booking.customerName} &nbsp;·&nbsp; {row.booking.serviceName} {row.booking.durationMin} Min.
                              <a href={`tel:${row.booking.customerPhone}`}
                                className="ml-2 text-xs text-muted-foreground hover:text-primary">
                                <Phone className="h-3 w-3 inline" /> {row.booking.customerPhone}
                              </a>
                            </span>
                          )}
                          {row.booking && !row.bookingIsStart && (
                            <span className="text-muted-foreground text-xs italic">— (belegt)</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 shrink-0">
                          {row.isFree && (
                            <Button size="sm" variant="outline"
                              className="text-xs h-7 px-2 border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => setBlockForm({ key: row.time, duration: 60, note: '' })}>
                              <Lock className="h-3 w-3 mr-1" /> Sperren
                            </Button>
                          )}
                          {row.block && row.blockIsStart && (
                            <Button size="sm" variant="outline"
                              className="text-xs h-7 px-2 border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => removeBlock(row.block!.id)}>
                              <Unlock className="h-3 w-3 mr-1" /> Freigeben
                            </Button>
                          )}
                          {row.booking && row.bookingIsStart && row.booking.bookingStatus === 'pending' && (
                            <>
                              <Button size="sm"
                                className="text-xs h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => updateBooking(row.booking!.id, 'confirmed')}>
                                <Check className="h-3 w-3 mr-1" /> Best.
                              </Button>
                              <Button size="sm" variant="destructive"
                                className="text-xs h-7 px-2"
                                onClick={() => updateBooking(row.booking!.id, 'cancelled')}>
                                <X className="h-3 w-3 mr-1" /> Abs.
                              </Button>
                            </>
                          )}
                          {row.booking && row.bookingIsStart && row.booking.bookingStatus === 'confirmed' && (
                            <Button size="sm" variant="outline"
                              className="text-xs h-7 px-2"
                              onClick={() => updateBooking(row.booking!.id, 'cancelled')}>
                              <X className="h-3 w-3 mr-1" /> Absagen
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Inline block form */}
                    {blockForm?.key === row.time && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-2">
                        <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                          <Lock className="h-4 w-4" /> {row.time} Uhr sperren
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <select
                            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background"
                            value={blockForm.duration}
                            onChange={e => setBlockForm(f => f ? { ...f, duration: Number(e.target.value) } : f)}>
                            {DURATIONS.map(d => (
                              <option key={d} value={d}>{d} Min.</option>
                            ))}
                          </select>
                          <Input
                            className="text-sm flex-1 min-w-40 h-8"
                            placeholder="Notiz: Telefon: Name / Walk-in / …"
                            value={blockForm.note}
                            onChange={e => setBlockForm(f => f ? { ...f, note: e.target.value } : f)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" disabled={savingBlock}
                            onClick={() => addBlock(row.time, blockForm.duration, blockForm.note)}>
                            {savingBlock ? '…' : 'Sperren'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setBlockForm(null)}>
                            Abbrechen
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS TAB ──────────────────────────────────────────────── */}
        {tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-primary-deep">Alle Buchungen</h2>
              <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loadingBk}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loadingBk ? 'animate-spin' : ''}`} /> Aktualisieren
              </Button>
            </div>

            {bookings.filter(b => b.bookingStatus === 'pending').length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-yellow-800 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <strong>{bookings.filter(b => b.bookingStatus === 'pending').length} ausstehende</strong>&nbsp;Buchungen warten auf Bestätigung.
              </div>
            )}

            {bookings.length === 0 && !loadingBk && (
              <div className="text-center py-20 text-muted-foreground">
                <Flower2 className="h-10 w-10 mx-auto mb-3 text-primary/40" /> Noch keine Buchungen.
              </div>
            )}

            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="bg-card rounded-2xl p-4 shadow-card flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-primary-deep">{b.customerName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(b.bookingStatus)}`}>
                        {b.bookingStatus}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(b.paymentStatus)}`}>
                        {b.paymentMethod === 'on_site' ? '💵 vor Ort' : `💳 ${b.paymentStatus}`}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-0.5">
                      <span>{b.bookingDate && b.bookingTime ? fmtShort(b.bookingDate, b.bookingTime) : '–'}</span>
                      <span>{b.serviceName} · {b.durationMin} Min.</span>
                      <span className="font-semibold text-primary">{parseFloat(b.priceEur || '0').toFixed(0)} €</span>
                      <a href={`tel:${b.customerPhone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" /> {b.customerPhone}
                      </a>
                    </div>
                  </div>
                  {b.bookingStatus === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateBooking(b.id, 'confirmed')}>
                        <Check className="h-3 w-3 mr-1" /> Bestätigen
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateBooking(b.id, 'cancelled')}>
                        <X className="h-3 w-3 mr-1" /> Absagen
                      </Button>
                    </div>
                  )}
                  {b.bookingStatus === 'confirmed' && (
                    <Button size="sm" variant="outline" className="shrink-0"
                      onClick={() => updateBooking(b.id, 'cancelled')}>
                      <X className="h-3 w-3 mr-1" /> Absagen
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STATS TAB ────────────────────────────────────────────────── */}
        {tab === 'stats' && (
          <div>
            <h2 className="font-serif text-2xl text-primary-deep mb-6">Übersicht</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Buchungen gesamt', value: bookings.length, color: 'text-primary' },
                { label: 'Bestätigt', value: bookings.filter(b => b.bookingStatus === 'confirmed').length, color: 'text-blue-600' },
                { label: 'Ausstehend', value: bookings.filter(b => b.bookingStatus === 'pending').length, color: 'text-yellow-600' },
                { label: 'Umsatz (bestätigt)', value: `${totalRevenue.toFixed(0)} €`, color: 'text-green-600' },
              ].map(s => (
                <div key={s.label} className="bg-card rounded-2xl p-6 shadow-card text-center">
                  <div className={`text-4xl font-bold font-serif ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <h3 className="font-serif text-xl text-primary-deep mb-3">Nach Service</h3>
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              {Array.from(
                bookings.reduce((acc, b) => {
                  const cur = acc.get(b.serviceName) ?? { count: 0, revenue: 0 }
                  acc.set(b.serviceName, { count: cur.count + 1, revenue: cur.revenue + parseFloat(b.priceEur || '0') })
                  return acc
                }, new Map<string, { count: number; revenue: number }>())
              ).sort((a, b) => b[1].count - a[1].count).map(([name, data], i, arr) => (
                <div key={name} className={`flex items-center justify-between px-6 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="font-medium text-primary-deep">{name}</span>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span>{data.count} Buchung{data.count !== 1 ? 'en' : ''}</span>
                    <span className="font-semibold text-primary">{data.revenue.toFixed(0)} €</span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">Noch keine Daten</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
