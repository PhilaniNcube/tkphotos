import { getGalleriesCursorPage } from "../../../../lib/queries/galleries";
import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import Link from "next/link";
import { GalleryFilters } from "./_components/gallery-filters";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Configure server-side parsing of query params.
// We fake cursor via two params: cursorCreatedAt + cursorId (because composite cursor object cannot be directly serialized nicely)
const searchParamsCache = createSearchParamsCache({
  limit: parseAsInteger.withDefault(20).withOptions({ shallow: false }),
});

// Next.js 15 makes searchParams async (a Promise). Support both sync & async for forward/backward compatibility.
interface PageProps {
  searchParams:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardGalleriesPage({
  searchParams,
}: PageProps) {
  // Resolve async searchParams if running on Next.js 15+, otherwise use directly.
  const resolvedParams =
    (searchParams as any)?.then &&
    typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<
          Record<string, string | string[] | undefined>
        >)
      : (searchParams as Record<string, string | string[] | undefined>);

  const { limit } = searchParamsCache.parse(resolvedParams);

  const rawSearch =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;
  const search =
    rawSearch && rawSearch.trim().length ? rawSearch.trim() : undefined;
  const cursorCreatedAt =
    typeof resolvedParams.cursorCreatedAt === "string"
      ? resolvedParams.cursorCreatedAt
      : undefined;
  const cursorIdStr =
    typeof resolvedParams.cursorId === "string"
      ? resolvedParams.cursorId
      : undefined;
  const cursorId = cursorIdStr ? Number(cursorIdStr) : undefined;
  const pageStr =
    typeof resolvedParams.page === "string" ? resolvedParams.page : undefined;
  const page = pageStr ? Math.max(1, Number(pageStr) || 1) : 1;

  const { data, nextCursor, error } = await getGalleriesCursorPage({
    limit,
    search: search || undefined,
    cursor:
      cursorCreatedAt && cursorId
        ? { created_at: cursorCreatedAt, id: cursorId }
        : undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Galleries</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Page {page}</span>
          <Link
            href={{ pathname: "/dashboard/galleries", query: { limit } }}
            className="hover:underline"
          >
            Reset
          </Link>
          <Link
            href={{
              pathname: "/dashboard/galleries",
              query: { limit, search: search || undefined },
            }}
            className="hover:underline"
          >
            Refresh
          </Link>
        </div>
      </div>
      <GalleryFilters limit={limit} search={search} />
      {error && (
        <div className="text-sm text-red-600">Failed to load: {error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((g) => {
          const href = `/dashboard/galleries/${g.id}`;
          return (
            <Link
              key={g.id}
              href={href}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="h-full transition-colors hover:border-ring/60">
                <CardHeader className="pb-3">
                  <CardTitle className="" title={g.title}>
                    {g.title}
                  </CardTitle>
                  {g.description && (
                    <CardDescription className="line-clamp-2">
                      {g.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0 pb-4 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{new Date(g.created_at).toLocaleDateString()}</span>
                    <span
                      className={
                        g.is_public
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {g.is_public ? "Public" : "Private"}
                    </span>
                  </div>
                  {g.event_date && (
                    <div className="flex items-center justify-between">
                      <span className="opacity-70">Event</span>
                      <span>{g.event_date}</span>
                    </div>
                  )}
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
      <div className="flex items-center gap-4">
        {nextCursor ? (
          <Link
            href={{
              pathname: "/dashboard/galleries",
              query: {
                limit,
                search: search || undefined,
                cursorCreatedAt: nextCursor.created_at,
                cursorId: nextCursor.id,
                page: page + 1,
              },
            }}
            className="border rounded px-4 py-2 text-sm"
          >
            Next Page →
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">End of results</span>
        )}
      </div>
    </div>
  );
}
