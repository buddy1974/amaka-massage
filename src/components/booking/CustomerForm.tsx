import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  initialName?: string
  initialPhone?: string
  onSubmit: (name: string, phone: string) => void
}

const PHONE_REGEX = /^(\+49|0)[0-9\s\-]{9,14}$/

export const CustomerForm = ({ initialName = '', initialPhone = '', onSubmit }: Props) => {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const validate = (): boolean => {
    const e: { name?: string; phone?: string } = {}
    if (!name.trim() || name.trim().length < 2) {
      e.name = 'Please enter your full name (at least 2 characters).'
    }
    if (!phone.trim() || !PHONE_REGEX.test(phone.trim())) {
      e.phone = 'Please enter a valid German phone number (e.g. +49 176 1234 5678 or 0159 06306248).'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (validate()) onSubmit(name.trim(), phone.trim())
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-serif text-2xl text-primary-deep mb-6">Your Details</h2>
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

        <div className="pt-2">
          <Button type="submit" className="gradient-purple text-primary-foreground px-8">
            Continue →
          </Button>
        </div>
      </div>
    </form>
  )
}
