import { createClient } from "../client";
import type {
  GetGalleriesOptions,
  PaginatedResult,
  GalleryRow,
} from "./galleries";

/**
 * Client-side version of getGalleriesPaginated for use in client components.
 * Uses the browser client instead of the server client.
 */
export async function getGalleriesPaginatedClient(
  opts: GetGalleriesOptions = {}
): Promise<PaginatedResult<GalleryRow>> {
  const supabase = createClient();

  const page = Math.max(1, opts.page ?? 1);
  const rawPageSize = opts.pageSize ?? 20;
  const pageSize = Math.min(Math.max(rawPageSize, 1), 100); // clamp 1..100
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("galleries")
    .select("*", { count: "exact" })
    .range(from, to);

  // Filtering
  if (opts.publicOnly) {
    query = query.eq("is_public", true);
  }

  if (opts.search?.trim()) {
    const search = `%${opts.search.trim()}%`;
    query = query.or(`title.ilike.${search},description.ilike.${search}`);
  }

  // Ordering
  const orderBy = opts.orderBy ?? "created_at";
  const ascending = opts.ascending ?? false;
  query = query.order(orderBy, { ascending });

  const { data, error, count } = await query;

  if (error) {
    console.error("getGalleriesPaginatedClient error:", error);
    return {
      data: [],
      page,
      pageSize,
      total: 0,
      pageCount: 0,
      hasMore: false,
      error: error.message,
    };
  }

  const total = count ?? 0;
  const pageCount = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  const hasMore = page < pageCount;

  return {
    data: data ?? [],
    page,
    pageSize,
    total,
    pageCount,
    hasMore,
  };
}
