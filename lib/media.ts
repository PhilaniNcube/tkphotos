import type { Gallery, Media } from "@/payload-types";

export type MediaSizeName = "thumbnail" | "medium" | "full";

export interface PhotoSize {
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
}

export type PhotoSizes = Partial<Record<MediaSizeName, PhotoSize>>;

const R2_BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://pub-b79d4510b2274749bab0c670fd9bdfa5.r2.dev"
).replace(/\/+$/, "");

/** Width produced by the Payload image size config. */
export const MEDIA_SIZE_WIDTHS: Record<MediaSizeName, number> = {
  thumbnail: 480,
  medium: 1280,
  full: 2560,
};

export function isMediaDoc(
  value: number | Media | null | undefined
): value is Media {
  return typeof value === "object" && value !== null;
}

export function mediaSize(
  media: Media | null | undefined,
  size: MediaSizeName
): PhotoSize | null {
  const variant = media?.sizes?.[size];
  if (!variant?.url) return null;
  return {
    url: variant.url,
    width: variant.width ?? null,
    height: variant.height ?? null,
    mimeType: variant.mimeType ?? null,
  };
}

export function mediaSizes(media: Media | null | undefined): PhotoSizes {
  if (!media) return {};
  const sizes: PhotoSizes = {};
  for (const name of Object.keys(MEDIA_SIZE_WIDTHS) as MediaSizeName[]) {
    const size = mediaSize(media, name);
    if (size) sizes[name] = size;
  }
  return sizes;
}

/** Best URL for a given display context, falling back to larger variants. */
export function mediaUrl(
  media: Media | number | null | undefined,
  size: MediaSizeName = "medium"
): string {
  if (!isMediaDoc(media)) return "";
  const order: MediaSizeName[] =
    size === "thumbnail"
      ? ["thumbnail", "medium", "full"]
      : size === "medium"
      ? ["medium", "full", "thumbnail"]
      : ["full", "medium", "thumbnail"];

  for (const name of order) {
    const url = media.sizes?.[name]?.url;
    if (url) return url;
  }
  return media.url ?? "";
}

export function mediaDimensions(
  media: Media | number | null | undefined,
  size: MediaSizeName = "medium"
): { width: number | null; height: number | null } {
  if (!isMediaDoc(media)) return { width: null, height: null };
  const variant = media.sizes?.[size];
  return {
    width: variant?.width ?? media.width ?? null,
    height: variant?.height ?? media.height ?? null,
  };
}

/**
 * A `srcset` built from the Payload variants. Useful when serving R2 URLs
 * directly (no Next image optimizer pass) so the browser downloads exactly
 * one file per breakpoint / DPR.
 */
export function mediaSrcSet(
  media: Media | number | null | undefined
): string | undefined {
  if (!isMediaDoc(media)) return undefined;
  const entries = (
    Object.keys(MEDIA_SIZE_WIDTHS) as MediaSizeName[]
  )
    .map((name) => {
      const size = media.sizes?.[name];
      return size?.url && size.width ? `${size.url} ${size.width}w` : null;
    })
    .filter(Boolean) as string[];

  return entries.length > 1 ? entries.join(", ") : undefined;
}

export function galleryCover(cover: Gallery["coverImage"]): Media | null {
  return isMediaDoc(cover) ? cover : null;
}

export function mediaAlt(media: Media | null | undefined): string {
  return media?.alt || media?.caption || media?.filename || "Photograph";
}

// ---------------------------------------------------------------------------
// View models used by the existing UI (snake_case, URL-first).
// Keeping these shapes stable means pages/components do not need a wholesale
// rewrite while the storage/CMS implementation moves to Payload + R2.
// ---------------------------------------------------------------------------

export interface PhotoRow {
  id: string;
  filename: string;
  /** Medium variant URL. Kept for backwards compatibility. */
  storage_key: string;
  /** Original upload URL (largest file). */
  url: string;
  caption: string | null;
  alt: string;
  created_at: string;
  is_featured: boolean;
  gallery_id: number;
  gallery_title?: string | null;
  gallery_slug?: string | null;
  width: number | null;
  height: number | null;
  metadata: {
    width: number | null;
    height: number | null;
    type?: string;
  } | null;
  sizes: PhotoSizes;
}

