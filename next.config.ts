import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [70, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ooxvvuililixounsknpj.supabase.co",
      },
    ],
  },
  // Disable lint and type errors from failing production builds (requested)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
