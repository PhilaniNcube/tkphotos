import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient as createBrowserSupabaseClient } from "./client"; // browser-side supabase client factory

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
  options: { bucket?: string } = {},
  width?: number,
  height?: number
): string {
  if (!storageKey) return "";
  const bucket = options.bucket ?? "photos";
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";

  // Normalize leading slashes for the storage key
  const normalized = storageKey.replace(/^\/+/, "");

  try {
    // We only need a lightweight client; creating a new one per call is fine since getPublicUrl is pure string building.
    const supabase = createBrowserSupabaseClient();
    const transform =
      width || height
        ? {
            width: width || undefined,
            height: height || undefined,
            resize: "cover" as const, // choose a sensible default; adjust if needed
          }
        : undefined;
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(normalized, transform ? { transform } : undefined);
    return data?.publicUrl || "";
  } catch {
    // Fallback to manual construction (legacy behaviour) if anything goes wrong
    const encoded = normalized
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    return `${base}/storage/v1/object/public/${bucket}/${encoded}`;
  }
}
