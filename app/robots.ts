import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tkphotos.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/confirm",
          "/auth/error",
          "/auth/forgot-password",
          "/auth/sign-up-success",
          "/auth/update-password",
          "/protected/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
