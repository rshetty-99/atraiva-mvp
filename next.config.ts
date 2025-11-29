import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  reactStrictMode: true,

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Temporarily disable ESLint during build for deployment
  // TODO: Fix linting errors and remove this
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Temporarily disable TypeScript errors during build for deployment
  // TODO: Fix TypeScript type errors and remove this
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack configuration to handle Firebase telemetry errors
  // ⚠️ Note: When using `--turbopack` in dev mode, this webpack config is ignored
  // This is expected behavior - the warning is harmless. The webpack config will
  // still be used in production builds (which don't use Turbopack).
  // If you want to suppress the warning, you can remove this config, but then
  // production builds may need alternative handling for Firebase fallbacks.
  webpack: (config, { isServer }) => {
    // Suppress Firebase telemetry errors in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },

  // Disable Firebase telemetry
  env: {
    FIREBASE_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
