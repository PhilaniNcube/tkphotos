import * as React from "react";
import type { Metadata } from "next";
import { getAllCollections } from "@/lib/queries/collections";
import { getGalleriesPaginated } from "@/lib/queries/galleries";
import { GalleriesBrowser } from "./_components/galleries-browser";
import { GalleriesProvider } from "./_components/galleries-provider";

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
  const collectionParam = Array.isArray(resolved.collection)
    ? resolved.collection[0]
    : resolved.collection;

  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const collectionSlug = collectionParam?.trim() || "all";

  const [galleriesResult, collectionsResult] = await Promise.all([
    getGalleriesPaginated({
      page,
      pageSize: 12,
      publicOnly: true,
      collectionSlug,
      includeMeta: true,
      orderBy: "created_at",
      ascending: false,
    }),
    getAllCollections({ orderBy: "name", ascending: true }),
  ]);

  return (
    <GalleriesProvider>
      <GalleriesBrowser
        initialData={galleriesResult.data}
        initialTotal={galleriesResult.total}
        initialPage={page}
        initialPageCount={galleriesResult.pageCount}
        initialCollection={collectionSlug}
        collections={collectionsResult.data}
      />
    </GalleriesProvider>
  );
}
