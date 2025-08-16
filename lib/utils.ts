import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

// Build a public URL for a photo stored in the Supabase "photos" bucket.
// storageKey is the path saved in the photos.storage_key column (path after the bucket name).
// Example: storageKey = "weddings/IMG_1234.jpg" =>
//   https://<project>.supabase.co/storage/v1/object/public/photos/weddings/IMG_1234.jpg
// If storageKey is empty or env vars missing, returns "".
export function photoSrc(
  storageKey: string | null | undefined,
  options: { bucket?: string } = {}
): string {
  if (!storageKey) return "";
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  const bucket = options.bucket ?? "photos"; // default bucket name
  // Normalize: remove any leading slashes so we don't get double slashes in the URL
  const normalized = storageKey.replace(/^\/+/, "");
  // Encode each path segment but keep slashes
  const encoded = normalized
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${base}/storage/v1/object/public/${bucket}/${encoded}`;
}
