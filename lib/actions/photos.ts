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

    const normalized = {
      filename: (raw.filename as string) ?? "",
      storage_key: (raw.storage_key as string) ?? "",
      gallery_id: raw.gallery_id ? Number(raw.gallery_id) : NaN,
      caption: raw.caption ? String(raw.caption) : null,
      is_featured:
        raw.is_featured === "on" || raw.is_featured === "true" ? true : false,
      id: raw.id ? String(raw.id) : undefined,
    };

    const parsed = createPhotoSchema.safeParse(normalized);
    if (!parsed.success) {
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
