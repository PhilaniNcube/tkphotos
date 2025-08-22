import probe from "probe-image-size";
import { createClient } from "../server";

interface UpdateResultSummary {
  total: number;
  processed: number;
  updated: number;
  skipped: number; // already had width/height
  errors: number;
  errorSamples: { id: string; reason: string }[];
  durationMs: number;
}

/**
 * Fetch all photos and ensure metadata has width & height.
 * Uses probe-image-size to avoid downloading full file.
 * Only updates rows where width/height missing or not numbers unless force=true.
 * Batches updates to avoid large single upsert payloads.
 */
export async function updateAllPhotoMetadata(
  opts: { force?: boolean; concurrency?: number } = {}
): Promise<UpdateResultSummary> {
  const force = !!opts.force;
  const concurrency = Math.min(Math.max(opts.concurrency ?? 4, 1), 12);
  const started = Date.now();
  const supabase = await createClient();

  // Fetch all photos (could paginate if table large)
  const { data: photos, error } = await supabase
    .from("photos")
    .select("id, storage_key, metadata");
  if (error || !photos) {
    throw new Error("Failed to fetch photos: " + (error?.message || "unknown"));
  }

  let processed = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const errorSamples: { id: string; reason: string }[] = [];

  // Simple promise pool
  const inFlight: Promise<void>[] = [];
  async function runWithLimit(task: () => Promise<void>) {
    if (inFlight.length >= concurrency) {
      await Promise.race(inFlight);
    }
    const p = task().finally(() => {
      const idx = inFlight.indexOf(p as any);
      if (idx >= 0) inFlight.splice(idx, 1);
    });
    inFlight.push(p);
  }

  for (const p of photos) {
    processed++;
    try {
      const existing = (p as any).metadata as any;
      const hasDimensions =
        existing &&
        typeof existing === "object" &&
        typeof existing.width === "number" &&
        typeof existing.height === "number";
      if (hasDimensions && !force) {
        skipped++;
        continue;
      }
      const url = (p as any).storage_key as string;
      if (!url || !/^https?:\/\//i.test(url)) {
        skipped++;
        continue;
      }
      const result = await probe(url);
      if (!result.width || !result.height) {
        skipped++;
        continue;
      }
      const newMeta = {
        ...(existing || {}),
        width: result.width,
        height: result.height,
        type: result.type,
      };
      await runWithLimit(async () => {
        const { error: upErr } = await supabase
          .from("photos")
          .update({ metadata: newMeta })
          .eq("id", (p as any).id);
        if (upErr) {
          errors++;
          if (errorSamples.length < 10)
            errorSamples.push({ id: (p as any).id, reason: upErr.message });
        } else {
          updated++;
        }
      });
    } catch (e: any) {
      errors++;
      if (errorSamples.length < 10) {
        errorSamples.push({
          id: (p as any).id,
          reason: e?.message || "unknown error",
        });
      }
    }
  }
  // wait remaining
  await Promise.all(inFlight);

  return {
    total: photos.length,
    processed,
    updated,
    skipped,
    errors,
    errorSamples,
    durationMs: Date.now() - started,
  };
}
