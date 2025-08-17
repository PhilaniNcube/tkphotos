import React from "react";
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
