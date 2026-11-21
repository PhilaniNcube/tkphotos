import type { Where } from "payload";

import type { Gallery, Media, PhotoCollection } from "@/payload-types";

import {
  mediaSizes,
  mediaUrl,
  toGalleryRow,
  toPhotoRow,
  type GalleryRow,
  type PhotoRow,
} from "../media";
import { getPayloadClient } from "../payload";

export type { GalleryRow } from "../media";

export interface GetGalleriesOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  publicOnly?: boolean;
  collectionSlug?: string;
  includeMeta?: boolean;
  orderBy?: "created_at" | "event_date" | "title";
  ascending?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  hasMore: boolean;
  error?: string;
}

function sortFor(opts: GetGalleriesOptions): string {
  const direction = opts.ascending ? "" : "-";
  switch (opts.orderBy) {
    case "title":
      return `${direction}title`;
    case "event_date":
      return `${direction}eventDate`;
    default:
      return `${direction}createdAt`;
  }
}

async function resolveCollectionGalleryIds(
  collectionSlug: string
): Promise<number[] | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "photo-collections",
    where: { slug: { equals: collectionSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const collection = res.docs[0] as PhotoCollection | undefined;
  if (!collection) return [];
  return (collection.galleries ?? [])
    .map((item) => (typeof item === "number" ? item : item?.id))
    .filter((id): id is number => typeof id === "number");
}

async function enrichGalleriesMeta(
  galleries: GalleryRow[]
): Promise<GalleryRow[]> {
  if (!galleries.length) return galleries;

  const payload = await getPayloadClient();
  const galleryIds = galleries.map((g) => g.id);

  const [collectionsRes, mediaRes] = await Promise.all([
    payload.find({
      collection: "photo-collections",
      limit: 200,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "media",
      where: { gallery: { in: galleryIds } },
      sort: "-createdAt",
      limit: 2000,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  const collectionsByGallery = new Map<
    number,
    Array<{ id: number; name: string; slug: string }>
  >();
  for (const col of collectionsRes.docs as PhotoCollection[]) {
    for (const ref of col.galleries ?? []) {
      const gid = typeof ref === "number" ? ref : ref?.id;
      if (!gid) continue;
      const list = collectionsByGallery.get(gid) ?? [];
      list.push({ id: col.id, name: col.name, slug: col.slug });
      collectionsByGallery.set(gid, list);
    }
  }

  const countByGallery = new Map<number, number>();
  const firstMediaByGallery = new Map<number, Media>();
  for (const doc of mediaRes.docs as Media[]) {
    const gid =
      typeof doc.gallery === "object" && doc.gallery !== null
        ? doc.gallery.id
        : doc.gallery ?? 0;
    if (!gid) continue;
    countByGallery.set(gid, (countByGallery.get(gid) ?? 0) + 1);
    if (!firstMediaByGallery.has(gid)) {
      firstMediaByGallery.set(gid, doc);
    }
  }

  return galleries.map((gallery) => {
    const fallback = firstMediaByGallery.get(gallery.id);
    const hasCover = Boolean(gallery.cover_image);
    return {
      ...gallery,
      photo_count: countByGallery.get(gallery.id) ?? 0,
      collections: collectionsByGallery.get(gallery.id) ?? [],
      cover_image: hasCover
        ? gallery.cover_image
        : fallback
        ? mediaUrl(fallback, "medium")
        : null,
      cover_sizes: hasCover
        ? gallery.cover_sizes
        : fallback
        ? mediaSizes(fallback)
        : null,
      cover_width: hasCover ? gallery.cover_width : fallback?.width ?? null,
      cover_height: hasCover ? gallery.cover_height : fallback?.height ?? null,
    };
  });
}

export async function getGalleriesPaginated(
  opts: GetGalleriesOptions = {}
): Promise<PaginatedResult<GalleryRow>> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);

  try {
    const payload = await getPayloadClient();
    const and: Where[] = [];

    if (opts.publicOnly) {
      and.push({ isPublic: { equals: true } });
    }

    if (opts.collectionSlug && opts.collectionSlug !== "all") {
      const ids = await resolveCollectionGalleryIds(opts.collectionSlug);
      if (ids && ids.length === 0) {
        return {
          data: [],
          page,
          pageSize,
          total: 0,
          pageCount: 0,
          hasMore: false,
        };
      }
      if (ids?.length) {
        and.push({ id: { in: ids } });
      }
    }

    if (opts.search?.trim()) {
      const term = opts.search.trim();
      and.push({
        or: [
          { title: { like: term } },
          { description: { like: term } },
          { slug: { like: term } },
        ],
      });
    }

    const result = await payload.find({
      collection: "galleries",
      where: and.length ? { and } : {},
      sort: sortFor(opts),
      page,
      limit: pageSize,
      depth: 1,
      joins: false,
      overrideAccess: true,
    });

    const rows = result.docs.map((doc) => toGalleryRow(doc as Gallery));
    const data = opts.includeMeta ? await enrichGalleriesMeta(rows) : rows;

    return {
      data,
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
      error: error instanceof Error ? error.message : "Failed to load galleries",
    };
  }
}

export async function getGalleryById(id: number): Promise<GalleryRow | null> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findByID({
      collection: "galleries",
      id,
      depth: 1,
      joins: false,
      overrideAccess: true,
    });
    return doc ? toGalleryRow(doc as Gallery) : null;
  } catch {
    return null;
  }
}

export async function getGalleryBySlug(
  slug: string,
  opts: { includeMeta?: boolean } = {}
): Promise<GalleryRow | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "galleries",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      joins: false,
      overrideAccess: true,
    });
    const doc = result.docs[0];
    if (!doc) return null;
    const row = toGalleryRow(doc as Gallery);
    if (!opts.includeMeta) return row;
    const [enriched] = await enrichGalleriesMeta([row]);
    return enriched ?? row;
  } catch {
    return null;
  }
}

