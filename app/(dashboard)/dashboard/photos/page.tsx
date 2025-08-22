import { getPhotosPaginated } from "@/lib/queries/photos";
import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { PhotosFilters } from "@/app/(dashboard)/dashboard/photos/_components/photos-filters";
import { PhotosGrid } from "@/app/(dashboard)/dashboard/photos/_components/photos-grid";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  pageSize: parseAsInteger.withDefault(40).withOptions({ shallow: false }),
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardPhotosPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { page, pageSize } = searchParamsCache.parse(resolvedParams);
  const rawSearch =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;
  const search =
    rawSearch && rawSearch.trim().length ? rawSearch.trim() : undefined;

  const { data, total, pageCount, hasMore, error } = await getPhotosPaginated({
    page,
    pageSize,
    search,
  });

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    params.set("pageSize", String(pageSize));
    if (search) params.set("search", search);
    return `/dashboard/photos?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Photos</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Page {page} / {pageCount || 1}
          </span>
          <span>{total} total</span>
          <Link
            href={{
              pathname: "/dashboard/photos",
              query: { page: 1, pageSize },
            }}
            className="hover:underline"
          >
            Reset
          </Link>
          <Link
            href={{
              pathname: "/dashboard/photos",
              query: { page, pageSize, search: search || undefined },
            }}
            className="hover:underline"
          >
            Refresh
          </Link>
        </div>
      </div>
      <PhotosFilters pageSize={pageSize} search={search} />
      {error && (
        <div className="text-sm text-red-600">Failed to load: {error}</div>
      )}
      <PhotosGrid photos={data} />
      {pageCount > 1 && (
        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={buildHref(Math.max(1, page - 1))}
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
                    <PaginationLink href={buildHref(p)} isActive={p === page}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            <PaginationItem>
              <PaginationNext
                href={buildHref(Math.min(pageCount, page + 1))}
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
        <div className="text-sm text-muted-foreground">No more pages</div>
      )}
    </div>
  );
}
