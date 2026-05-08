import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body as { password?: string }
  if (!password) return res.status(400).json({ error: 'Password required' })

  const hash = process.env.ADMIN_PASSWORD_HASH!
  const valid = await bcrypt.compare(password, hash)
  if (!valid) return res.status(401).json({ error: 'Invalid password' })

  const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(secret)

  return res.json({ token })
}
