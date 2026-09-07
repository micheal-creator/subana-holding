import sharp from 'sharp'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
const src = path.join(pub, 'subana-logo.png')
mkdirSync(pub, { recursive: true })

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

// "any" icons: logo on white, no padding
async function icon(size, name, pad = 0) {
  const inner = Math.round(size * (1 - pad))
  const art = await sharp(readFileSync(src)).resize(inner, inner, { fit: 'contain', background: WHITE }).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toFile(path.join(pub, name))
}

async function run() {
  const meta = await sharp(readFileSync(src)).metadata()
  console.log(`source ${src} (${meta.width}x${meta.height})`)
  await icon(16, 'favicon-16.png')
  await icon(32, 'favicon-32.png')
  await icon(48, 'favicon-48.png')
  await icon(180, 'apple-touch-icon.png', 0.1)
  await icon(192, 'icon-192.png', 0.06)
  await icon(512, 'icon-512.png', 0.06)
  await icon(512, 'icon-maskable-512.png', 0.18)
  console.log('Subana icons generated in public/')
}

run().catch((e) => { console.error(e); process.exit(1) })
