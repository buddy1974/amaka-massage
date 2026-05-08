// ─── Browser-side helpers (no process.env) ──────────────────────────────────

const TOKEN_KEY = 'amaka_admin_token'

export const authStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token) },
  clear: (): void => { localStorage.removeItem(TOKEN_KEY) },
}

/** Decode JWT payload and check exp without a library (browser only). */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function authHeader(): Record<string, string> {
  const token = authStorage.get()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─── Server-side helpers (jose / process.env) ───────────────────────────────

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) throw new Error('ADMIN_JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

export async function signAdminToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret())
}

export async function verifyAdminToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getSecret())
  return payload
}
