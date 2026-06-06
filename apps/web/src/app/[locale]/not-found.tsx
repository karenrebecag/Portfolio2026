/** Rendered for notFound() inside localized routes (e.g. an unknown article). */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="font-accent text-xs uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-foreground/70">
        This page doesn&rsquo;t exist or has moved.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 font-accent text-sm uppercase tracking-wide underline underline-offset-4 transition-colors hover:text-plantation"
      >
        Back home &rarr;
      </a>
    </main>
  )
}
