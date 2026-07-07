import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Onboarding form uploads a single logo image; 1MB default is too small.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
