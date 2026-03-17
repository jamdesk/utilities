/**
 * Build-time OG image generation.
 * Generates 1200x630 PNG per tool using Satori + @resvg/resvg-js.
 *
 * Usage: tsx scripts/generate-og.ts
 * Runs automatically via postbuild script.
 */

import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'

// Import tools statically to avoid path alias issues in tsx
const tools = [
  {
    slug: 'mdx-formatter',
    name: 'MDX Formatter',
    description: 'Format and beautify MDX files',
    icon: '\u26A1',
  },
  {
    slug: 'mdx-validator',
    name: 'MDX Validator',
    description: 'Check MDX for syntax errors',
    icon: '\u2713',
  },
  {
    slug: 'mdx-viewer',
    name: 'MDX Viewer',
    description: 'Preview rendered MDX output',
    icon: '\uD83D\uDC41',
  },
  {
    slug: 'mdx-to-markdown',
    name: 'MDX to Markdown',
    description: 'Strip JSX, get clean Markdown',
    icon: '\u2193',
  },
]

const outDir = join(process.cwd(), 'public', 'og')
mkdirSync(outDir, { recursive: true })

// Load a system font for rendering — needs a .ttf file (not .ttc)
function loadFont(): ArrayBuffer {
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

  throw new Error(
    'No system font found. Install a TTF font or provide one explicitly.'
  )
}

async function generateOgImage(
  tool: (typeof tools)[number],
  fontData: ArrayBuffer
) {
  const svg = await satori(
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
              children: 'Free \u00B7 Open Source \u00B7 Client-side',
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
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'System',
          data: fontData,
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'System',
          data: fontData,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    }
  )

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width' as const, value: 1200 },
  })
  return resvg.render().asPng()
}

async function generateHubImage(fontData: ArrayBuffer) {
  const svg = await satori(
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
              children: 'MDX Utilities',
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
              children: 'Free, open source tools for MDX',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '20px',
                color: '#8fa8b3',
              },
              children: 'Format \u00B7 Validate \u00B7 Preview \u00B7 Convert',
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
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'System',
          data: fontData,
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'System',
          data: fontData,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    }
  )

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width' as const, value: 1200 },
  })
  return resvg.render().asPng()
}

async function main() {
  console.log('Generating OG images...')

  const fontData = loadFont()

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

  console.log(`Done. ${tools.length + 1} OG images generated.`)
}

main().catch((err) => {
  console.error('OG image generation failed:', err)
  process.exit(1)
})
