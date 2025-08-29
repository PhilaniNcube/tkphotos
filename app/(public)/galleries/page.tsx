import React from "react";
import type { Metadata } from "next";
import { getGalleriesPaginated } from "@/lib/queries/galleries";
import { GalleriesProvider } from "./_components/galleries-provider";
import { GalleriesClient } from "./_components/galleries-client";

export const metadata: Metadata = {
  title: "Photo Galleries | TK Media",
  description:
    "Browse our professional photography galleries featuring events, family portraits, sports, and corporate photography by Thandikaya Matokazi.",
  keywords: [
    "photo galleries",
    "photography portfolio",
    "event photography gallery",
    "family portrait gallery",
    "sports photography",
    "Eastern Cape photographer",
    "professional photos",
  ],
  openGraph: {
    title: "Photo Galleries | TK Media",
    description:
      "Browse our professional photography galleries featuring events, family portraits, sports, and corporate photography.",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 799,
        height: 604,
        alt: "TK Media Photography Galleries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Galleries | TK Media",
    description:
      "Browse our professional photography galleries featuring events, family portraits, sports, and corporate photography.",
    images: ["/logo.webp"],
  },
  alternates: {
    canonical: "/galleries",
  },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PublicGalleriesPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const pageParam = Array.isArray(resolved.page)
    ? resolved.page[0]
    : resolved.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const pageSize = 24; // fixed for public page for now

  const { data, pageCount, hasMore } = await getGalleriesPaginated({
    page,
    pageSize,
    publicOnly: true,
    orderBy: "created_at",
    ascending: false,
  });

  return (
    <GalleriesProvider>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide">
            Galleries
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Browse a curated selection of public event galleries.
          </p>
        </header>
        <GalleriesClient
          initialData={data}
          initialPage={page}
          initialPageCount={pageCount}
          initialHasMore={hasMore}
        />
      </div>
    </GalleriesProvider>
  );
}
