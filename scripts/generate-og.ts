/**
 * Build-time OG image generation.
 * Generates 1200x630 PNG per tool using Satori + @resvg/resvg-js.
 *
 * Usage: tsx scripts/generate-og.ts
 * Runs automatically via postbuild script.
 */

import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tools as toolRegistry } from '../lib/tools'

// Project to the subset the OG generator needs. Relative import (not the @/
// alias) so tsx can resolve without a tsconfig path-aliases pass.
const tools = toolRegistry.map((t) => ({
  slug: t.slug,
  name: t.name,
  description: t.description,
  icon: t.icon,
}))

const outDir = join(process.cwd(), 'public', 'og')
mkdirSync(outDir, { recursive: true })

// Load a system font for rendering — needs a .ttf file (not .ttc).
// Returns null when no font is available rather than throwing: that's the
// expected case on Vercel's Amazon Linux build image (ships none of these
// paths), where the committed public/og/*.png are authoritative instead.
function loadFont(): ArrayBuffer | null {
  // Try common system font paths (TTF only — TTC not supported by opentype.js)
  const candidates = [
    '/Library/Fonts/Arial Unicode.ttf',
    '/System/Library/Fonts/SFNS.ttf',
    '/System/Library/Fonts/Geneva.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    'C:\\Windows\\Fonts\\arial.ttf',
  ]

  for (const path of candidates) {
    try {
      const buf = readFileSync(path)
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    } catch {
      // Try next candidate
    }
  }

  return null
}

// Shared satori → PNG pipeline. Each generator below owns its own child tree
// (preserved exactly to keep PNG output byte-for-byte the same); this helper
// only collapses the identical width/height/fonts/Resvg invocation.
async function renderToPng(
  rootNode: Parameters<typeof satori>[0],
  fontData: ArrayBuffer,
) {
  const svg = await satori(rootNode, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'System', data: fontData, weight: 400, style: 'normal' as const },
      { name: 'System', data: fontData, weight: 700, style: 'normal' as const },
    ],
  })
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width' as const, value: 1200 },
  })
  return resvg.render().asPng()
}

async function generateOgImage(
  tool: (typeof tools)[number],
  fontData: ArrayBuffer
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
    fontData,
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
  fontData: ArrayBuffer,
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
    fontData,
  )
}

async function generateHubImage(fontData: ArrayBuffer) {
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
    fontData,
  )
}

// All slugs we expect to find a committed public/og/<slug>.png for.
function expectedOgSlugs(): string[] {
  return [
    'hub',
    ...tools.map((t) => t.slug),
    ...contentPages.map((p) => p.slug),
  ]
}

async function main() {
  console.log('Generating OG images...')

  const fontData = loadFont()

  // No system font — expected on Vercel's Amazon Linux builder. The committed
  // public/og/*.png are the deliverable there (see .gitignore), so skip
  // regeneration cleanly. But still flag loudly if a committed image is
  // actually missing, since that page would otherwise ship with no OG image —
  // a real problem the previous "always FAILED" handler couldn't distinguish.
  if (!fontData) {
    const missing = expectedOgSlugs().filter(
      (slug) => !existsSync(join(outDir, `${slug}.png`)),
    )
    if (missing.length === 0) {
      console.log(
        'ℹ No system TTF font on this build image — keeping the committed ' +
          'public/og/*.png. After changing a tool name/description, regenerate ' +
          'locally with: npx tsx scripts/generate-og.ts',
      )
      return
    }
    console.warn('========================================')
    console.warn(
      `⚠ No system font AND committed OG image(s) missing: ${missing.join(', ')}`,
    )
    console.warn(
      '  Those pages will ship with no OG image. Regenerate on a machine with ' +
        'a TTF font (e.g. macOS): npx tsx scripts/generate-og.ts',
    )
    console.warn('========================================')
    return
  }

  // Generate hub image
  const hubPng = await generateHubImage(fontData)
  writeFileSync(join(outDir, 'hub.png'), hubPng)
  console.log('  Generated: public/og/hub.png')

  // Generate per-tool images
  for (const tool of tools) {
    const png = await generateOgImage(tool, fontData)
    writeFileSync(join(outDir, `${tool.slug}.png`), png)
    console.log(`  Generated: public/og/${tool.slug}.png`)
  }

  // Generate per-content-page images (mdx-cheatsheet, mdx-vs-markdown)
  for (const page of contentPages) {
    const png = await generateContentPageImage(page, fontData)
    writeFileSync(join(outDir, `${page.slug}.png`), png)
    console.log(`  Generated: public/og/${page.slug}.png`)
  }

  console.log(`Done. ${tools.length + 1 + contentPages.length} OG images generated.`)
}

main().catch((err) => {
  // We deliberately don't fail the build — Vercel builders may not ship the
  // TTF fonts we probe for, and OG images are non-critical for first paint.
  // But surface the failure loudly enough that someone reads it in build logs.
  console.error('========================================')
  console.error('!!! OG image generation FAILED')
  console.error(err?.stack || err?.message || err)
  console.error('public/og/*.png will not be regenerated this build.')
  console.error('Reproduce locally: npx tsx scripts/generate-og.ts')
  console.error('========================================')
})
