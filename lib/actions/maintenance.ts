"use server";

import { revalidatePath } from "next/cache";
import { updateAllPhotoMetadata } from "../maintenance/update-photo-metadata";
import { createClient } from "../server";

// Guard to ensure caller is admin.
async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("is_admin");
    return !!data;
  } catch {
    return false;
  }
}

export interface UpdateMetadataResult {
  ok: boolean;
  updated?: number;
  skipped?: number;
  errors?: number;
  total?: number;
  durationMs?: number;
  message?: string;
}

export async function updatePhotoMetadataAction(
  _prev: any,
  formData: FormData
): Promise<UpdateMetadataResult> {
  const force =
    formData.get("force") === "on" || formData.get("force") === "true";
  if (!(await isAdmin())) {
    return { ok: false, message: "Forbidden" };
  }
  try {
    const summary = await updateAllPhotoMetadata({ force });
    // Revalidate photos page (and potentially galleries if they show dimensions later)
    revalidatePath("/dashboard/photos");
    return { ok: true, ...summary };
  } catch (e: any) {
    return { ok: false, message: e?.message || "Failed" };
  }
}
