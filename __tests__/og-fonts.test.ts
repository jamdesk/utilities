import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const FONT_DIR = join(process.cwd(), 'scripts', 'fonts')
const FONT_FILES = ['Inter-Regular.ttf', 'Inter-Bold.ttf', 'NotoEmoji-Regular.ttf']

// A valid sfnt (TTF/OTF) starts with one of these 4-byte signatures.
// Catches a 404 HTML page, a git-LFS pointer, or a truncated download.
const SFNT_SIGNATURES = [
  Buffer.from([0x00, 0x01, 0x00, 0x00]), // TrueType
  Buffer.from('OTTO', 'latin1'), // CFF/OpenType
  Buffer.from('true', 'latin1'), // legacy TrueType (Apple)
  Buffer.from('ttcf', 'latin1'), // TrueType Collection (we reject below — satori can't use it)
]

describe('bundled OG fonts', () => {
  for (const file of FONT_FILES) {
    it(`${file} exists, is non-trivial, and is a valid non-collection TTF`, () => {
      const path = join(FONT_DIR, file)
      expect(existsSync(path), `${file} missing`).toBe(true)
      const buf = readFileSync(path)
      expect(buf.byteLength, `${file} too small`).toBeGreaterThan(20_000)
      const sig = buf.subarray(0, 4)
      const matched = SFNT_SIGNATURES.some((s) => sig.equals(s))
      expect(matched, `${file} not a valid sfnt (got ${sig.toString('hex')})`).toBe(true)
      // satori/opentype cannot use .ttc collections — reject them explicitly.
      expect(sig.equals(Buffer.from('ttcf', 'latin1')), `${file} is a .ttc collection`).toBe(false)
    })
  }
})
