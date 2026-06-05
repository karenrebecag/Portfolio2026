let fontsReadyPromise: Promise<void> | null = null

/** Resolves once document fonts are ready; cached for the session. */
export function whenFontsReady(): Promise<void> {
  if (fontsReadyPromise) return fontsReadyPromise
  if (typeof document !== 'undefined' && document.fonts?.status === 'loaded') {
    fontsReadyPromise = Promise.resolve()
    return fontsReadyPromise
  }
  fontsReadyPromise = document.fonts.ready.then(() => undefined)
  return fontsReadyPromise
}