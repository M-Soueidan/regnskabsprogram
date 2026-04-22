/**
 * Genererer favicon-32 + PWA-ikoner fra masterfilen public/brand-icon-source.png
 * (Bilago kvadrat-ikon m. lilla squircle). Kræver: sharp (dev). Kører ved prebuild.
 * Opdater master ved at erstatte brand-icon-source.png (kvadratisk, helst 1024×1024).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')
const src = path.join(publicDir, 'brand-icon-source.png')

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn(
      '[gen-pwa-icons] sharp ikke installeret — springer ikon-generering over (kør: npm install)',
    )
    process.exit(0)
  }

  if (!fs.existsSync(src)) {
    console.warn('[gen-pwa-icons] mangler', src)
    process.exit(0)
  }

  const sizes = {
    'favicon-32.png': 32,
    'pwa-180.png': 180,
    'pwa-192.png': 192,
    'pwa-512.png': 512,
    'app-icon-64.png': 64,
  }

  for (const [name, size] of Object.entries(sizes)) {
    await sharp(src)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png()
      .toFile(path.join(publicDir, name))
  }
  console.log('[gen-pwa-icons] opdateret fra brand-icon-source.png:', Object.keys(sizes).join(', '))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
