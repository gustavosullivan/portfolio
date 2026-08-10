/** Shared contact helpers — rate limit + origin checks. */

const MIN_GAP_MS = 45_000; // 45s between sends per IP
const WINDOW_MS = 15 * 60_000; // 15 min
const MAX_IN_WINDOW = 3; // max 3 emails / 15 min / IP

type Bucket = {
  timestamps: number[];
  lastAt: number;
};

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 2_000) return;
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastAt > WINDOW_MS * 2) buckets.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number; reason: "too_fast" | "too_many" };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(ip) ?? { timestamps: [], lastAt: 0 };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.lastAt && now - bucket.lastAt < MIN_GAP_MS) {
    const retryAfterSec = Math.ceil((MIN_GAP_MS - (now - bucket.lastAt)) / 1000);
    return { ok: false, retryAfterSec, reason: "too_fast" };
  }

  if (bucket.timestamps.length >= MAX_IN_WINDOW) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    return { ok: false, retryAfterSec, reason: "too_many" };
  }

  bucket.timestamps.push(now);
  bucket.lastAt = now;
  buckets.set(ip, bucket);
  return { ok: true };
}

/** Soft check: block obvious cross-site script spam when Origin/Referer present. */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const candidate = origin || referer;
  if (!candidate) return true; // some clients omit; rate limit still applies

  try {
    const host = new URL(candidate).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host === "gudev.com.br" || host.endsWith(".gudev.com.br")) return true;
    if (host.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}
