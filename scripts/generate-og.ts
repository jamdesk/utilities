/**
 * Build-time OG image generation.
 * Generates 1200x630 PNG per tool using Satori + @resvg/resvg-js.
 *
 * Usage: tsx scripts/generate-og.ts
 * Runs automatically via postbuild script.
 */

import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync, readFileSync, existsSync, realpathSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { tools as toolRegistry } from '../lib/tools'

// Project to the subset the OG generator needs. Relative import (not the @/
// alias) so tsx can resolve without a tsconfig path-aliases pass.
const tools = toolRegistry.map((t) => ({
  slug: t.slug,
  name: t.name,
  description: t.description,
  icon: t.icon,
}))

const outDir = process.env.OG_OUT_DIR || join(process.cwd(), 'public', 'og')

const FONT_DIR = join(process.cwd(), 'scripts', 'fonts')

type FontWeight = 400 | 700
type FontEntry = { name: string; data: ArrayBuffer; weight: FontWeight; style: 'normal' }

function readAsArrayBuffer(path: string): ArrayBuffer | null {
  try {
    const buf = readFileSync(path)
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

// Legacy system-font probe — retained ONLY as a deep fallback if the bundled
// Inter is somehow missing. Returns one ArrayBuffer or null.
function loadSystemFont(): ArrayBuffer | null {
  const candidates = [
    '/Library/Fonts/Arial Unicode.ttf',
    '/System/Library/Fonts/SFNS.ttf',
    '/System/Library/Fonts/Geneva.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    'C:\\Windows\\Fonts\\arial.ttf',
  ]
  for (const path of candidates) {
    const data = readAsArrayBuffer(path)
    if (data) return data
  }
  return null
}

// Primary text font: bundled Inter (deterministic everywhere). Falls back to a
// system font only if the bundled files are unexpectedly absent.
export function loadInterFonts(): FontEntry[] | null {
  const regular = readAsArrayBuffer(join(FONT_DIR, 'Inter-Regular.ttf'))
  const bold = readAsArrayBuffer(join(FONT_DIR, 'Inter-Bold.ttf'))
  if (regular && bold) {
    return [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: bold, weight: 700, style: 'normal' },
    ]
  }
  const sys = loadSystemFont()
  if (sys) {
    // Reuse one face for both weights, matching the pre-bundling behaviour.
    return [
      { name: 'Inter', data: sys, weight: 400, style: 'normal' },
      { name: 'Inter', data: sys, weight: 700, style: 'normal' },
    ]
  }
  return null
}

// Monochrome emoji font for tool icons, returned to satori via
// loadAdditionalAsset for 'emoji' segments.
export function loadEmojiFont(): FontEntry | null {
  const data = readAsArrayBuffer(join(FONT_DIR, 'NotoEmoji-Regular.ttf'))
  return data ? { name: 'Emoji', data, weight: 400, style: 'normal' } : null
}

// Codepoints used as tool icons in lib/tools.ts. Rendering source per icon:
//   emoji (⚡ 👁 🔄 📋 📊 📈 🔗) -> Noto Emoji via loadAdditionalAsset('emoji')
//   base symbols (✓ ↑ ↓)         -> Inter
//   ⇄ (U+21C4)                   -> inline SVG (SYMBOL_SVGS; absent from both fonts)
// Asserted ⊇ lib/tools.ts icons by __tests__/og-fonts.test.ts so a newly-added
// unsupported icon fails CI until a human adds it here — AND, if it is an emoji,
// confirms it is in Noto Emoji's cmap (else add a SYMBOL_SVGS entry instead, the
// way ⇄ is handled).
export const SUPPORTED_ICON_CODEPOINTS: ReadonlySet<number> = new Set<number>([
  0x26a1, // ⚡
  0x2713, // ✓
  0x1f441, // 👁
  0x2193, // ↓
  0x2191, // ↑
  0x1f504, // 🔄
  0x1f4cb, // 📋
  0x21c4, // ⇄ (rendered via SYMBOL_SVGS, not a font)
  0x1f4ca, // 📊
  0x1f4c8, // 📈
  0x1f517, // 🔗
])

// Non-ASCII codepoints that appear in CARD TEXT (tool names/descriptions + the
// static card chrome), as opposed to icons. The "JSON ↔ YAML" tool name uses
// U+2194 and the subtitle bullets use U+00B7 — both verified PRESENT in Inter
// (Task 1 cmap check). The coverage test asserts every non-ASCII codepoint in
// card text is in this set, so a future tool name with an exotic glyph fails CI
// instead of silently rendering a tofu box in a 64px headline.
export const SUPPORTED_TEXT_CODEPOINTS: ReadonlySet<number> = new Set<number>([
  0x00b7, // · MIDDLE DOT (subtitle bullets)
  0x2194, // ↔ LEFT RIGHT ARROW (in the "JSON ↔ YAML" tool name)
])

// Graphemes satori routes to the 'symbol' bucket that are missing from BOTH
// Inter and Noto Emoji. Each maps to a monochrome SVG data-URI satori renders
// in place of the glyph. Currently only ⇄ (U+21C4, the JSON↔YAML icon).
const SYMBOL_SVGS: Record<string, string> = {
  '⇄':
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
        'stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 9h15M14 5l4 4-4 4M21 15H6M10 11l-4 4 4 4"/></svg>',
    ),
}

