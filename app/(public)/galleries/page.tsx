import React from "react";
import type { Metadata } from "next";
import { getGalleriesPaginated } from "@/lib/queries/galleries";
import { PublicGalleriesGrid } from "./_components/public-galleries-grid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
    <div className="mx-auto w-full max-w-7xl px-4 py-12 space-y-10">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide">
          Galleries
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Browse a curated selection of public event galleries.
        </p>
      </header>
      <PublicGalleriesGrid galleries={data} />
      {pageCount > 1 && (
        <Pagination className="pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  {
                    pathname: "/galleries",
                    query: { page: Math.max(1, page - 1) },
                  } as any
                }
                aria-disabled={page === 1}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter((p) => {
                if (p === 1 || p === pageCount) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce<number[]>((acc, p) => {
                if (acc.length === 0) return [p];
                const prev = acc[acc.length - 1];
                if (p - prev === 1) return [...acc, p];
                return [...acc, -1, p];
              }, [])
              .map((p, idx) => {
                if (p === -1)
                  return (
                    <PaginationItem key={`e-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href={
                        { pathname: "/galleries", query: { page: p } } as any
                      }
                      isActive={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            <PaginationItem>
              <PaginationNext
                href={
                  {
                    pathname: "/galleries",
                    query: { page: Math.min(pageCount, page + 1) },
                  } as any
                }
                aria-disabled={!hasMore}
                className={
                  !hasMore ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {pageCount <= 1 && (
        <div className="text-center text-xs text-muted-foreground">
          No more pages
        </div>
      )}
    </div>
  );
}
