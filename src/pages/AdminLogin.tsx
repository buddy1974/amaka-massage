import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flower2, Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authStorage } from '@/lib/auth'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Login failed')
        return
      }
      const { token } = await res.json()
      authStorage.set(token)
      navigate('/admin', { replace: true })
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Amaka Massage" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <div className="flex items-center justify-center gap-2 text-primary-deep">
            <Lock className="h-5 w-5" />
            <h1 className="font-serif text-2xl">Admin Login</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Amaka Massage – Internal Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full gradient-purple text-primary-foreground hover:opacity-90"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
          <Flower2 className="h-3 w-3 text-primary" /> Amaka Massage Admin
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
