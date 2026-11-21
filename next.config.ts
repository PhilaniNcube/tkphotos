import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  images: {
    qualities: [75],
    remotePatterns: [
      // Cloudflare R2 public bucket (migrated media + all new uploads)
      ...(r2PublicUrl
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(r2PublicUrl).hostname,
            },
          ]
        : []),
      // Kept temporarily so un-migrated UploadThing images keep rendering.
      {
        protocol: "https",
        hostname: "uadq23xeqd.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "ooxvvuililixounsknpj.supabase.co",
      },
    ],
  },
  // Disable type errors from failing production builds (requested)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Native/binary packages used by Payload must stay outside the bundle.
  serverExternalPackages: ["sharp", "@libsql/client", "libsql"],
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
};

export default withPayload(nextConfig);
