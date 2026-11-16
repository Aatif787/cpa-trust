/**
 * Abuse protection rate-limiter abstraction for contact form submissions.
 *
 * LIMITATION ON MULTI-INSTANCE DEPLOYMENTS:
 * The default `InMemoryRateLimiter` tracks counters inside the current Node.js
 * process memory only. It is NOT shared across multiple worker processes,
 * clustered containers, load-balanced instances, or process restarts.
 * If Santosh Arora Trust scales across multiple workers/instances or moves
 * behind a cluster on Hostinger Cloud Hosting, pass a shared store (e.g.
 * Redis-backed implementation of `RateLimiter`) and/or enable edge WAF rules.
 */

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  consume(key: string): Promise<RateLimitResult>;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export interface InMemoryRateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  maxEntries?: number;
  now?: () => number;
}

const DEFAULT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_MAX_ENTRIES = 2000;

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly maxEntries: number;
  private readonly now: () => number;

  constructor(options: InMemoryRateLimiterOptions = {}) {
    this.windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
    this.maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;
    this.maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
    this.now = options.now ?? (() => Date.now());
  }

  async consume(key: string): Promise<RateLimitResult> {
    const timestamp = this.now();
    this.pruneExpired(timestamp);

    const normalizedKey = key.trim() || "unknown";
    const existing = this.buckets.get(normalizedKey);

    if (!existing || existing.resetAt <= timestamp) {
      if (this.buckets.size >= this.maxEntries) {
        const oldestKey = this.buckets.keys().next().value;
        if (oldestKey !== undefined) {
          this.buckets.delete(oldestKey);
        }
      }

      this.buckets.set(normalizedKey, {
        count: 1,
        resetAt: timestamp + this.windowMs,
      });

      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (existing.count >= this.maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.resetAt - timestamp) / 1000)
      );
      return { allowed: false, retryAfterSeconds };
    }

    existing.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private pruneExpired(timestamp: number): void {
    for (const [entryKey, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= timestamp) {
        this.buckets.delete(entryKey);
      }
    }
  }
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function createDefaultRateLimiter(): RateLimiter {
  return new InMemoryRateLimiter();
}
