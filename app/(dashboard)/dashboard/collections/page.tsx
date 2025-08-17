import { getCollectionsPaginated } from "../../../../lib/queries/collections";
import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import Link from "next/link";
import { CollectionsFilters } from "./_components/collections-filters";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Server-side param parsing (offset pagination)
const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  pageSize: parseAsInteger.withDefault(20).withOptions({ shallow: false }),
});

interface PageProps {
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardCollectionsPage({
  searchParams,
}: PageProps) {
  const resolvedParams =
    (searchParams as any)?.then &&
    typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<
          Record<string, string | string[] | undefined>
        >)
      : (searchParams as Record<string, string | string[] | undefined>);

  const { page, pageSize } = searchParamsCache.parse(resolvedParams);
  const rawSearch =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;
  const search =
    rawSearch && rawSearch.trim().length ? rawSearch.trim() : undefined;

  const { data, total, pageCount, hasMore, error } =
    await getCollectionsPaginated({
      page,
      pageSize,
      search,
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Collections</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Page {page} / {pageCount || 1}
          </span>
          <span>{total} total</span>
          <Link
            href={{
              pathname: "/dashboard/collections",
              query: { page: 1, pageSize },
            }}
            className="hover:underline"
          >
            Reset
          </Link>
          <Link
            href={{
              pathname: "/dashboard/collections",
              query: { page, pageSize, search: search || undefined },
            }}
            className="hover:underline"
          >
            Refresh
          </Link>
        </div>
      </div>
      <CollectionsFilters pageSize={pageSize} search={search} />
      {error && (
        <div className="text-sm text-red-600">Failed to load: {error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((c) => {
          const href = `/dashboard/collections/${c.id}`;
          return (
            <Link
              key={c.id}
              href={href}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="h-full transition-colors hover:border-ring/60">
                <CardHeader className="pb-3">
                  <CardTitle className="" title={c.name}>
                    {c.name}
                  </CardTitle>
                  {c.description && (
                    <CardDescription className="line-clamp-2">
                      {c.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0 pb-4 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    <span className="opacity-70">ID {c.id}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-primary group-hover:underline">
                    Open →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
      {/* Pagination controls */}
      {pageCount > 1 && (
        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  {
                    pathname: "/dashboard/collections",
                    query: { page: Math.max(1, page - 1), pageSize, search },
                  } as any
                }
                aria-disabled={page === 1}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>
            {/* Page number logic: show first, last, current, neighbors */}
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
                return [...acc, -1, p]; // -1 sentinel for ellipsis
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
                        {
                          pathname: "/dashboard/collections",
                          query: { page: p, pageSize, search },
                        } as any
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
                    pathname: "/dashboard/collections",
                    query: {
                      page: Math.min(pageCount, page + 1),
                      pageSize,
                      search,
                    },
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
        <div className="text-sm text-muted-foreground">No more pages</div>
      )}
    </div>
  );
}
