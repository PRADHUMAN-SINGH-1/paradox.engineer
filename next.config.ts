import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  outputFileTracingIncludes: {
    '/**': ['./prisma/**/*'],
  },
};

export default nextConfig;
