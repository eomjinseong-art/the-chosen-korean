import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // content/the-chosen-guide.md is read at build time by lib/guide.ts
  outputFileTracingIncludes: { "/**": ["./content/**"] },
};

export default nextConfig;
