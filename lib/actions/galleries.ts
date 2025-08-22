"use server";

import { createClient } from "../server";
import { revalidatePath } from "next/cache";
import { createGallerySchema, CreateGalleryState } from "../schema";

// Server action for creating a gallery. Accepts FormData produced by the client form.
export async function createGalleryAction(
  _prevState: CreateGalleryState,
  formData: FormData
): Promise<CreateGalleryState> {
  try {
    const raw = Object.fromEntries(formData.entries());
    // Normalize optional fields that might come as empty strings
    const normalized = {
      title: (raw.title as string) ?? "",
      slug: (raw.slug as string) ?? "",
      description: raw.description ? String(raw.description) : null,
      access_key: (raw.access_key as string) ?? "",
      is_public: true,
      event_date: raw.event_date ? String(raw.event_date) : null,
      cover_image: raw.cover_image ? String(raw.cover_image) : null,
    };

    const parsed = createGallerySchema.safeParse(normalized);
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
    const { error } = await supabase.from("galleries").insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      access_key: parsed.data.access_key,
      is_public: parsed.data.is_public,
      event_date: parsed.data.event_date,
      cover_image: parsed.data.cover_image,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate any dashboard gallery listing pages (adjust paths as needed)
    revalidatePath("/dashboard/galleries");
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

// Lightweight state shape reused for updates (not exported to keep only function exports)
type ActionState = {
  success: boolean;
  error: string | null;
  fieldErrors?: Record<string, string[]>;
};

// Server action to update only the title of a gallery.
export async function updateGalleryTitleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const fieldErrors: Record<string, string[]> = {};

    const idRaw = raw.id ?? raw.gallery_id ?? raw.galleryId;
    const idNum =
      typeof idRaw === "string" && /^\d+$/.test(idRaw) ? Number(idRaw) : NaN;
    if (!Number.isInteger(idNum) || idNum <= 0) {
      fieldErrors.id = ["Valid numeric gallery id required"];
    }

    const titleRaw = (raw.title as string) ?? "";
    const title = titleRaw.trim();
    if (!title) {
      fieldErrors.title = ["Title is required"];
    } else if (title.length > 150) {
      fieldErrors.title = ["Title must be at most 150 characters"];
    }

    if (Object.keys(fieldErrors).length) {
      return { success: false, error: "Validation failed", fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("galleries")
      .update({ title })
      .eq("id", idNum);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/galleries");
    revalidatePath(`/dashboard/galleries/${idNum}`);
    // Public listing (if any)
    revalidatePath("/galleries");

    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

// Server action to update only the cover image of a gallery (can also clear it by submitting empty string)
export async function updateGalleryCoverImageAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const fieldErrors: Record<string, string[]> = {};

    // id parsing
    const idRaw = raw.id ?? raw.gallery_id ?? raw.galleryId;
    const idNum =
      typeof idRaw === "string" && /^\d+$/.test(idRaw) ? Number(idRaw) : NaN;
    if (!Number.isInteger(idNum) || idNum <= 0) {
      fieldErrors.id = ["Valid numeric gallery id required"];
    }

    // cover image normalization (allow clear)
    const coverRaw =
      (raw.cover_image as string) ?? (raw.coverImage as string) ?? "";
    const cover_image = coverRaw.trim() === "" ? null : coverRaw.trim();

    if (cover_image) {
      // basic validation: allow http(s) or storage key without whitespace
      if (/(\s)/.test(cover_image)) {
        fieldErrors.cover_image = ["Cover image must not contain whitespace"];
      }
    }

    if (Object.keys(fieldErrors).length) {
      return { success: false, error: "Validation failed", fieldErrors };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("galleries")
      .update({ cover_image })
      .eq("id", idNum);

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate dashboard & public listings (and generic galleries page)
    revalidatePath("/dashboard/galleries");
    revalidatePath("/galleries");

    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

// Server action to update the public status of a gallery.
// Simplified signature: pass the gallery id and desired boolean value.
export async function updateGalleryPublicStatusAction(
  galleryId: number,
  newIsPublic: boolean
): Promise<ActionState> {
  try {
    if (!Number.isInteger(galleryId) || galleryId <= 0) {
      return {
        success: false,
        error: "Valid positive integer galleryId required",
        fieldErrors: { id: ["Invalid gallery id"] },
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("galleries")
      .update({ is_public: newIsPublic })
      .eq("id", galleryId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/galleries");
    revalidatePath("/galleries");
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}
