import { createClient } from "../server";
import type { Tables } from "../types";
import type { PaginatedResult } from "./galleries"; // reuse shared interface

export type CollectionRow = Tables<"collections">;

export interface GetCollectionsOptions {
  page?: number; // 1-based page number
  pageSize?: number; // results per page (default 20, clamp 1..100)
  search?: string; // matches name, description, slug (ILIKE)
  orderBy?: "created_at" | "name"; // default created_at
  ascending?: boolean; // default false (newest first)
}

/**
 * Fetch collections with simple offset pagination (exact total count).
 * Suitable for small/medium lists. For very large datasets consider a cursor approach.
 */
export async function getCollectionsPaginated(
  opts: GetCollectionsOptions = {}
): Promise<PaginatedResult<CollectionRow>> {
  const supabase = await createClient();

  const page = Math.max(1, opts.page ?? 1);
  const rawPageSize = opts.pageSize ?? 20;
  const pageSize = Math.min(Math.max(rawPageSize, 1), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("collections")
    .select("*", { count: "exact" })
    .range(from, to);

  if (opts.search && opts.search.trim()) {
    const term = `%${opts.search.trim()}%`;
    query = query.or(
      `name.ilike.${term},description.ilike.${term},slug.ilike.${term}`
    );
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

// Fetch all collections (optionally limited) for lightweight public listings.
// Provide ordering and optional limit (defaults: order by created_at desc, no limit).
export async function getAllCollections(
  opts: {
    orderBy?: "created_at" | "name";
    ascending?: boolean;
    limit?: number;
  } = {}
): Promise<{ data: CollectionRow[]; error?: string }> {
  const supabase = await createClient();
  const orderBy = opts.orderBy ?? "created_at";
  const ascending = opts.ascending ?? false;
  let query = supabase.from("collections").select("*").order(orderBy, {
    ascending,
    nullsFirst: false,
  });
  if (opts.limit && opts.limit > 0) {
    query = query.limit(Math.min(Math.max(opts.limit, 1), 500));
  }
  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: data || [] };
}

export async function getCollectionById(
  id: string
): Promise<CollectionRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error) {
    console.error("Error fetching collection by ID:", error);
    return null;
  }

  return data;
}

export async function getCollectionBySlug(
  slug: string
): Promise<CollectionRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching collection by slug:", error);
    return null;
  }

  return data;
}

export interface CollectionWithGalleries extends CollectionRow {
  galleries: {
    id: number;
    title: string;
    slug: string;
    is_public: boolean;
    created_at: string;
  }[];
}

export async function getCollectionWithGalleries(
  id: number
): Promise<CollectionWithGalleries | null> {
  const supabase = await createClient();
  const collection = await getCollectionById(String(id));
  if (!collection) return null;
  const { data: rows, error } = await supabase
    .from("collection_galleries")
    .select("galleries(id,title,slug,is_public,created_at)")
    .eq("collection_id", id)
    .order("gallery_id", { ascending: false });
  if (error) {
    console.error("Error fetching collection galleries:", error);
    return { ...collection, galleries: [] };
  }
  const galleries = (rows || [])
    .map((r: any) => r.galleries)
    .filter(Boolean) as CollectionWithGalleries["galleries"];
  return { ...collection, galleries };
}

export async function getCollectionGalleries(
  collectionSlug: string
): Promise<CollectionWithGalleries | null> {
  const supabase = await createClient();
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) return null;
  const { data: rows, error } = await supabase
    .from("collection_galleries")
    .select("galleries(id,title,slug,is_public,created_at)")
    .eq("collection_id", collection.id)
    .order("gallery_id", { ascending: false });
  if (error) {
    console.error("Error fetching collection galleries:", error);
    return { ...collection, galleries: [] };
  }
  const galleries = (rows || [])
    .map((r: any) => r.galleries)
    .filter(Boolean) as CollectionWithGalleries["galleries"];
  return { ...collection, galleries };
}
