import type {
  GetGalleriesOptions,
  PaginatedResult,
  GalleryRow,
} from "@/lib/queries/galleries";

export async function getGalleriesPaginatedClient(
  opts: GetGalleriesOptions = {}
): Promise<PaginatedResult<GalleryRow>> {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.pageSize) params.set("pageSize", String(opts.pageSize));
  if (opts.publicOnly) params.set("publicOnly", "true");
  if (opts.collectionSlug && opts.collectionSlug !== "all") {
    params.set("collection", opts.collectionSlug);
  }
  if (opts.includeMeta) params.set("includeMeta", "true");
  if (opts.orderBy) params.set("orderBy", opts.orderBy);
  if (typeof opts.ascending === "boolean") {
    params.set("ascending", String(opts.ascending));
  }
  if (opts.search?.trim()) params.set("search", opts.search.trim());

  try {
    const response = await fetch(`/api/content/galleries?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return (await response.json()) as PaginatedResult<GalleryRow>;
  } catch (error) {
    console.error("getGalleriesPaginatedClient error:", error);
    const page = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    return {
      data: [],
      page,
      pageSize,
      total: 0,
      pageCount: 0,
      hasMore: false,
      error: error instanceof Error ? error.message : "Failed to load galleries",
    };
  }
}
