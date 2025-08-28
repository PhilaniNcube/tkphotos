import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    qualities: [50, 70, 80, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ooxvvuililixounsknpj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "uadq23xeqd.ufs.sh",
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
