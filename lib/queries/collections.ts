import type { Where } from "payload";

import type { Gallery, Media, PhotoCollection } from "@/payload-types";

import {
  toGalleryRow,
  toPhotoRow,
  type CollectionRow,
  type PhotoRow,
  type PhotoSizes,
} from "../media";
import { getPayloadClient } from "../payload";
import type { PaginatedResult } from "./galleries";

export type { CollectionRow } from "../media";

export interface GetCollectionsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: "created_at" | "name";
  ascending?: boolean;
}

export async function getCollectionsPaginated(
  opts: GetCollectionsOptions = {}
): Promise<PaginatedResult<CollectionRow>> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
  const direction = opts.ascending ? "" : "-";
  const sort =
    opts.orderBy === "name" ? `${direction}name` : `${direction}createdAt`;

  const and: Where[] = [];
  if (opts.search?.trim()) {
    const term = opts.search.trim();
    and.push({
      or: [
        { name: { like: term } },
        { description: { like: term } },
        { slug: { like: term } },
      ],
    });
  }

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "photo-collections",
      where: and.length ? { and } : {},
      sort,
      page,
      limit: pageSize,
      depth: 0,
      overrideAccess: true,
    });

    return {
      data: result.docs.map(toCollectionRow),
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
      error:
        error instanceof Error ? error.message : "Failed to load collections",
    };
  }
}

function toCollectionRow(doc: PhotoCollection): CollectionRow {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? null,
    created_at: doc.createdAt,
  };
}

export async function getAllCollections(
  opts: {
    orderBy?: "created_at" | "name";
    ascending?: boolean;
    limit?: number;
  } = {}
): Promise<{ data: CollectionRow[]; error?: string }> {
  const direction = opts.ascending ? "" : "-";
  const sort =
    opts.orderBy === "name" ? `${direction}name` : `${direction}createdAt`;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "photo-collections",
      sort,
      limit: opts.limit ? Math.min(Math.max(opts.limit, 1), 500) : 500,
      depth: 0,
      overrideAccess: true,
    });
    return { data: result.docs.map(toCollectionRow) };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to load collections",
    };
  }
}

export interface CollectionShowcaseRow extends CollectionRow {
  updated_at: string;
  gallery_count: number;
  photo_count: number;
  preview_photos: PhotoRow[];
}

export async function getCollectionsShowcase(): Promise<{
  data: CollectionShowcaseRow[];
  error?: string;
}> {
  try {
    const payload = await getPayloadClient();
    const collectionsRes = await payload.find({
      collection: "photo-collections",
      sort: "-createdAt",
      limit: 200,
      depth: 1,
      overrideAccess: true,
    });

    const collections = collectionsRes.docs as PhotoCollection[];
    const publicGalleryIds = new Set<number>();

    for (const col of collections) {
      for (const item of col.galleries ?? []) {
        if (typeof item === "object" && item !== null && item.isPublic) {
          publicGalleryIds.add(item.id);
        }
      }
    }

    const photosByGallery = new Map<number, PhotoRow[]>();
    if (publicGalleryIds.size > 0) {
      const mediaRes = await payload.find({
        collection: "media",
        where: { gallery: { in: Array.from(publicGalleryIds) } },
        sort: "-createdAt",
        limit: 2000,
        depth: 0,
        overrideAccess: true,
      });

      for (const doc of mediaRes.docs as Media[]) {
        const photo = toPhotoRow(doc);
        const list = photosByGallery.get(photo.gallery_id) ?? [];
        list.push(photo);
        photosByGallery.set(photo.gallery_id, list);
      }
    }

    const data: CollectionShowcaseRow[] = collections.map((col) => {
      const publicGalleries = (col.galleries ?? []).filter(
        (item): item is Gallery =>
          typeof item === "object" && item !== null && Boolean(item.isPublic)
      );

      let photoCount = 0;
      const previewPhotos: PhotoRow[] = [];
      const seenIds = new Set<string>();

      for (const gallery of publicGalleries) {
        const galleryPhotos = photosByGallery.get(gallery.id) ?? [];
        photoCount += galleryPhotos.length;

        if (
          gallery.coverImage &&
          typeof gallery.coverImage === "object" &&
          previewPhotos.length < 4
        ) {
          const coverRow = toPhotoRow(gallery.coverImage);
          if (!seenIds.has(coverRow.id)) {
            seenIds.add(coverRow.id);
            previewPhotos.push(coverRow);
          }
        }
      }

      if (previewPhotos.length < 4) {
        for (const gallery of publicGalleries) {
          for (const photo of photosByGallery.get(gallery.id) ?? []) {
            if (!seenIds.has(photo.id)) {
              seenIds.add(photo.id);
              previewPhotos.push(photo);
            }
            if (previewPhotos.length >= 4) break;
          }
          if (previewPhotos.length >= 4) break;
        }
      }

      return {
        ...toCollectionRow(col),
        updated_at: col.updatedAt || col.createdAt,
        gallery_count: publicGalleries.length,
        photo_count: photoCount,
        preview_photos: previewPhotos.slice(0, 4),
      };
    });

    return { data };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Failed to load collections",
    };
  }
}