export interface StaticPhotoRowOptions {
  id: string;
  baseName: string;
  ext: string;
  caption: string;
  createdAt: string;
  galleryId: number;
  galleryTitle: string;
  gallerySlug: string;
  width: number;
  height: number;
  /** Optional upload subfolder under /media, used by newer asset paths. */
  directory?: string;
}

/**
 * Build a `PhotoRow` for an asset served straight from R2, bypassing the
 * Payload media collection. The R2 variants must already exist next to the
 * original upload.
 */
export function staticPhotoRow(opts: StaticPhotoRowOptions): PhotoRow {
  const {
    id,
    baseName,
    ext,
    caption,
    createdAt,
    galleryId,
    galleryTitle,
    gallerySlug,
    width,
    height,
    directory,
  } = opts;
  const assetPath = directory
    ? `media/${directory}/${baseName}`
    : `media/${baseName}`;

  return {
    id,
    filename: `${baseName}.${ext}`,
    storage_key: `${R2_BASE}/${assetPath}-1280x853.webp`,
    url: `${R2_BASE}/${assetPath}.${ext}`,
    caption: null,
    alt: caption,
    created_at: createdAt,
    is_featured: false,
    gallery_id: galleryId,
    gallery_title: galleryTitle,
    gallery_slug: gallerySlug,
    width,
    height,
    metadata: { width, height, type: "jpeg" },
    sizes: {
      thumbnail: {
        url: `${R2_BASE}/${assetPath}-480x320.webp`,
        width: 480,
        height: 320,
        mimeType: "image/webp",
      },
      medium: {
        url: `${R2_BASE}/${assetPath}-1280x853.webp`,
        width: 1280,
        height: 853,
        mimeType: "image/webp",
      },
      full: {
        url: `${R2_BASE}/${assetPath}-2560x1707.webp`,
        width: 2560,
        height: 1707,
        mimeType: "image/webp",
      },
    },
  };
}

export function toPhotoRow(media: Media): PhotoRow {
  const populatedGallery =
    typeof media.gallery === "object" && media.gallery !== null
      ? media.gallery
      : null;
  const galleryId =
    typeof media.gallery === "number"
      ? media.gallery
      : (populatedGallery?.id ?? 0);

  return {
    id: String(media.id),
    filename: media.filename ?? `photo-${media.id}`,
    storage_key: mediaUrl(media, "medium"),
    url: media.url ?? "",
    caption: media.caption ?? null,
    alt: mediaAlt(media),
    created_at: media.createdAt,
    is_featured: Boolean(media.isFeatured),
    gallery_id: galleryId,
    gallery_title: populatedGallery?.title ?? null,
    gallery_slug: populatedGallery?.slug ?? null,
    width: media.width ?? null,
    height: media.height ?? null,
    metadata:
      media.width || media.height
        ? {
            width: media.width ?? null,
            height: media.height ?? null,
            type: media.mimeType?.split("/")[1],
          }
        : null,
    sizes: mediaSizes(media),
  };
}

/** Build a width-descriptor srcset from the pre-generated photo variants. */
export function photoSrcSet(photo: PhotoRow): string | undefined {
  const entries = (Object.keys(MEDIA_SIZE_WIDTHS) as MediaSizeName[])
    .map((name) => {
      const size = photo?.sizes?.[name];
      return size?.url && size.width ? `${size.url} ${size.width}w` : null;
    })
    .filter(Boolean) as string[];

  return entries.length ? entries.join(", ") : undefined;
}

export interface GalleryRow {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  created_at: string;
  is_public: boolean;
  /** Medium cover variant URL. */
  cover_image: string | null;
  cover_sizes: PhotoSizes | null;
  cover_width: number | null;
  cover_height: number | null;
  photo_count?: number;
  collections?: Array<{ id: number; name: string; slug: string }>;
}

export function toGalleryRow(doc: Gallery): GalleryRow {
  const cover = galleryCover(doc.coverImage);
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description ?? null,
    event_date: doc.eventDate ? doc.eventDate.slice(0, 10) : null,
    created_at: doc.createdAt,
    is_public: Boolean(doc.isPublic),
    cover_image: cover ? mediaUrl(cover, "medium") : null,
    cover_sizes: cover ? mediaSizes(cover) : null,
    cover_width: cover?.width ?? null,
    cover_height: cover?.height ?? null,
  };
}

export interface CollectionRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

