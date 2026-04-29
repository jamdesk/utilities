import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'MDX vs Markdown — When to Use Each'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f17 0%, #1a1a28 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: '-0.02em' }}>
          MDX vs Markdown
        </div>
        <div style={{ fontSize: 36, marginTop: 24, color: '#a0a0c0' }}>
          When to use each. A 2026 guide.
        </div>
        <div style={{ fontSize: 22, marginTop: 80, color: '#7a3ddb' }}>
          jamdesk.com/utilities
        </div>
      </div>
    ),
    size
  )
}
