import { Navigate } from 'react-router-dom'
import { authStorage, isTokenValid } from '@/lib/auth'

interface Props {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const token = authStorage.get()
  if (!isTokenValid(token)) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
