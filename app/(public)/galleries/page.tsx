import * as React from "react";
import { Suspense } from "react";
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

export default function PublicGalleriesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<GalleriesPageFallback />}>
      <GalleriesPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function GalleriesPageContent({ searchParams }: PageProps) {
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

function GalleriesPageFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12">
      <div className="mb-8 h-9 w-52 animate-pulse rounded-lg bg-surface-container" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-container"
          />
        ))}
      </div>
    </div>
  );
}
