import { getRequestIP } from "@tanstack/react-start/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED = 5_000;

/**
 * Per-IP fixed-window limiter. State lives in one server instance's memory, so it slows
 * scripted abuse but is not a hard global cap — pair it with a WAF rule at the host.
 */
export function takeRateLimit(
  scope: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  const ip = clientIp();
  const key = `${scope}:${ip}`;
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED) pruneExpired(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

function clientIp(): string {
  try {
    return getRequestIP({ xForwardedFor: true })?.split(",")[0]?.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size >= MAX_TRACKED) buckets.clear();
}
