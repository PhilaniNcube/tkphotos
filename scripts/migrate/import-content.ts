/**
 * Replay the Supabase snapshot into Payload (Turso) and copy every UploadThing
 * image into Cloudflare R2 through Payload's upload pipeline.
 *
 * Usage:
 *   pnpm migrate:data:import                     # full run
 *   pnpm migrate:data:import -- --skip-media     # metadata only
 *   pnpm migrate:data:import -- --limit-media=3  # smoke-test 3 images
 *   pnpm migrate:data:import -- --update-existing
 *
 * Safe to re-run: records are matched on `legacyId` / `legacyUrl`, so completed
 * items are skipped. Failures are collected and written to the migration report.
 */
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { createClient } from "@libsql/client";
import { getPayload } from "payload";

import config from "../../payload.config";

type Row = Record<string, any>;

interface Snapshot {
  exportedAt: string;
  tables: {
    galleries: Row[];
    collections: Row[];
    collection_galleries: Row[];
    photos: Row[];
    tags: Row[];
    photo_tags: Row[];
  };
}

interface MigrationMap {
  galleries: Record<string, number>;
  collections: Record<string, number>;
  tags: Record<string, number>;
  media: Record<string, number>;
  mediaByLegacyUrl: Record<string, number>;
  timestamps: {
    galleries: Record<string, { created_at: string; updated_at?: string }>;
    collections: Record<string, { created_at: string }>;
    tags: Record<string, { created_at?: string }>;
    media: Record<string, { created_at: string }>;
  };
  failures: { stage: string; legacyId?: string; url?: string; error: string }[];
}

const args = new Set(process.argv.slice(2));
const limitMediaArg = process.argv.find((arg) => arg.startsWith("--limit-media="));
const limitMedia = limitMediaArg ? Number(limitMediaArg.split("=")[1]) : Infinity;
const skipMedia = args.has("--skip-media");
const skipCovers = args.has("--skip-covers");
const skipTimestamps = args.has("--skip-timestamps");
const updateExisting = args.has("--update-existing");
const concurrencyArg = process.argv.find((arg) => arg.startsWith("--concurrency="));
const concurrency = Math.max(
  1,
  Math.min(6, concurrencyArg ? Number(concurrencyArg.split("=")[1]) : 3)
);

const DATA_DIR = path.resolve("scripts/migrate/data");
const SNAPSHOT_PATH = path.join(DATA_DIR, "supabase-export.json");
const MAP_PATH = path.join(DATA_DIR, "migration-map.json");
const REPORT_PATH = path.join(DATA_DIR, "migration-report.json");

/**
 * Images referenced directly by the site (hero / about portrait) that were
 * never stored in the Supabase photos table. They are imported once so the
 * frontend can stop linking to UploadThing entirely.
 */
const EXTRA_ASSETS = [
  {
    url: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvZFXisQnCMRxelq86Yd95OruyTwQtaIKSNHzB",
    filename: "about-thandikaya.jpg",
    alt: "Portrait of Thandikaya Matokazi, professional photographer",
  },
  {
    url: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvs6r8S60MxNnfSJ1LF2w7eUsGP9R4QBmzIkbg",
    filename: "hero-nature.jpg",
    alt: "Nature photography by TK Media",
  },
];

const emptyMap = (): MigrationMap => ({
  galleries: {},
  collections: {},
  tags: {},
  media: {},
  mediaByLegacyUrl: {},
  timestamps: { galleries: {}, collections: {}, tags: {}, media: {} },
  failures: [],
});

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, "utf8")) as T;
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

function safeFilename(name: string): string {
  const cleaned = name
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || `photo-${randomUUID()}.jpg`;
}

function iso(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function dayIso(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return iso(`${value.slice(0, 10)}T00:00:00.000Z`);
}

function altFrom(photo: Row): string {
  if (photo.caption) return String(photo.caption).slice(0, 200);
  const filename = String(photo.filename || "Photo");
  return filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 200);
}

