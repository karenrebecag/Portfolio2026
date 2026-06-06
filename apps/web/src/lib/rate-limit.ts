/**
 * Minimal in-memory sliding-window rate limiter (no infra).
 *
 * Best-effort on serverless: state lives in module scope, so it catches bursts
 * hitting a warm instance but isn't shared across instances. For hard limits use
 * a shared store (Upstash / Vercel KV). Pair it with the honeypot for bots.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = { ok: boolean; retryAfter: number }

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    pruneExpired(now)
    return { ok: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count++
  return { ok: true, retryAfter: 0 }
}

/** Keep the map bounded — drop expired buckets once it grows. */
function pruneExpired(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key)
  }
}

/** First public IP from Vercel's forwarding headers. */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
