/** Wraps a ScrollTrigger start/end string with GSAP clamp() when not already wrapped. */
export function clampScrollPosition(value: string, fallback = 'top 80%'): string {
  const v = (value || fallback).trim()
  if (!v) return `clamp(${fallback})`
  if (v.startsWith('clamp(')) return v
  return `clamp(${v})`
}