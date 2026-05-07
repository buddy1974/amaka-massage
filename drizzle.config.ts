import { defineConfig } from 'drizzle-kit'
import { readFileSync, existsSync } from 'fs'

// drizzle-kit runs outside Vite so it doesn't auto-load .env.local
for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) {
    readFileSync(f, 'utf-8').split('\n').forEach((line) => {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    })
    break
  }
}

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