export interface GalleryWithPhotos extends GalleryRow {
  photos: PhotoRow[];
}

export async function getGalleryWithPhotos(
  id: number,
  opts: { limit?: number } = {}
): Promise<GalleryWithPhotos | null> {
  try {
    const base = await getGalleryById(id);
    if (!base) return null;

    const [gallery] = await enrichGalleriesMeta([base]);
    const payload = await getPayloadClient();
    const limit = Math.min(Math.max(opts.limit ?? 100, 1), 500);

    const media = await payload.find({
      collection: "media",
      where: { gallery: { equals: id } },
      sort: "-createdAt",
      limit,
      depth: 0,
      overrideAccess: true,
    });

    return {
      ...gallery,
      photos: media.docs.map((doc) => toPhotoRow(doc as Media)),
    };
  } catch {
    return null;
  }
}

export async function getHomepageGalleries(
  options: {
    galleryIds?: number[];
    gallerySlugs?: string[];
    photosPerGallery?: number;
    fallbackToRecent?: boolean;
  } = {}
): Promise<GalleryWithPhotos[]> {
  try {
    const payload = await getPayloadClient();
    const photosPerGallery = Math.min(
      Math.max(options.photosPerGallery ?? 1, 0),
      8
    );

    const baseWhere: Where = { isPublic: { equals: true } };
    let docs: Gallery[] = [];

    if (options.galleryIds?.length) {
      const result = await payload.find({
        collection: "galleries",
        where: {
          and: [baseWhere, { id: { in: options.galleryIds } }],
        },
        depth: 1,
        joins: false,
        limit: options.galleryIds.length,
        overrideAccess: true,
      });
      docs = result.docs as Gallery[];
    }

    if (!docs.length && options.gallerySlugs?.length) {
      const result = await payload.find({
        collection: "galleries",
        where: {
          and: [baseWhere, { slug: { in: options.gallerySlugs } }],
        },
        depth: 1,
        joins: false,
        limit: options.gallerySlugs.length,
        overrideAccess: true,
      });
      const order = new Map(
        options.gallerySlugs.map((slug, index) => [slug, index])
      );
      docs = (result.docs as Gallery[]).sort(
        (a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0)
      );
    }

    if (!docs.length && options.fallbackToRecent) {
      const result = await payload.find({
        collection: "galleries",
        where: baseWhere,
        sort: "-createdAt",
        limit: 3,
        depth: 1,
        joins: false,
        overrideAccess: true,
      });
      docs = result.docs as Gallery[];
    }

    if (!docs.length) return [];

    const galleries = docs.map((doc) => toGalleryRow(doc));
    if (photosPerGallery === 0) {
      return galleries.map((gallery) => ({ ...gallery, photos: [] }));
    }

    const ids = galleries.map((gallery) => gallery.id);
    const media = await payload.find({
      collection: "media",
      where: { gallery: { in: ids } },
      sort: "-createdAt",
      limit: Math.max(ids.length * photosPerGallery * 3, photosPerGallery),
      depth: 0,
      overrideAccess: true,
    });

    const grouped = new Map<number, PhotoRow[]>();
    for (const doc of media.docs) {
      const photo = toPhotoRow(doc as Media);
      const list = grouped.get(photo.gallery_id) ?? [];
      if (list.length < photosPerGallery) list.push(photo);
      grouped.set(photo.gallery_id, list);
    }

    return galleries.map((gallery) => ({
      ...gallery,
      photos: grouped.get(gallery.id) ?? [],
    }));
  } catch {
    return [];
  }
}