async function downloadImage(
  url: string
): Promise<{ data: Buffer; mimetype: string; size: number }> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(180_000),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = Buffer.from(await response.arrayBuffer());
      return {
        data,
        mimetype:
          response.headers.get("content-type")?.split(";")[0] || "image/jpeg",
        size: data.length,
      };
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_500));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function main() {
  const payload = await getPayload({ config });

  if (!(await fs.stat(SNAPSHOT_PATH).catch(() => null))) {
    throw new Error(
      `Missing ${SNAPSHOT_PATH}. Run \`pnpm migrate:data:export\` first.`
    );
  }

  const snapshot = await readJson<Snapshot>(SNAPSHOT_PATH);
  const map: MigrationMap = (await fs
    .stat(MAP_PATH)
    .then(() => readJson<MigrationMap>(MAP_PATH))
    .catch(() => emptyMap())) as MigrationMap;
  map.timestamps ??= emptyMap().timestamps;

  const r2Configured = Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  );
  if (!skipMedia && !r2Configured) {
    throw new Error(
      "R2 is not fully configured. Refusing to import images to local disk. " +
        "Set the R2_* variables and NEXT_PUBLIC_R2_PUBLIC_URL, or pass --skip-media."
    );
  }

  console.log(
    `Importing snapshot exported ${snapshot.exportedAt}` +
      ` (${snapshot.tables.photos.length} photos, ` +
      `${snapshot.tables.galleries.length} galleries, ` +
      `${snapshot.tables.collections.length} collections)` +
      `${skipMedia ? " — media skipped" : ""}\n`
  );

  const findOne = async (collection: string, legacyId: unknown) => {
    if (legacyId === null || legacyId === undefined) return null;
    const result = await payload.find({
      collection: collection as any,
      where: { legacyId: { equals: legacyId } } as any,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs[0] as Row | undefined;
  };

  const clearFailure = (stage: string, legacyId: string) => {
    map.failures = map.failures.filter(
      (failure) =>
        !(failure.stage === stage && failure.legacyId === legacyId)
    );
  };

  // ---------------------------------------------------------------- tags
  for (const tag of snapshot.tables.tags) {
    try {
      const existing = await findOne("tags", tag.id);
      if (existing) {
        map.tags[String(tag.id)] = Number(existing.id);
        continue;
      }
      const created = await payload.create({
        collection: "tags",
        data: { name: tag.name, legacyId: Number(tag.id) } as any,
        overrideAccess: true,
      });
      map.tags[String(tag.id)] = Number(created.id);
      clearFailure("tags", String(tag.id));
      console.log(`  tag  ${tag.name} -> ${created.id}`);
    } catch (error) {
      map.failures.push({
        stage: "tags",
        legacyId: String(tag.id),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ----------------------------------------------------------- galleries
  for (const gallery of snapshot.tables.galleries) {
    try {
      const existing = await findOne("galleries", gallery.id);
      const data: Row = {
        title: gallery.title,
        slug: gallery.slug,
        description: gallery.description ?? null,
        accessKey: gallery.access_key ?? null,
        isPublic: Boolean(gallery.is_public),
        eventDate: dayIso(gallery.event_date) ?? null,
        legacyId: Number(gallery.id),
      };

      if (existing) {
        map.galleries[String(gallery.id)] = Number(existing.id);
        if (updateExisting) {
          await payload.update({
            collection: "galleries",
            id: existing.id,
            data,
            overrideAccess: true,
          });
        }
      } else {
        const created = await payload.create({
          collection: "galleries",
          data: data as any,
          overrideAccess: true,
        });
        map.galleries[String(gallery.id)] = Number(created.id);
      }

      map.timestamps.galleries[String(gallery.id)] = {
        created_at: gallery.created_at,
      };
      clearFailure("galleries", String(gallery.id));
    } catch (error) {
      map.failures.push({
        stage: "galleries",
        legacyId: String(gallery.id),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  console.log(`  galleries: ${Object.keys(map.galleries).length}`);

  // --------------------------------------------------------- collections
  for (const collection of snapshot.tables.collections) {
    try {
      const existing = await findOne("photo-collections", collection.id);
      const data: Row = {
        name: collection.name,
        slug: collection.slug,
        description: collection.description ?? null,
        legacyId: Number(collection.id),
      };

      if (existing) {
        map.collections[String(collection.id)] = Number(existing.id);
        if (updateExisting) {
          await payload.update({
            collection: "photo-collections",
            id: existing.id,
            data,
            overrideAccess: true,
          });
        }
      } else {
        const created = await payload.create({
          collection: "photo-collections",
          data: data as any,
          overrideAccess: true,
        });
        map.collections[String(collection.id)] = Number(created.id);
      }

      map.timestamps.collections[String(collection.id)] = {
        created_at: collection.created_at,
      };
      clearFailure("collections", String(collection.id));
    } catch (error) {
      map.failures.push({
        stage: "collections",
        legacyId: String(collection.id),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  console.log(`  collections: ${Object.keys(map.collections).length}`);

  await writeJson(MAP_PATH, map);

  // -------------------------------------------------------------- media
  const tagsByPhoto = new Map<string, number[]>();
  for (const link of snapshot.tables.photo_tags) {
    const tagId = map.tags[String(link.tag_id)];
    if (!tagId) continue;
    const list = tagsByPhoto.get(String(link.photo_id)) ?? [];
    list.push(tagId);
    tagsByPhoto.set(String(link.photo_id), list);
  }

  const photos = snapshot.tables.photos;
  const mediaTargets = skipMedia
    ? []
    : photos.slice(0, Number.isFinite(limitMedia) ? limitMedia : photos.length);

  // Payload normally suffixes duplicate uploads, but concurrent creates can
  // race on the filename unique index. Reserve names in memory before upload.
  const usedFilenames = new Set<string>();
  if (!skipMedia) {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const batch = await payload.find({
        collection: "media",
        limit: 100,
        page,
        depth: 0,
        overrideAccess: true,
        select: { filename: true } as any,
      });
      for (const doc of batch.docs) {
        const filename = (doc as { filename?: string | null }).filename;
        if (filename) usedFilenames.add(filename);
      }
      hasMore = batch.hasNextPage;
      page++;
    }
  }

  const reserveFilename = (original: string): string => {
    if (!usedFilenames.has(original)) {
      usedFilenames.add(original);
      return original;
    }

    const extension = path.extname(original);
    const stem = extension
      ? original.slice(0, -extension.length)
      : original;

    let counter = 1;
    for (;;) {
      const candidate = `${stem}-${counter}${extension}`;
      if (!usedFilenames.has(candidate)) {
        usedFilenames.add(candidate);
        return candidate;
      }
      counter++;
    }
  };

  let completed = 0;
  let skipped = 0;
  let failed = 0;

  if (!skipMedia) {
    console.log(`\nUploading ${mediaTargets.length} images to R2...`);

    const queue = [...mediaTargets];
    const total = queue.length;

    const worker = async () => {
      for (;;) {
        const photo = queue.shift();
        if (!photo) return;

        const legacyId = String(photo.id);
        try {
          const existing =
            (map.media[legacyId] &&
              (await payload.findByID({
                collection: "media",
                id: map.media[legacyId],
                depth: 0,
                overrideAccess: true,
              }))) ||
            (await findOne("media", legacyId));

          if (existing) {
            map.media[legacyId] = Number(existing.id);
            map.mediaByLegacyUrl[String(photo.storage_key)] = Number(
              existing.id
            );
            clearFailure("media", legacyId);
            skipped++;
            completed++;
            process.stdout.write(
              `\r  media ${completed}/${total} (skipped ${skipped}, failed ${failed})`
            );
            continue;
          }

          const galleryId = map.galleries[String(photo.gallery_id)];
          if (!galleryId) {
            throw new Error(
              `Gallery ${photo.gallery_id} has not been imported yet`
            );
          }

          const filename = reserveFilename(
            safeFilename(String(photo.filename || "photo.jpg"))
          );
          const download = await downloadImage(String(photo.storage_key));

          const created = await payload.create({
            collection: "media",
            data: {
              alt: altFrom(photo),
              caption: photo.caption ?? null,
              gallery: galleryId,
              tags: tagsByPhoto.get(legacyId) ?? [],
              isFeatured: Boolean(photo.is_featured),
              legacyId,
              legacyUrl: String(photo.storage_key),
            } as any,
            file: {
              data: download.data,
              mimetype: download.mimetype,
              name: filename,
              size: download.size,
            },
            overrideAccess: true,
          });

          map.media[legacyId] = Number(created.id);
          map.mediaByLegacyUrl[String(photo.storage_key)] = Number(created.id);
          map.timestamps.media[legacyId] = { created_at: photo.created_at };
          clearFailure("media", legacyId);
          completed++;
          process.stdout.write(
            `\r  media ${completed}/${total} (skipped ${skipped}, failed ${failed})`
          );
        } catch (error) {
          failed++;
          completed++;
          map.failures.push({
            stage: "media",
            legacyId,
            url: String(photo.storage_key),
            error: error instanceof Error ? error.message : String(error),
          });
          process.stdout.write(
            `\r  media ${completed}/${total} (skipped ${skipped}, failed ${failed})`
          );
        }

        // Persist progress regularly so an interrupted run can resume.
        if (completed % 10 === 0) {
          await writeJson(MAP_PATH, map);
        }
      }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    process.stdout.write("\n");
    await writeJson(MAP_PATH, map);
  }

  // ------------------------------------------------ gallery cover images
  if (!skipMedia && !skipCovers) {
    const covers = snapshot.tables.galleries.filter(
      (gallery) => gallery.cover_image
    );
    let coverFailures = 0;

    for (const gallery of covers) {
      const galleryId = map.galleries[String(gallery.id)];
      if (!galleryId) continue;

      const coverUrl = String(gallery.cover_image);
      let mediaId = map.mediaByLegacyUrl[coverUrl];

      if (!mediaId) {
        try {
          const existing = await payload.find({
            collection: "media",
            where: { legacyUrl: { equals: coverUrl } } as any,
            limit: 1,
            depth: 0,
            overrideAccess: true,
          });
          if (existing.docs[0]) {
            mediaId = Number(existing.docs[0].id);
          }
        } catch {
          // fall through to download
        }
      }

      if (!mediaId) {
        try {
          const filename = reserveFilename(
            safeFilename(`cover-${gallery.slug || gallery.id}.jpg`)
          );
          const download = await downloadImage(coverUrl);
          const created = await payload.create({
            collection: "media",
            data: {
              alt: `Cover image for ${gallery.title}`,
              legacyUrl: coverUrl,
            } as any,
            file: {
              data: download.data,
              mimetype: download.mimetype,
              name: filename,
              size: download.size,
            },
            overrideAccess: true,
          });
          mediaId = Number(created.id);
        } catch (error) {
          coverFailures++;
          map.failures.push({
            stage: "cover",
            legacyId: String(gallery.id),
            url: coverUrl,
            error: error instanceof Error ? error.message : String(error),
          });
          continue;
        }
      }

      map.mediaByLegacyUrl[coverUrl] = mediaId;

      try {
        await payload.update({
          collection: "galleries",
          id: galleryId,
          data: { coverImage: mediaId } as any,
          overrideAccess: true,
        });
        clearFailure("cover", String(gallery.id));
        clearFailure("cover-link", String(gallery.id));
      } catch (error) {
        coverFailures++;
        map.failures.push({
          stage: "cover-link",
          legacyId: String(gallery.id),
          url: coverUrl,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (covers.length) {
      console.log(
        `  gallery covers linked: ${covers.length - coverFailures}/${
          covers.length
        }`
      );
    }
  }

  // ------------------------------------------------ extra site images
  if (!skipMedia) {
    let importedExtras = 0;
    for (const asset of EXTRA_ASSETS) {
      try {
        const existing = await payload.find({
          collection: "media",
          where: { legacyUrl: { equals: asset.url } } as any,
          limit: 1,
          depth: 0,
          overrideAccess: true,
        });
        if (existing.docs[0]) {
          map.mediaByLegacyUrl[asset.url] = Number(existing.docs[0].id);
          continue;
        }

        const filename = reserveFilename(safeFilename(asset.filename));
        const download = await downloadImage(asset.url);
        const created = await payload.create({
          collection: "media",
          data: {
            alt: asset.alt,
            legacyUrl: asset.url,
          } as any,
          file: {
            data: download.data,
            mimetype: download.mimetype,
            name: filename,
            size: download.size,
          },
          overrideAccess: true,
        });
        map.mediaByLegacyUrl[asset.url] = Number(created.id);
        importedExtras++;
      } catch (error) {
        map.failures.push({
          stage: "extra-asset",
          url: asset.url,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    if (importedExtras) {
      console.log(`  extra site images: ${importedExtras}`);
    }
  }

  // -------------------------------------- collection <-> gallery links
  const galleriesByCollection = new Map<number, number[]>();
  for (const link of snapshot.tables.collection_galleries) {
    const collectionId = map.collections[String(link.collection_id)];
    const galleryId = map.galleries[String(link.gallery_id)];
    if (!collectionId || !galleryId) continue;
    const list = galleriesByCollection.get(collectionId) ?? [];
    list.push(galleryId);
    galleriesByCollection.set(collectionId, list);
  }

  for (const [collectionId, galleryIds] of galleriesByCollection) {
    try {
      await payload.update({
        collection: "photo-collections",
        id: collectionId,
        data: { galleries: galleryIds } as any,
        overrideAccess: true,
      });
      clearFailure("collection-links", String(collectionId));
    } catch (error) {
      map.failures.push({
        stage: "collection-links",
        legacyId: String(collectionId),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  console.log(`  collection links: ${galleriesByCollection.size}`);

  // ------------------------------------------------- preserve timestamps
  const dbUrl = process.env.TURSO_DATABASE_URL;
  if (dbUrl && !skipTimestamps) {
    const db = createClient({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const restore = async (
      table: string,
      id: number,
      createdAt: string,
      updatedAt?: string
    ) => {
      const created = iso(createdAt);
      if (!created) return;
      const updated = iso(updatedAt) ?? created;
      await db.execute({
        sql: `UPDATE ${table} SET created_at = ?, updated_at = ? WHERE id = ?`,
        args: [created, updated, id],
      });
    };

    for (const [legacyId, id] of Object.entries(map.galleries)) {
      const ts = map.timestamps.galleries[legacyId];
      if (ts) await restore("galleries", id, ts.created_at, ts.updated_at);
    }
    for (const [legacyId, id] of Object.entries(map.collections)) {
      const ts = map.timestamps.collections[legacyId];
      if (ts) await restore("photo_collections", id, ts.created_at);
    }
    for (const [legacyId, id] of Object.entries(map.media)) {
      const ts = map.timestamps.media[legacyId];
      if (ts) await restore("media", id, ts.created_at);
    }

    db.close();
  }

  // ------------------------------------------------------------- report
  await writeJson(MAP_PATH, map);
  await writeJson(REPORT_PATH, {
    finishedAt: new Date().toISOString(),
    media: {
      imported: Object.keys(map.media).length,
      skipped,
      failed,
    },
    failures: map.failures,
  });

  console.log("\nMigration summary");
  console.log(`  galleries:   ${Object.keys(map.galleries).length}`);
  console.log(`  collections: ${Object.keys(map.collections).length}`);
  console.log(`  tags:        ${Object.keys(map.tags).length}`);
  console.log(`  media:       ${Object.keys(map.media).length}`);
  console.log(`  failures:    ${map.failures.length}`);
  console.log(`\nReport: ${REPORT_PATH}`);

  if (map.failures.length) {
    console.log("\nFirst failures:");
    for (const failure of map.failures.slice(0, 10)) {
      console.log(
        `  [${failure.stage}] ${failure.legacyId ?? failure.url}: ${failure.error}`
      );
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("\nImport failed:", error);
  process.exitCode = 1;
});
