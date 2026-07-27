import 'server-only';
import { headers } from 'next/headers';

import { TooManyRequestsError } from '@/app/lib/server/errors/httpErrors';

type Bucket = { count: number; resetAt: number };

// Simple in-process fixed-window limiter. Good enough as a basic guard
// against brute-force/spam on a single-instance deployment; swap for a
// shared store (Redis/Upstash) if the app ever runs multiple instances.
const buckets = new Map<string, Bucket>();

const SWEEP_THRESHOLD = 5000;

function sweepExpired(now: number) {
  if (buckets.size < SWEEP_THRESHOLD) return;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Throws TooManyRequestsError once `limit` calls for `key` have been made
 * within the current `windowMs` window.
 */
export function assertRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new TooManyRequestsError('Забагато спроб. Спробуйте пізніше.');
  }

  bucket.count += 1;
}

/** Best-effort client IP from standard proxy headers; falls back to a
 * constant so rate limiting still applies (shared bucket) if unavailable. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  return h.get('x-real-ip') ?? 'unknown';
}
