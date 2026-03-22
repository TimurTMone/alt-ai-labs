import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Alt AI Labs — Learn AI by building real products'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0c',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 800,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #34d399, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 900,
              color: 'white',
            }}
          >
            AI
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: -0.5 }}>
            Alt AI Labs
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 800, color: 'white', letterSpacing: -2, lineHeight: 1.1 }}>
            Stop learning AI.
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.1,
              background: 'linear-gradient(90deg, #34d399, #6ee7b7, #2dd4bf)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Start shipping it.
          </span>
        </div>

        {/* Subline */}
        <p style={{ fontSize: 22, color: '#a3a3a3', marginTop: 32, letterSpacing: -0.3 }}>
          Weekly AI projects · Video lessons · Build challenges · Cash prizes
        </p>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 40,
            fontSize: 16,
            color: '#737373',
          }}
        >
          <span>
            <span style={{ color: 'white', fontWeight: 600 }}>127+</span> builders
          </span>
          <span>
            <span style={{ color: 'white', fontWeight: 600 }}>25+</span> builds shipped
          </span>
          <span>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>$4,250+</span> in prizes
          </span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 14,
            color: '#525252',
          }}
        >
          alt-ai-labs.vercel.app · Join free
        </div>
      </div>
    ),
    { ...size }
  )
}
