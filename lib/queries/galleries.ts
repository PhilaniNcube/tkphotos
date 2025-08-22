import { createClient } from "../server";
import type { Tables } from "../types";

export interface GetGalleriesOptions {
  page?: number; // 1-based
  pageSize?: number; // default 20
  search?: string; // matches title or description (ILIKE)
  publicOnly?: boolean; // filter is_public = true
  orderBy?: "created_at" | "event_date" | "title"; // default created_at
  ascending?: boolean; // default false (newest first)
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number; // total matching rows (may be 0)
  pageCount: number; // total pages (>= 0)
  hasMore: boolean; // true if another page exists after this one
  error?: string; // populated if request failed
}

export type GalleryRow = Tables<"galleries">;

/**
 * Fetch galleries with simple offset pagination.
 * Uses PostgREST range() and an exact count so we can compute total pages.
 * Intended for small/medium result sets (page * pageSize not extremely large).
 * For large datasets consider cursor-based pagination on created_at or id.
 */
export async function getGalleriesPaginated(
  opts: GetGalleriesOptions = {}
): Promise<PaginatedResult<GalleryRow>> {
  const supabase = await createClient();

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

  if (opts.search && opts.search.trim()) {
    const term = `%${opts.search.trim()}%`;
    // Wrap OR conditions with or() using PostgREST filter syntax
    query = query.or(
      `title.ilike.${term},description.ilike.${term},slug.ilike.${term}`
    );
  }

  // Ordering
  const orderBy = opts.orderBy ?? "created_at";
  const ascending = opts.ascending ?? false;
  query = query.order(orderBy, { ascending, nullsFirst: false });

  const { data, error, count } = await query;

  if (error) {
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
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
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

/**
 * Convenience function for cursor-based (created_at, id) forward pagination.
 * Returns next cursor token if more rows exist.
 */
export interface CursorPageOptions {
  limit?: number; // default 20
  cursor?: { created_at: string; id: number }; // last item from previous page
  publicOnly?: boolean;
  search?: string;
}

export interface CursorPageResult<T> {
  data: T[];
  nextCursor?: { created_at: string; id: number }; // pass back into cursor option
  error?: string;
}

export async function getGalleriesCursorPage(
  opts: CursorPageOptions = {}
): Promise<CursorPageResult<GalleryRow>> {
  const supabase = await createClient();
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);

  let query = supabase
    .from("galleries")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .order("id", { ascending: false });

  if (opts.publicOnly) query = query.eq("is_public", true);
  if (opts.search && opts.search.trim()) {
    const term = `%${opts.search.trim()}%`;
    query = query.or(
      `title.ilike.${term},description.ilike.${term},slug.ilike.${term}`
    );
  }

  if (opts.cursor) {
    // For (created_at DESC, id DESC) cursor: select rows where
    // created_at < cursor.created_at OR (created_at = cursor.created_at AND id < cursor.id)
    const { created_at, id } = opts.cursor;
    // PostgREST doesn't support direct complex OR with parentheses easily via helpers, use or() string.
    // Need to URL encode commas but library handles it. Build logical expression:
    // created_at.lt.<ts>,and(created_at.eq.<ts>,id.lt.<id>)
    const expr = `created_at.lt.${created_at},and(created_at.eq.${created_at},id.lt.${id})`;
    query = query.or(expr);
  }

  const { data, error } = await query.limit(limit + 1); // fetch one extra to detect more

  if (error) {
    return { data: [], error: error.message };
  }

  const rows = data ?? [];
  let nextCursor: CursorPageResult<GalleryRow>["nextCursor"];
  if (rows.length > limit) {
    const last = rows[limit - 1];
    nextCursor = { created_at: last.created_at, id: last.id };
  }

  return { data: rows.slice(0, limit), nextCursor };
}

// Fetch a single gallery by id
export async function getGalleryById(id: number): Promise<GalleryRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export interface GalleryWithPhotos extends GalleryRow {
  photos: {
    id: string;
    filename: string;
    storage_key: string;
    caption: string | null;
    created_at: string;
    is_featured: boolean;
    metadata?: any | null;
    gallery_id?: number;
  }[];
}

export async function getGalleryWithPhotos(
  id: number,
  opts: { limit?: number } = {}
): Promise<GalleryWithPhotos | null> {
  const supabase = await createClient();
  const gallery = await getGalleryById(id);
  if (!gallery) return null;
  const limit = Math.min(Math.max(opts.limit ?? 100, 1), 500);
  const { data: photos } = await supabase
    .from("photos")
    .select(
      "id,filename,storage_key,caption,created_at,is_featured,metadata,gallery_id"
    )
    .eq("gallery_id", id)
    .order("created_at", { ascending: false })
    .limit(limit);
  return { ...gallery, photos: photos ?? [] };
}
export async function getGalleryBySlug(
  slug: string
): Promise<GalleryRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

// Lightweight homepage galleries fetch: returns up to `limit` public galleries,
// newest first, plus up to `photosPerGallery` recent photos (for cover display / counts).
export async function getHomepageGalleries(
  options: {
    limit?: number;
    photosPerGallery?: number;
  } = {}
) {
  const supabase = await createClient();
  const limit = Math.min(Math.max(options.limit ?? 3, 1), 12);
  const photosPerGallery = Math.min(
    Math.max(options.photosPerGallery ?? 1, 0),
    8
  );

  const { data: galleries, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !galleries?.length) return [] as GalleryWithPhotos[];

  if (photosPerGallery === 0)
    return galleries.map((g) => ({ ...g, photos: [] }));

  // Fetch photos for each gallery (could be optimized with RPC or a single IN query)
  const results: GalleryWithPhotos[] = [];
  for (const g of galleries) {
    const { data: photos } = await supabase
      .from("photos")
      .select("id,filename,storage_key,caption,created_at,is_featured")
      .eq("gallery_id", g.id)
      .order("created_at", { ascending: false })
      .limit(photosPerGallery);
    results.push({ ...g, photos: photos ?? [] });
  }
  return results;
}