// The generators build plain satori element trees as object literals. satori's
// TS types declare its first arg as ReactNode, which a bare object literal isn't
// assignable to — so accept the trees as `unknown` here and assert satori's own
// parameter type at the single call site below. One honest cast, one location.
type SatoriNode = Parameters<typeof satori>[0]

// Shared satori → PNG pipeline. Each generator below owns its own child tree
// (preserved exactly to keep PNG output byte-for-byte the same); this helper
// only collapses the identical width/height/fonts/Resvg invocation.
async function renderToPng(
  rootNode: unknown,
  fonts: FontEntry[],
  emojiFont: FontEntry | null,
) {
  const svg = await satori(rootNode as SatoriNode, {
    width: 1200,
    height: 630,
    fonts,
    // satori segments icons into 'emoji' and 'symbol' buckets:
    //  - 'emoji' (🔗 📊 ⚡ 👁 🔄 📋 📈) -> the monochrome Noto Emoji font;
    //  - 'symbol' segment ⇄ (in neither font) -> an inline monochrome SVG.
    // ✓ ↑ ↓ are in Inter and never reach this callback.
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === 'emoji' && emojiFont) return [emojiFont]
      if (SYMBOL_SVGS[segment]) return SYMBOL_SVGS[segment]
      return []
    },
  })
  const resvg = new Resvg(svg, { fitTo: { mode: 'width' as const, value: 1200 } })
  return resvg.render().asPng()
}

async function generateOgImage(
  tool: (typeof tools)[number],
  fonts: FontEntry[],
  emojiFont: FontEntry | null,
) {
  return renderToPng(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#faf8f5',
          padding: '80px',
          position: 'relative',
        },
        children: [
          // Tool icon
          {
            type: 'div',
            props: {
              style: {
                fontSize: '48px',
                marginBottom: '24px',
              },
              children: tool.icon,
            },
          },
          // Tool name
          {
            type: 'div',
            props: {
              style: {
                fontSize: '64px',
                fontWeight: 700,
                color: '#1b3139',
                marginBottom: '16px',
                lineHeight: 1.1,
              },
              children: tool.name,
            },
          },
          // Description
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                color: '#5a6f77',
                marginBottom: '32px',
              },
              children: tool.description,
            },
          },
          // Subtitle
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#8fa8b3',
              },
              children: 'Free · Open Source · Client-side',
            },
          },
          // Bottom accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '6px',
                backgroundColor: '#ff3621',
              },
            },
          },
          // Branding
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '32px',
                right: '80px',
                fontSize: '24px',
                color: '#8fa8b3',
                fontWeight: 600,
              },
              children: 'Jamdesk Utilities',
            },
          },
        ],
      },
    },
    fonts,
    emojiFont,
  )
}

// Additional non-tool pages that want their own OG image. Each entry produces
// public/og/<slug>.png. Keep the layout-side OG_IMAGE references in sync.
const contentPages = [
  {
    slug: 'mdx-cheatsheet',
    name: 'MDX Cheatsheet',
    description: 'Syntax reference with copy-paste examples',
  },
  {
    slug: 'mdx-vs-markdown',
    name: 'MDX vs Markdown',
    description: 'Differences, trade-offs, and a decision tree',
  },
] as const

