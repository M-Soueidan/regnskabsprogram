/**
 * Genererer favicon-32 + PWA-ikoner fra masterfilen public/brand-icon-source.png
 * (Bilago kvadrat-ikon m. lilla squircle). Kræver: sharp (dev). Kører ved prebuild.
 * Opdater master ved at erstatte brand-icon-source.png (kvadratisk, helst 1024×1024), og kør
 *   node scripts/gen-pwa-icons.mjs
 * så pwa-*.png / favicon opdateres. Efter deploy, tilføj PWA igen / ryd site-data for at se nyt ikon.
 *
 * Transparente kanter (typisk udenfor squircle) flades ud mod brand-lilla, så skalering
 * og iOS-ikonmask ikke efterlader tydelig hvid/lys linje i kanten.
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

  const { data: srcBuf, info: srcInfo } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const w = srcInfo.width
  const h = srcInfo.height
  const ch = srcInfo.channels
  const ySample = Math.min(h - 2, Math.floor(h * 0.88))
  const xSample = Math.floor(w / 2)
  const o = (ySample * w + xSample) * ch
  const r = srcBuf[o]
  const g = srcBuf[o + 1]
  const b = srcBuf[o + 2]
  const a = ch >= 4 ? srcBuf[o + 3] : 255
  const brandSquircleBackground =
    a < 8 ? { r: 58, g: 46, b: 188 } : { r, g, b }

  const sizes = {
    'favicon-32.png': 32,
    'pwa-180.png': 180,
    'pwa-192.png': 192,
    'pwa-512.png': 512,
    'app-icon-64.png': 64,
  }

  for (const [name, size] of Object.entries(sizes)) {
    await sharp(src)
      .ensureAlpha()
      .flatten({ background: brandSquircleBackground })
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
