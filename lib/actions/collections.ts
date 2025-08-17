"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../server";
import {
  createCollectionSchema,
  CreateCollectionState,
  initialCreateCollectionState,
  initialLinkGalleryState,
  linkGallerySchema,
  LinkGalleryState,
} from "../schema";
import { z } from "zod";

// Server action for creating a collection.
// Expects FormData with fields: name (string), slug (string), description (optional).
export async function createCollectionAction(
  _prevState: CreateCollectionState = initialCreateCollectionState,
  formData: FormData
): Promise<CreateCollectionState> {
  try {
    const raw = Object.fromEntries(formData.entries());

    const normalized = {
      name: (raw.name as string) ?? "",
      slug: (raw.slug as string) ?? "",
      description: raw.description ? String(raw.description) : null,
    };

    const parsed = createCollectionSchema.safeParse(normalized);
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
    const { error } = await supabase.from("collections").insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Revalidate dashboard collections listing page.
    revalidatePath("/dashboard/collections");
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

export async function addGalleryToCollectionAction(
  _prev: LinkGalleryState = initialLinkGalleryState,
  formData: FormData
): Promise<LinkGalleryState> {
  try {
    // React Server Actions inject internal hidden fields (e.g. $ACTION_REF_1, $ACTION_KEY)
    // that cause Zod .strict() schemas to report "Unrecognized keys".
    // Whitelist only the fields we expect.
    const rawCollectionId = formData.get("collection_id");
    const rawGalleryId = formData.get("gallery_id");
    const candidate: Record<string, unknown> = {};
    if (rawCollectionId != null)
      candidate.collection_id = String(rawCollectionId);
    if (rawGalleryId != null) candidate.gallery_id = String(rawGalleryId);

    const parsed = linkGallerySchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        fieldErrors[key] = fieldErrors[key] || [];
        fieldErrors[key].push(issue.message);
      }
      return { success: false, error: "Validation failed", fieldErrors };
    }
    const { collection_id, gallery_id } = parsed.data;
    const supabase = await createClient();

    // Optional: check existence of collection & gallery (lightweight select one column)
    const [{ data: coll, error: collErr }, { data: gal, error: galErr }] =
      await Promise.all([
        supabase
          .from("collections")
          .select("id")
          .eq("id", collection_id)
          .maybeSingle(),
        supabase
          .from("galleries")
          .select("id")
          .eq("id", gallery_id)
          .maybeSingle(),
      ]);
    if (collErr || !coll) {
      console.error("Collection not found");
      return { success: false, error: "Collection not found" };
    }
    if (galErr || !gal) {
      console.error("Gallery not found");
      return { success: false, error: "Gallery not found" };
    }

    // Prevent duplicates
    const { data: existing, error: existErr } = await supabase
      .from("collection_galleries")
      .select("collection_id")
      .eq("collection_id", collection_id)
      .eq("gallery_id", gallery_id)
      .maybeSingle();
    if (existErr && existErr.code !== "PGRST116") {
      // PGRST116: No rows found for maybeSingle
      return { success: false, error: existErr.message };
    }
    if (existing) {
      console.error("Gallery already in collection");
      return { success: false, error: "Gallery already in collection" };
    }

    const { error: insertErr } = await supabase
      .from("collection_galleries")
      .insert({ collection_id, gallery_id });
    if (insertErr) {
      console.error("Failed to add gallery to collection");
      return { success: false, error: insertErr.message };
    }

    revalidatePath(`/dashboard/collections/${collection_id}`);
    return { success: true, error: null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}
