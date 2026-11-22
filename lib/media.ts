import type { Gallery, Media } from "@/payload-types";

export type MediaSizeName = "thumbnail" | "medium" | "full";

export interface PhotoSize {
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
}

export type PhotoSizes = Partial<Record<MediaSizeName, PhotoSize>>;

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

