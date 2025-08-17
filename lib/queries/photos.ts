import { createClient } from "../server";
import type { Tables } from "../types";
import type { PaginatedResult } from "./galleries"; // reuse existing generic result interface

export type PhotoRow = Tables<"photos">;

export interface GetPhotosOptions {
  page?: number; // 1-based
  pageSize?: number; // default 40 clamp 1..200
  galleryId?: number; // optional filter by gallery
  search?: string; // matches filename or caption (ILIKE)
  featuredOnly?: boolean; // filter is_featured = true
  orderBy?: "created_at" | "filename"; // default created_at
  ascending?: boolean; // default false
}

/**
 * Offset pagination for photos.
 * NOTE: For very large photo sets consider cursor pagination on (created_at, id) to avoid deep offsets.
 */
export async function getPhotosPaginated(
  opts: GetPhotosOptions = {}
): Promise<PaginatedResult<PhotoRow>> {
  const supabase = await createClient();

  const page = Math.max(1, opts.page ?? 1);
  const rawPageSize = opts.pageSize ?? 40;
  const pageSize = Math.min(Math.max(rawPageSize, 1), 200);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("photos")
    .select("*", { count: "exact" })
    .range(from, to);

  if (opts.galleryId !== undefined) {
    query = query.eq("gallery_id", opts.galleryId);
  }

  if (opts.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (opts.search && opts.search.trim()) {
    const term = `%${opts.search.trim()}%`;
    query = query.or(`filename.ilike.${term},caption.ilike.${term}`);
  }

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

// Fetch a single photo by UUID id
export async function getPhotoById(id: string): Promise<PhotoRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getFeaturedPhotos(limit: number): Promise<PhotoRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("is_featured", true)
    .limit(limit);
  if (error) return [];
  return data;
}

// Fetch recent photos for multiple galleries. Returns a map galleryId -> photos[]
export async function getRecentPhotosForGalleries(
  galleryIds: number[],
  opts: { perGallery?: number } = {}
): Promise<Record<number, PhotoRow[]>> {
  if (!galleryIds.length) return {};
  const perGallery = Math.min(Math.max(opts.perGallery ?? 4, 1), 24);
  const supabase = await createClient();
  // Fetch in a single query using in() then we'll group & slice
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .in("gallery_id", galleryIds)
    .order("created_at", { ascending: false })
    .limit(galleryIds.length * perGallery * 2); // over-fetch a bit then slice per group
  if (error || !data) return {};
  const grouped: Record<number, PhotoRow[]> = {};
  for (const p of data) {
    if (!grouped[p.gallery_id]) grouped[p.gallery_id] = [];
    if (grouped[p.gallery_id].length < perGallery) {
      grouped[p.gallery_id].push(p);
    }
  }
  return grouped;
}
