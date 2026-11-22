import { cacheLife } from "next/cache";
import type { Where } from "payload";

import type { Media, Post } from "@/payload-types";

import {
  mediaAlt,
  mediaSizes,
  mediaUrl,
  type PhotoSizes,
} from "../media";
import { getPayloadClient } from "../payload";
import type { PaginatedResult } from "./galleries";

export interface PostRow {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Post["content"];
  author: string | null;
  published_at: string;
  cover_image: string | null;
  cover_sizes: PhotoSizes | null;
  cover_width: number | null;
  cover_height: number | null;
  cover_alt: string;
  tags: string[];
}

function isMediaDoc(value: number | Media | null | undefined): value is Media {
  return typeof value === "object" && value !== null;
}

function toPostRow(doc: Post): PostRow {
  const cover = isMediaDoc(doc.coverImage) ? doc.coverImage : null;
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? null,
    content: doc.content,
    author: doc.author ?? null,
    published_at: doc.publishedAt ?? doc.createdAt,
    cover_image: cover ? mediaUrl(cover, "medium") : null,
    cover_sizes: cover ? mediaSizes(cover) : null,
    cover_width: cover?.width ?? null,
    cover_height: cover?.height ?? null,
    cover_alt: cover ? mediaAlt(cover) : doc.title,
    tags: (doc.tags ?? [])
      .map((tag) => (typeof tag === "object" && tag !== null ? tag.name : null))
      .filter((name): name is string => Boolean(name)),
  };
}

/** Posts that are visible on the public site right now. */
function publishedWhere(): Where {
  return {
    status: { equals: "published" },
    publishedAt: { less_than_equal: new Date().toISOString() },
  };
}

export async function getPostsPaginated(
  opts: { page?: number; pageSize?: number } = {}
): Promise<PaginatedResult<PostRow>> {
  "use cache";
  cacheLife("minutes");

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 9, 1), 50);

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      where: publishedWhere(),
      sort: "-publishedAt",
      page,
      limit: pageSize,
      depth: 1,
      overrideAccess: true,
    });

    return {
      data: result.docs.map((doc) => toPostRow(doc as Post)),
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
      error: error instanceof Error ? error.message : "Failed to load posts",
    };
  }
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  "use cache";
  cacheLife("minutes");

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      where: {
        and: [{ slug: { equals: slug } }, publishedWhere()],
      },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    const doc = result.docs[0] as Post | undefined;
    return doc ? toPostRow(doc) : null;
  } catch {
    return null;
  }
}

/** Slugs for every publicly visible post, used by the sitemap. */
export async function getAllPostSlugs(): Promise<
  Array<{ slug: string; published_at: string }>
> {
  "use cache";
  cacheLife("minutes");

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      where: publishedWhere(),
      sort: "-publishedAt",
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs.map((doc) => ({
      slug: doc.slug,
      published_at: doc.publishedAt ?? doc.createdAt,
    }));
  } catch {
    return [];
  }
}
