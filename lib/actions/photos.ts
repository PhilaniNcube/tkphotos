"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../server";
import {
  createPhotoSchema,
  CreatePhotoState,
  initialCreatePhotoState,
} from "../schema";

// State shape imported from schema module (cannot export here besides actions).

// Server action for creating a photo.
// Expects a FormData with fields: filename, storage_key, gallery_id, optional caption, is_featured, id.
export async function createPhotoAction(
  _prevState: CreatePhotoState = initialCreatePhotoState,
  formData: FormData
): Promise<CreatePhotoState> {
  try {
    const raw = Object.fromEntries(formData.entries());

    console.log("Raw form data:", raw);

    // Auto-sanitize filename so that uploads coming from providers that inject
    // spaces or other characters (e.g. "My Photo (1).JPG") don't fail schema validation.
    // Allowed chars per schema: letters, numbers, dot, underscore, hyphen.
    const sanitizeFilename = (name: string | undefined | null): string => {
      if (!name) return "file"; // fallback
      // Replace disallowed chars with underscore, collapse repeats, trim underscores at ends.
      let cleaned = name
        .trim()
        .replace(/[^A-Za-z0-9._-]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
      if (cleaned.length === 0) cleaned = "file";
      // Cap length to 200 (schema limit) preserving extension if possible.
      if (cleaned.length > 200) {
        const parts = cleaned.split(".");
        if (parts.length > 1) {
          const ext = parts.pop();
          // Recompute base ensuring room for dot+ext
          const maxBase = 200 - (ext ? ext.length + 1 : 0);
          cleaned = parts.join(".").slice(0, Math.max(1, maxBase));
          cleaned = `${cleaned}.${ext}`;
        } else {
          cleaned = cleaned.slice(0, 200);
        }
      }
      return cleaned;
    };

    const normalized = {
      filename: sanitizeFilename(raw.filename as string),
      storage_key: (raw.storage_key as string) ?? "",
      gallery_id: raw.gallery_id ? Number(raw.gallery_id) : NaN,
      caption: raw.caption ? String(raw.caption) : null,
      is_featured:
        raw.is_featured === "on" || raw.is_featured === "true" ? true : false,
      id: raw.id ? String(raw.id) : undefined,
      metadata: (() => {
        try {
          if (raw.metadata === undefined || raw.metadata === null)
            return undefined;
          // If already an object (could be appended via FormData as Blob?) just return
          if (typeof raw.metadata === "object") return raw.metadata as any;
          return JSON.parse(String(raw.metadata));
        } catch {
          return undefined; // Ignore bad metadata silently
        }
      })(),
    };

    const parsed = createPhotoSchema.safeParse(normalized);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error);
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        fieldErrors[key] = fieldErrors[key] || [];
        fieldErrors[key].push(issue.message);
      }
      return { success: false, error: "Validation failed", fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("photos").insert({
      filename: parsed.data.filename,
      storage_key: parsed.data.storage_key,
      gallery_id: parsed.data.gallery_id,
      caption: parsed.data.caption,
      is_featured: parsed.data.is_featured,
      id: parsed.data.id, // optional
      metadata: parsed.data.metadata ?? null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate photo & gallery related pages so new images appear without manual refresh
    revalidatePath("/dashboard/photos");
    revalidatePath(`/dashboard/galleries/${parsed.data.gallery_id}`);
    if (!Number.isNaN(parsed.data.gallery_id)) {
      // Revalidate the galleries list & the specific gallery detail page
      revalidatePath("/dashboard/galleries");
      revalidatePath(`/dashboard/galleries/${parsed.data.gallery_id}`);
      revalidatePath(`/dashboard/collections`, "layout");
    }
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

// Delete a photo by id (UUID). Revalidates galleries & photos pages.
export async function deletePhotoAction(photoId: string, galleryId?: number) {
  try {
    if (!photoId) throw new Error("Missing photo id");
    const supabase = await createClient();
    const { error } = await supabase.from("photos").delete().eq("id", photoId);
    if (error) return { success: false, error: error.message } as const;
    // Revalidate generic photo listing and gallery specific pages
    revalidatePath("/dashboard/photos");
    if (galleryId) {
      revalidatePath(`/dashboard/galleries/${galleryId}`);
      revalidatePath("/dashboard/galleries");
      revalidatePath("/dashboard/collections", "layout");
    }
    return { success: true } as const;
  } catch (e: any) {
    return { success: false, error: e?.message || "Unknown error" } as const;
  }
}

// Toggle photo featured flag. Returns new value on success.
export async function toggleFeaturedPhotoAction(
  photoId: string,
  value: boolean
) {
  try {
    if (!photoId) throw new Error("Missing photo id");
    const supabase = await createClient();
    const { error } = await supabase
      .from("photos")
      .update({ is_featured: value })
      .eq("id", photoId);
    if (error) return { success: false, error: error.message } as const;
    revalidatePath("/dashboard/photos");
    return { success: true, value } as const;
  } catch (e: any) {
    return { success: false, error: e?.message || "Unknown error" } as const;
  }
}