async function generateContentPageImage(
  page: (typeof contentPages)[number],
  fonts: FontEntry[],
  emojiFont: FontEntry | null,
) {
  return renderToPng(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#faf8f5',
          padding: '80px',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: '64px',
                fontWeight: 700,
                color: '#1b3139',
                marginBottom: '16px',
                lineHeight: 1.1,
              },
              children: page.name,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                color: '#5a6f77',
                marginBottom: '32px',
              },
              children: page.description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#8fa8b3',
              },
              children: 'Free · Open Source · Client-side',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '6px',
                backgroundColor: '#ff3621',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '32px',
                right: '80px',
                fontSize: '24px',
                color: '#8fa8b3',
                fontWeight: 600,
              },
              children: 'Jamdesk Utilities',
            },
          },
        ],
      },
    },
    fonts,
    emojiFont,
  )
}

async function generateHubImage(fonts: FontEntry[], emojiFont: FontEntry | null) {
  return renderToPng(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#faf8f5',
          padding: '80px',
          position: 'relative',
          textAlign: 'center',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: '64px',
                fontWeight: 700,
                color: '#1b3139',
                marginBottom: '16px',
                lineHeight: 1.1,
              },
              children: 'Developer Utilities',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                color: '#5a6f77',
                marginBottom: '32px',
              },
              children: 'Free, open source documentation tools',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#8fa8b3',
              },
              children: 'Format · Validate · Preview · Convert',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '6px',
                backgroundColor: '#ff3621',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '32px',
                right: '80px',
                fontSize: '24px',
                color: '#8fa8b3',
                fontWeight: 600,
              },
              children: 'Jamdesk',
            },
          },
        ],
      },
    },
    fonts,
    emojiFont,
  )
}

// All slugs we expect to find a committed public/og/<slug>.png for.
export function expectedOgSlugs(): string[] {
  return [
    'hub',
    ...tools.map((t) => t.slug),
    ...contentPages.map((p) => p.slug),
  ]
}

async function main() {
  console.log('Generating OG images...')

  const fonts = loadInterFonts()
  const emojiFont = loadEmojiFont()

  // No text font at all — should never happen now that Inter is bundled, but
  // keep the safety net: don't fail the build, fall back to committed PNGs and
  // only warn loudly if a committed image is actually missing.
  if (!fonts) {
    const missing = expectedOgSlugs().filter(
      (slug) => !existsSync(join(outDir, `${slug}.png`)),
    )
    if (missing.length === 0) {
      console.log(
        'ℹ No bundled or system font available — keeping the committed ' +
          'public/og/*.png. Regenerate with a font present: npx tsx scripts/generate-og.ts',
      )
      return
    }
    console.warn('========================================')
    console.warn(
      `⚠ No font available AND committed OG image(s) missing: ${missing.join(', ')}`,
    )
    console.warn(
      '  Those pages will ship with no OG image. Run: npx tsx scripts/generate-og.ts',
    )
    console.warn('========================================')
    return
  }

  if (!emojiFont) {
    console.warn('⚠ Noto Emoji font not found — tool icons will render as tofu boxes.')
  }

  // Create the output dir here (moved out of module scope so importing this
  // module from a test has no filesystem side effect).
  mkdirSync(outDir, { recursive: true })

  const hubPng = await generateHubImage(fonts, emojiFont)
  writeFileSync(join(outDir, 'hub.png'), hubPng)
  console.log('  Generated: public/og/hub.png')

  for (const tool of tools) {
    const png = await generateOgImage(tool, fonts, emojiFont)
    writeFileSync(join(outDir, `${tool.slug}.png`), png)
    console.log(`  Generated: public/og/${tool.slug}.png`)
  }

  for (const page of contentPages) {
    const png = await generateContentPageImage(page, fonts, emojiFont)
    writeFileSync(join(outDir, `${page.slug}.png`), png)
    console.log(`  Generated: public/og/${page.slug}.png`)
  }

  console.log(`Done. ${tools.length + 1 + contentPages.length} OG images generated.`)
}

// Run generation only when executed directly (postbuild / CLI), never when
// imported by a test. realpathSync canonicalizes symlinks on BOTH sides so a
// symlinked path can't make a direct run look like an import (which would
// silently skip generation and ship stale images).
function isDirectRun(): boolean {
  if (!process.argv[1]) return false
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isDirectRun()) {
  main().catch((err) => {
    console.error('========================================')
    console.error('!!! OG image generation crashed unexpectedly')
    console.error(err?.stack || err?.message || err)
    console.error('public/og/*.png were not regenerated this run.')
    console.error('Reproduce: npx tsx scripts/generate-og.ts')
    console.error('========================================')
  })
}
