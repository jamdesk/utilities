import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tools } from '../lib/tools'
import {
  loadInterFonts,
  loadEmojiFont,
  SUPPORTED_ICON_CODEPOINTS,
  SUPPORTED_TEXT_CODEPOINTS,
} from '../scripts/generate-og'

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

describe('OG font loaders', () => {
  it('loadInterFonts returns weight 400 and 700 with data', () => {
    const fonts = loadInterFonts()
    expect(fonts).not.toBeNull()
    expect(fonts!.map((f) => f.weight).sort()).toEqual([400, 700])
    for (const f of fonts!) {
      expect(f.name).toBe('Inter')
      expect(f.data.byteLength).toBeGreaterThan(20_000)
    }
  })

  it('loadEmojiFont returns a non-empty Emoji font', () => {
    const f = loadEmojiFont()
    expect(f).not.toBeNull()
    expect(f!.name).toBe('Emoji')
    expect(f!.data.byteLength).toBeGreaterThan(20_000)
  })
})

describe('icon coverage', () => {
  it('every tool icon is in SUPPORTED_ICON_CODEPOINTS', () => {
    for (const tool of tools) {
      const codepoints = Array.from(tool.icon).map((ch) => ch.codePointAt(0)!)
      for (const cp of codepoints) {
        expect(
          SUPPORTED_ICON_CODEPOINTS.has(cp),
          `tool "${tool.slug}" icon ${tool.icon} (U+${cp.toString(16).toUpperCase()}) not in SUPPORTED_ICON_CODEPOINTS`,
        ).toBe(true)
      }
    }
  })
})

describe('card text coverage', () => {
  // The cards render tool.name + tool.description (not just the icon). A non-ASCII
  // glyph in a name/description that Inter can't render is a tofu box in a 64px
  // headline that NO icon test would catch. Assert every non-ASCII codepoint in
  // card text is renderable (in Inter via SUPPORTED_TEXT_CODEPOINTS, or via the
  // icon/SVG paths). ASCII always renders in Inter.
  const renderable = new Set<number>([
    ...SUPPORTED_ICON_CODEPOINTS,
    ...SUPPORTED_TEXT_CODEPOINTS,
  ])
  it('every non-ASCII codepoint in a tool name/description is renderable', () => {
    for (const tool of tools) {
      for (const [field, value] of [['name', tool.name], ['description', tool.description]] as const) {
        for (const ch of value) {
          const cp = ch.codePointAt(0)!
          if (cp < 0x80) continue
          expect(
            renderable.has(cp),
            `tool "${tool.slug}" ${field} "${value}" has unsupported codepoint ` +
              `U+${cp.toString(16).toUpperCase()} — verify Inter (or the emoji/SVG path) ` +
              `renders it, then add it to SUPPORTED_TEXT_CODEPOINTS`,
          ).toBe(true)
        }
      }
    }
  })
})
