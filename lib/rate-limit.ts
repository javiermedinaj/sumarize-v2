import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 10;
const WINDOW = "1 h";
let limiter: Ratelimit | null | undefined;

function getLimiter() {
  if (limiter !== undefined) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiter = null;
    return limiter;
  }

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
    analytics: true,
    prefix: "yt-estudio:process",
  });
  return limiter;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export async function limitProcessRequest(ip: string) {
  const rateLimiter = getLimiter();

  // Local development remains usable without an Upstash project. Production
  // fails closed so an unprotected Groq key is never deployed accidentally.
  if (!rateLimiter) {
    if (process.env.NODE_ENV === "production") {
      return { configured: false as const, success: false, limit: LIMIT, remaining: 0, reset: 0 };
    }
    return { configured: false as const, success: true, limit: LIMIT, remaining: LIMIT, reset: 0 };
  }

  const result = await rateLimiter.limit(ip);
  return { configured: true as const, ...result };
}
