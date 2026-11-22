import { cacheLife } from "next/cache";
import type { Where } from "payload";

import type { Gallery, Media } from "@/payload-types";

import { toPhotoRow, type PhotoRow } from "../media";
import { getPayloadClient } from "../payload";
import type { PaginatedResult } from "./galleries";

export type { PhotoRow } from "../media";

export interface GetPhotosOptions {
  page?: number;
  pageSize?: number;
  galleryId?: number;
  search?: string;
  featuredOnly?: boolean;
  orderBy?: "created_at" | "filename";
  ascending?: boolean;
}

function buildWhere(opts: GetPhotosOptions): Where {
  const and: Where[] = [];

  if (opts.galleryId !== undefined) {
    and.push({ gallery: { equals: opts.galleryId } });
  }
  if (opts.featuredOnly) {
    and.push({ isFeatured: { equals: true } });
  }
  if (opts.search?.trim()) {
    const term = opts.search.trim();
    and.push({
      or: [
        { filename: { like: term } },
        { caption: { like: term } },
        { alt: { like: term } },
      ],
    });
  }

  return and.length ? { and } : {};
}

export async function getPhotosPaginated(
  opts: GetPhotosOptions = {}
): Promise<PaginatedResult<PhotoRow>> {
  "use cache";
  cacheLife("minutes");

  const payload = await getPayloadClient();
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 40, 1), 200);
  const direction = opts.ascending ? "" : "-";
  const sort =
    opts.orderBy === "filename"
      ? `${direction}filename`
      : `${direction}createdAt`;

  try {
    const result = await payload.find({
      collection: "media",
      where: buildWhere(opts),
      sort,
      page,
      limit: pageSize,
      depth: 0,
      overrideAccess: true,
    });

    return {
      data: result.docs.map((doc) => toPhotoRow(doc as Media)),
      page,
      pageSize,
      total: result.totalDocs,
      pageCount: result.totalPages,
      hasMore: result.hasNextPage,
    };
  } catch (error) {
    return {
      data: [],
      page,
      pageSize,
      total: 0,
      pageCount: 0,
      hasMore: false,
      error: error instanceof Error ? error.message : "Failed to load photos",
    };
  }
}

export async function getPhotoById(id: string): Promise<PhotoRow | null> {
  "use cache";
  cacheLife("minutes");

  const payload = await getPayloadClient();

  try {
    if (/^\d+$/.test(id)) {
      const doc = await payload.findByID({
        collection: "media",
        id: Number(id),
        depth: 0,
        overrideAccess: true,
      });
      return doc ? toPhotoRow(doc as Media) : null;
    }

    const result = await payload.find({
      collection: "media",
      where: { legacyId: { equals: id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const doc = result.docs[0];
    return doc ? toPhotoRow(doc as Media) : null;
  } catch {
    return null;
  }
}

function isFromPublicGallery(media: Media): boolean {
  if (typeof media.gallery === "object" && media.gallery !== null) {
    return Boolean((media.gallery as Gallery).isPublic);
  }
  return false;
}

export async function getFeaturedPhotos(limit: number): Promise<PhotoRow[]> {
  "use cache";
  cacheLife("minutes");

  const target = Math.min(Math.max(limit, 1), 50);
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "media",
      where: { isFeatured: { equals: true } },
      sort: "-createdAt",
      limit: target * 2,
      depth: 1,
      overrideAccess: true,
    });

    const selected: PhotoRow[] = [];
    const seen = new Set<string>();

    for (const doc of result.docs as Media[]) {
      if (doc.gallery && !isFromPublicGallery(doc)) continue;
      const row = toPhotoRow(doc);
      if (!seen.has(row.id)) {
        seen.add(row.id);
        selected.push(row);
      }
      if (selected.length >= target) break;
    }

    if (selected.length < target) {
      const fallback = await payload.find({
        collection: "media",
        sort: "-createdAt",
        limit: target * 4,
        depth: 1,
        overrideAccess: true,
      });
      for (const doc of fallback.docs as Media[]) {
        if (!isFromPublicGallery(doc)) continue;
        const row = toPhotoRow(doc);
        if (!seen.has(row.id)) {
          seen.add(row.id);
          selected.push(row);
        }
        if (selected.length >= target) break;
      }
    }

    return selected;
  } catch {
    return [];
  }
}

export async function getPhotoByLegacyUrl(
  url: string
): Promise<PhotoRow | null> {
  "use cache";
  cacheLife("minutes");

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "media",
      where: { legacyUrl: { equals: url } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    const doc = result.docs[0];
    return doc ? toPhotoRow(doc as Media) : null;
  } catch {
    return null;
  }
}

export async function getPhotosByLegacyUrls(
  urls: string[]
): Promise<PhotoRow[]> {
  "use cache";
  cacheLife("minutes");

  if (!urls.length) return [];
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "media",
      where: { legacyUrl: { in: urls } },
      limit: urls.length,
      depth: 1,
      overrideAccess: true,
    });

    const byUrl = new Map(
      result.docs.map((doc) => [(doc as Media).legacyUrl, toPhotoRow(doc as Media)])
    );

    return urls
      .map((url) => byUrl.get(url))
      .filter((photo): photo is PhotoRow => Boolean(photo));
  } catch {
    return [];
  }
}

export async function getRecentPhotosForGalleries(
  galleryIds: number[],
  opts: { perGallery?: number } = {}
): Promise<Record<number, PhotoRow[]>> {
  "use cache";
  cacheLife("minutes");

  if (!galleryIds.length) return {};

  try {
    const payload = await getPayloadClient();
    const perGallery = Math.min(Math.max(opts.perGallery ?? 4, 1), 24);
    const result = await payload.find({
      collection: "media",
      where: { gallery: { in: galleryIds } },
      sort: "-createdAt",
      limit: galleryIds.length * perGallery * 3,
      depth: 0,
      overrideAccess: true,
    });

    const grouped: Record<number, PhotoRow[]> = {};
    for (const doc of result.docs) {
      const photo = toPhotoRow(doc as Media);
      const list = grouped[photo.gallery_id] ?? [];
      if (list.length < perGallery) list.push(photo);
      grouped[photo.gallery_id] = list;
    }
    return grouped;
  } catch {
    return {};
  }
}
