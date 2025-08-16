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
      is_public:
        raw.is_public === "on" || raw.is_public === "true" ? true : false,
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
