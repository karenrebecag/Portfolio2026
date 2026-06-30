'use client'

import { useEffect } from 'react'

/** Last-resort boundary for errors in the root layout itself. Renders its own
 *  html/body — globals.css, fonts, providers and i18n are not available here,
 *  so styles are inline (Night-theme palette) and copy is English-only. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          background: '#0c0e0a',
          color: '#ECDFCC',
          fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#697565',
            margin: '0 0 20px',
          }}
        >
          Error
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 6vw, 52px)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
            maxWidth: '18ch',
          }}
        >
          Something broke on our side
        </h1>
        <p style={{ fontSize: '17px', opacity: 0.7, margin: '0 0 32px', maxWidth: '44ch', lineHeight: 1.5 }}>
          An unexpected error got in the way. Let&rsquo;s try that again.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              background: '#5FA28F',
              border: '1px solid #5FA28F',
              color: '#0c0e0a',
              padding: '11px 24px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '999px',
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              background: 'transparent',
              border: '1px solid rgba(236, 223, 204, 0.3)',
              color: '#ECDFCC',
              padding: '11px 24px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '999px',
            }}
          >
            Back home
          </a>
        </div>
      </body>
    </html>
  )
}
