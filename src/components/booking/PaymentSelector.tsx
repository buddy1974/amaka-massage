import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Banknote, Loader2 } from 'lucide-react'

interface Props {
  amount: number
  onSelect: (method: 'stripe' | 'on_site') => void
  submitting?: boolean
}

type Method = 'stripe' | 'on_site'

const OPTIONS: { id: Method; label: string; sub: string; Icon: React.ElementType; detail: (amount: number) => string }[] = [
  {
    id: 'stripe',
    label: 'Pay by card',
    sub: 'Secure online payment',
    Icon: CreditCard,
    detail: (a) => `${a} €`,
  },
  {
    id: 'on_site',
    label: 'Pay on-site',
    sub: 'Pay when you arrive',
    Icon: Banknote,
    detail: () => 'Cash or card',
  },
]

export const PaymentSelector = ({ amount, onSelect, submitting = false }: Props) => {
  const [method, setMethod] = useState<Method | null>(null)

  return (
    <div>
      <h2 className="font-serif text-2xl text-primary-deep mb-6">Payment Method</h2>
      <div className="grid sm:grid-cols-2 gap-4 max-w-md">
        {OPTIONS.map(opt => {
          const isSelected = method === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMethod(opt.id)}
              className={`
                rounded-2xl border-2 p-6 text-left transition-all
                ${isSelected
                  ? 'border-primary bg-secondary/60 shadow-soft'
                  : 'border-border bg-card hover:border-primary/40'
                }
              `}
            >
              <opt.Icon className={`h-8 w-8 mb-3 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className={`font-semibold ${isSelected ? 'text-primary-deep' : 'text-foreground'}`}>
                {opt.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{opt.sub}</div>
              <div className={`text-xl font-bold mt-2 ${isSelected ? 'text-primary' : 'text-foreground/70'}`}>
                {opt.detail(amount)}
              </div>
            </button>
          )
        })}
      </div>

      {method && (
        <div className="mt-8">
          <Button
            onClick={() => onSelect(method)}
            disabled={submitting}
            className="gradient-purple text-primary-foreground px-8 py-3 text-base"
          >
            {submitting
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming…</>
              : 'Confirm Booking →'
            }
          </Button>
        </div>
      )}
    </div>
  )
}
