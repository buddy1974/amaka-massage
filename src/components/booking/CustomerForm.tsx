import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  initialName?: string
  initialPhone?: string
  initialEmail?: string
  onSubmit: (name: string, phone: string, email: string) => void
}

const PHONE_REGEX = /^(\+49|0)[0-9\s\-]{9,14}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const CustomerForm = ({ initialName = '', initialPhone = '', initialEmail = '', onSubmit }: Props) => {
  const [name,  setName]  = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [email, setEmail] = useState(initialEmail)
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({})

  const validate = (): boolean => {
    const e: { name?: string; phone?: string; email?: string } = {}
    if (!name.trim() || name.trim().length < 2) {
      e.name = 'Bitte vollständigen Namen eingeben (mind. 2 Zeichen).'
    }
    if (!phone.trim() || !PHONE_REGEX.test(phone.trim())) {
      e.phone = 'Bitte eine gültige Telefonnummer eingeben (z. B. 0159 06306248).'
    }
    // Email is optional but must be valid if provided
    if (email.trim() && !EMAIL_REGEX.test(email.trim())) {
      e.email = 'Bitte eine gültige E-Mail-Adresse eingeben.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (validate()) onSubmit(name.trim(), phone.trim(), email.trim())
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-serif text-2xl text-primary-deep mb-6">Ihre Daten</h2>
      <div className="space-y-5 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="cust-name">Full Name</Label>
          <Input
            id="cust-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sarah Müller"
            className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cust-phone">Phone Number</Label>
          <Input
            id="cust-phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. +49 176 1234 5678"
            className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cust-email">
            E-Mail <span className="text-muted-foreground text-xs font-normal">(optional – für Buchungsbestätigung)</span>
          </Label>
          <Input
            id="cust-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. sarah@beispiel.de"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div className="pt-2">
          <Button type="submit" className="gradient-purple text-primary-foreground px-8">
            Continue →
          </Button>
        </div>
      </div>
    </form>
  )
}
