import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Public_Sans, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import { AnalyticsProvider } from "@/components/analytics-provider";
import { AppToaster } from "@/components/ui-sdk/app-toaster";
import { getAllCollections } from "@/lib/queries/collections";
import { getGalleriesPaginated } from "@/lib/queries/galleries";
import { getCurrentUser } from "@/lib/queries/user";
import { MobileBottomNav } from "./_components/mobile-bottom-nav";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import "../globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "TK Photos | Eastern Cape Photographer",
    template: "%s | TK Photos",
  },
  description:
    "Professional photography & media services by Thandikaya Matokazi: events, families, sports, conferences, videography & media management in the Eastern Cape.",
  keywords: [
    "Eastern Cape photographer",
    "South Africa photography",
    "event photography",
    "family portraits",
    "sports photographer",
    "conference photography",
    "videography",
  ],
  authors: [{ name: "Thandikaya Matokazi" }],
  creator: "Thandikaya Matokazi",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "TK Photos",
    title: "TK Photos | Eastern Cape Photographer",
    description:
      "Professional photography & media services: events, families, sports, conferences, videography & media management.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TK Photos portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@",
    creator: "@",
    title: "TK Photos | Eastern Cape Photographer",
    description:
      "Professional photography & media services: events, families, sports, conferences, videography & media management.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  category: "Photography",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, galleriesResult, collectionsResult] = await Promise.all([
    getCurrentUser(),
    getGalleriesPaginated({
      page: 1,
      pageSize: 6,
      publicOnly: true,
      orderBy: "created_at",
      ascending: false,
    }),
    getAllCollections({
      orderBy: "created_at",
      ascending: false,
      limit: 8,
    }),
  ]);

  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <AnalyticsProvider>
          <div className="flex min-h-screen flex-col bg-surface text-on-surface">
            <Link
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary focus:shadow-lg"
            >
              Skip to content
            </Link>
            <SiteHeader
              userData={userData}
              navGalleries={galleriesResult.data}
              navCollections={collectionsResult.data}
            />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <MobileBottomNav />
            <AppToaster />
          </div>
        </AnalyticsProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
