import sharp from 'sharp'
import { statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'public', 'team', 'micheal-luwayne.png')
const out = path.join(root, 'public', 'team', 'micheal-luwayne.jpg')

const before = statSync(src).size
await sharp(src).resize(800, 800, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
const after = statSync(out).size
console.log(`portrait: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB (jpg)`)
