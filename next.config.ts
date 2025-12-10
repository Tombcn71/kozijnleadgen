import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Exclude bin and scripts folders from compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude certain paths from being processed
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
