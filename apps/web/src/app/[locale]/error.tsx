'use client'

import { useEffect } from 'react'

/** Catches runtime errors in localized pages. The wipe/providers stay mounted
 *  (this replaces the page, not the layout). */
export default function Error({
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="font-accent text-xs uppercase tracking-[0.2em] text-muted-foreground">Error</p>
      <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-foreground/70">
        An unexpected error occurred. Try again, or head back home.
      </p>
      <div className="mt-8 flex items-center gap-6">
        <button
          onClick={reset}
          className="font-accent text-sm uppercase tracking-wide underline underline-offset-4 transition-colors hover:text-plantation"
        >
          Try again
        </button>
        <a
          href="/"
          className="font-accent text-sm uppercase tracking-wide underline underline-offset-4 transition-colors hover:text-plantation"
        >
          Back home &rarr;
        </a>
      </div>
    </main>
  )
}
