import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// const cache = new Map(); // must be outside of your serverless function handler

export const ratelimit = new Ratelimit({
  redis,
  // allows 10 requests per 10 seconds
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  // ephemeralCache: cache,
});