export async function getCollectionById(
  id: string
): Promise<CollectionRow | null> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findByID({
      collection: "photo-collections",
      id: Number(id),
      depth: 0,
      overrideAccess: true,
    });
    return doc ? toCollectionRow(doc as PhotoCollection) : null;
  } catch {
    return null;
  }
}

export async function getCollectionBySlug(
  slug: string
): Promise<CollectionRow | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "photo-collections",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const doc = result.docs[0];
    return doc ? toCollectionRow(doc as PhotoCollection) : null;
  } catch {
    return null;
  }
}

export interface CollectionWithGalleries extends CollectionRow {
  galleries: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    event_date: string | null;
    is_public: boolean;
    created_at: string;
    cover_image: string | null;
    cover_sizes: PhotoSizes | null;
    photo_count: number;
  }[];
}

function mapGalleries(
  docs: (number | Gallery)[] | null | undefined,
  countsByGallery: Map<number, number> = new Map()
) {
  return (docs ?? [])
    .filter((item): item is Gallery => typeof item === "object" && item !== null)
    .map((gallery) => {
      const row = toGalleryRow(gallery);
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        event_date: row.event_date,
        is_public: row.is_public,
        created_at: row.created_at,
        cover_image: row.cover_image,
        cover_sizes: row.cover_sizes,
        photo_count: countsByGallery.get(row.id) ?? 0,
      };
    });
}

export async function getCollectionWithGalleries(
  id: number
): Promise<CollectionWithGalleries | null> {
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findByID({
      collection: "photo-collections",
      id,
      depth: 2,
      overrideAccess: true,
    })) as PhotoCollection | null;

    if (!doc) return null;
    return {
      ...toCollectionRow(doc),
      galleries: mapGalleries(doc.galleries),
    };
  } catch {
    return null;
  }
}

export async function getCollectionGalleries(
  collectionSlug: string
): Promise<CollectionWithGalleries | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "photo-collections",
      where: { slug: { equals: collectionSlug } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    });
    const doc = result.docs[0] as PhotoCollection | undefined;
    if (!doc) return null;

    const galleryIds = (doc.galleries ?? [])
      .map((item) => (typeof item === "number" ? item : item?.id))
      .filter((id): id is number => typeof id === "number");

    const counts = new Map<number, number>();
    if (galleryIds.length > 0) {
      const media = await payload.find({
        collection: "media",
        where: { gallery: { in: galleryIds } },
        limit: 2000,
        depth: 0,
        overrideAccess: true,
      });
      for (const m of media.docs as Media[]) {
        const gid =
          typeof m.gallery === "object" && m.gallery !== null
            ? m.gallery.id
            : m.gallery ?? 0;
        if (gid) counts.set(gid, (counts.get(gid) ?? 0) + 1);
      }
    }

    return {
      ...toCollectionRow(doc),
      galleries: mapGalleries(doc.galleries, counts),
    };
  } catch {
    return null;
  }
}
