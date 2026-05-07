import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { services as staticServices } from '@/data/services'
import type { SelectedService, SelectedPrice } from '@/hooks/useBooking'
import { Loader2 } from 'lucide-react'

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
}

export const ServicePicker = ({ onSelect }: Props) => {
  const [apiServices, setApiServices] = useState<ApiService[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<{ serviceId: string; priceId: string } | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then((data: ApiService[]) => setApiServices(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Map slug → image URL from static data
  const imageMap: Record<string, string> = {}
  staticServices.forEach(s => { imageMap[s.slug] = s.image as unknown as string })

  const handleContinue = () => {
    if (!selected) return
    const svc = apiServices.find(s => s.id === selected.serviceId)
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

  if (apiServices.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl shadow-card">
        <p className="text-muted-foreground">Services are currently unavailable online.</p>
        <p className="mt-3 text-sm">
          Please call or WhatsApp:{' '}
          <a href="tel:015906306248" className="text-primary font-semibold">
            0159 06306248
          </a>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-6">Choose Your Service</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {apiServices.map(svc => {
          const img = imageMap[svc.slug]
          return (
            <div
              key={svc.id}
              className={`bg-card rounded-2xl overflow-hidden shadow-card border-2 transition-colors ${
                selected?.serviceId === svc.id ? 'border-primary' : 'border-transparent'
              }`}
            >
              {img && (
                <img src={img} alt={svc.name} loading="lazy" className="h-40 w-full object-cover" />
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
                          onClick={() => setSelected({ serviceId: svc.id, priceId: p.id })}
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
