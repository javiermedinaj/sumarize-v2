import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 15.5+: rateLimit is a top-level key, not under experimental.
  // 10 requests per minute per IP is enough for human use and
  // protects the free Groq tier from abuse.
  rateLimit: {
    api: {
      max: 10,
      interval: 60_000, // 1 minute
    },
  },
};

export default nextConfig;
