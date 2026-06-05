import { ImageResponse } from 'next/og'

export const alt = 'Karen Rebeca Ortiz — Product Engineer, Design Systems & AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand palette (Plantation light theme)
const BG = '#fdf9ed'
const FG = '#11221f'
const ACCENT = '#366B5E'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          color: FG,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, backgroundColor: ACCENT }} />
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            karenrebecaortiz.com
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            Karen Rebeca Ortiz
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: ACCENT, lineHeight: 1.1 }}>
            Product Engineer · Design Systems · AI
          </div>
        </div>

        <div style={{ fontSize: 28, fontWeight: 500, color: FG, opacity: 0.7 }}>
          From architecture to the last pixel.
        </div>
      </div>
    ),
    { ...size },
  )
}
