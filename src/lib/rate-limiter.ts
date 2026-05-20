import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim() || "";
let redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || "";

// Automatically sanitize if the user accidentally pasted the variable name or quotes into the Vercel dashboard
if (redisUrl) {
  redisUrl = redisUrl.replace(/^['"]|['"]$/g, "");
  if (redisUrl.startsWith("UPSTASH_REDIS_REST_URL=")) {
    redisUrl = redisUrl.substring("UPSTASH_REDIS_REST_URL=".length).replace(/^['"]|['"]$/g, "");
  }
}

if (redisToken) {
  redisToken = redisToken.replace(/^['"]|['"]$/g, "");
  if (redisToken.startsWith("UPSTASH_REDIS_REST_TOKEN=")) {
    redisToken = redisToken.substring("UPSTASH_REDIS_REST_TOKEN=".length).replace(/^['"]|['"]$/g, "");
  }
}

let redis: Redis | null = null;
let loginRateLimiter: Ratelimit | null = null;
let forgotPasswordRateLimiter: Ratelimit | null = null;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  loginRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 attempts per 10 minutes
    analytics: true,
    prefix: "ratelimit:login",
  });

  forgotPasswordRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 attempts per 10 minutes
    analytics: true,
    prefix: "ratelimit:forgot-password",
  });
}

export async function isRateLimited(ip: string, action: "login" | "forgot-password"): Promise<boolean> {
  // If Upstash config is missing, default to allowing requests (prevents crash on local runs without Redis)
  if (!redis) {
    console.warn(`Upstash Redis credentials are not configured. Rate limiting for ${action} is bypassed.`);
    return false;
  }

  const limiter = action === "login" ? loginRateLimiter : forgotPasswordRateLimiter;
  if (!limiter) return false;

  try {
    const { success } = await limiter.limit(ip);
    return !success;
  } catch (error) {
    console.error("Rate limiter error: ", error);
    // Fail open if Redis is down, ensuring core user authentication is not blocked
    return false;
  }
}
