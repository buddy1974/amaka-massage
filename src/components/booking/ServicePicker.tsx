import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { services as staticServices } from '@/data/services'
import type { SelectedService, SelectedPrice } from '@/hooks/useBooking'
import { Loader2, Phone, MessageCircle } from 'lucide-react'

const PHONE   = '015213928938'
const PHONE_D = '01521 3928938'

interface ApiPrice {
  id: string
  duration_min: number
  price_eur: number
}

interface ApiService {
  id: string
  name: string
  slug: string
  description: string
  prices: ApiPrice[]
}

interface Props {
  onSelect: (service: SelectedService, price: SelectedPrice) => void
  /** Optional slug from ?service= query param — auto-selects + skips to next step */
  preselect?: string
}

/** Pick the "best" default price: prefer 60 min, otherwise first */
function defaultPrice(prices: ApiPrice[]): ApiPrice {
  return prices.find(p => p.duration_min === 60) ?? prices[0]
}

export const ServicePicker = ({ onSelect, preselect }: Props) => {
  const [apiServices, setApiServices]   = useState<ApiService[]>([])
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState<{ serviceId: string; priceId: string } | null>(null)
  const [apiError, setApiError]         = useState(false)

  // slug → image from static data
  const imageMap: Record<string, string> = {}
  staticServices.forEach(s => { imageMap[s.slug] = s.image as unknown as string })

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then((data: ApiService[]) => {
        if (data.length === 0) { setApiError(true); return }
        setApiServices(data)

        // Auto-select from ?service= query param
        if (preselect) {
          const match = data.find(s => s.slug === preselect)
          if (match && match.prices.length > 0) {
            const price = defaultPrice(match.prices)
            // Small tick so state settles before parent callback fires
            setTimeout(() => {
              onSelect(
                { id: match.id, name: match.name, slug: match.slug },
                { id: price.id, durationMin: price.duration_min, priceEur: price.price_eur }
              )
            }, 0)
          }
        }
      })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCardClick = (svc: ApiService) => {
    const price = defaultPrice(svc.prices)
    setSelected({ serviceId: svc.id, priceId: price.id })
  }

  /** Double-click selects the card AND immediately advances to the next step */
  const handleDoubleClick = (svc: ApiService) => {
    const price = defaultPrice(svc.prices)
    setSelected({ serviceId: svc.id, priceId: price.id })
    onSelect(
      { id: svc.id, name: svc.name, slug: svc.slug },
      { id: price.id, durationMin: price.duration_min, priceEur: price.price_eur }
    )
  }

  const handlePriceClick = (svcId: string, priceId: string) => {
    setSelected({ serviceId: svcId, priceId })
  }

  const handleContinue = () => {
    if (!selected) return
    const svc   = apiServices.find(s => s.id === selected.serviceId)
    const price = svc?.prices.find(p => p.id === selected.priceId)
    if (!svc || !price) return
    onSelect(
      { id: svc.id, name: svc.name, slug: svc.slug },
      { id: price.id, durationMin: price.duration_min, priceEur: price.price_eur }
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  // ── Fallback: API unavailable ──────────────────────────────────────────
  if (apiError) {
    return (
      <div>
        <h2 className="font-serif text-2xl text-primary-deep mb-2">Massage wählen</h2>
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800 flex flex-wrap items-center gap-3">
          <span>Online-Buchung vorübergehend nicht verfügbar – bitte rufen Sie uns an oder schreiben Sie per WhatsApp:</span>
          <div className="flex gap-2 shrink-0">
            <a href={`tel:${PHONE}`}>
              <Button size="sm" className="gradient-purple text-primary-foreground">
                <Phone className="h-3 w-3 mr-1" /> {PHONE_D}
              </Button>
            </a>
            <a href={`https://wa.me/49${PHONE}`} target="_blank" rel="noreferrer">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 opacity-80">
          {staticServices.map(svc => (
            <div key={svc.slug} className="bg-card rounded-2xl overflow-hidden shadow-card">
              <img src={svc.image as unknown as string} alt={svc.name} loading="lazy" className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-serif text-xl text-primary-deep">{svc.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{svc.description}</p>
                <ul className="mt-4 space-y-1.5 border-t border-border pt-3">
                  {svc.prices.map(p => (
                    <li key={p.duration} className="flex justify-between text-sm text-foreground/70 px-2">
                      <span>{p.duration}</span>
                      <span className="font-semibold text-primary">{p.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Normal flow ────────────────────────────────────────────────────────
  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-6">Massage wählen</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {apiServices.map(svc => {
          const img        = imageMap[svc.slug]
          const cardActive = selected?.serviceId === svc.id
          return (
            <div
              key={svc.id}
              onClick={() => handleCardClick(svc)}
              onDoubleClick={() => handleDoubleClick(svc)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleCardClick(svc)}
              className={`
                bg-card rounded-2xl overflow-hidden shadow-card border-2 transition-all cursor-pointer
                hover:shadow-soft hover:border-primary/50
                ${cardActive ? 'border-primary' : 'border-transparent'}
              `}
            >
              {img && (
                <img src={img} alt={svc.name} loading="lazy"
                  className="h-40 w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-serif text-xl text-primary-deep">{svc.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{svc.description}</p>
                <ul className="mt-4 space-y-2 border-t border-border pt-3">
                  {svc.prices.map(p => {
                    const isSelected = selected?.serviceId === svc.id && selected?.priceId === p.id
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handlePriceClick(svc.id, p.id) }}
                          className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'hover:bg-secondary text-foreground/80 hover:text-foreground'
                          }`}
                        >
                          <span>{p.duration_min} min</span>
                          <span className="font-semibold">{p.price_eur} €</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="mt-8 flex justify-end">
          <Button onClick={handleContinue} className="gradient-purple text-primary-foreground px-8">
            Continue →
          </Button>
        </div>
      )}
    </div>
  )
}
