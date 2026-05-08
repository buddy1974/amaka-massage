import sharp from 'sharp'
import { readdirSync, unlinkSync } from 'fs'
import { join, extname, basename } from 'path'

const dir = 'src/assets'
const pngs = readdirSync(dir).filter(f => extname(f) === '.png')

for (const file of pngs) {
  const input  = join(dir, file)
  const output = join(dir, basename(file, '.png') + '.webp')
  const { size: before } = (await import('fs')).statSync(input)
  await sharp(input).webp({ quality: 82 }).toFile(output)
  const { size: after } = (await import('fs')).statSync(output)
  console.log(`${file} → ${basename(output)}  ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB  (-${(100*(before-after)/before).toFixed(0)}%)`)
  unlinkSync(input)
}

console.log('\n✅ Done — all PNGs converted to WebP and originals removed.')
