'use client'

import { useEffect } from 'react'

/** Last-resort boundary for errors in the root layout itself. Renders its own
 *  html/body — globals.css and providers are not available here, so styles are
 *  inline (Night-theme palette). */
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
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px' }}>
          Something went wrong
        </h1>
        <p style={{ opacity: 0.7, margin: '0 0 24px' }}>An unexpected error occurred.</p>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            border: '1px solid #ECDFCC',
            color: '#ECDFCC',
            padding: '10px 22px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '13px',
          }}
        >
          Reload
        </button>
      </body>
    </html>
  )
}
