import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { MediaSizeName } from "./media";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a random alphanumeric string as the access key
export function generateAccessKey(length = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Resolve a photo source for a given display size.
 *
 * Accepts either a legacy string URL (kept for compatibility with static
 * assets) or a photo object returned by the Payload query layer, where the
 * pre-generated R2 variants live under `sizes`.
 */
export function photoSrc(
  photo:
    | string
    | null
    | undefined
    | {
        url?: string | null;
        storage_key?: string | null;
        sizes?: Partial<
          Record<MediaSizeName, { url?: string | null } | undefined | null>
        >;
      },
  size: MediaSizeName = "medium"
): string {
  if (!photo) return "";
  if (typeof photo === "string") return photo;

  const order: MediaSizeName[] =
    size === "thumbnail"
      ? ["thumbnail", "medium", "full"]
      : size === "medium"
      ? ["medium", "full", "thumbnail"]
      : ["full", "medium", "thumbnail"];

  for (const name of order) {
    const url = photo.sizes?.[name]?.url;
    if (url) return url;
  }

  return photo.url || photo.storage_key || "";
}
