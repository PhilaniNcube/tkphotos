/**
 * Seed the Payload `services` collection with the canonical bookable packages.
 *
 * Usage:
 *   pnpm seed:services
 *   pnpm seed:services -- --update-existing
 */
import { getPayload } from "payload";

import { DEFAULT_SERVICES } from "../lib/services-data";
import config from "../payload.config";

const updateExisting = new Set(process.argv.slice(2)).has("--update-existing");

/**
 * Galleries whose photos best represent each service. The seeder picks a
 * portrait image from the first gallery that has one, preferring images
 * flagged as featured in the media collection.
 */
const SERVICE_IMAGE_GALLERIES: Record<string, string[]> = {
  anniversary_wedding: ["white-wedding", "traditional-weddings"],
  corporate_event: [
    "government-events",
    "vice-chancellor-s-breakfast",
    "youth-quake-national-conference",
  ],
  entertainment_event: ["music-in-the-snow", "dj-buja", "satla"],
  sport: [
    "chippa-vs-ts-galaxy",
    "hollywoodbets-super-league",
    "varsity-cup-2025",
    "varsity-shield",
    "sailing",
  ],
  branding: ["swazi-luxe-opening", "portraits"],
  matric_dance: ["matric-dance"],
  social_media_mgmt: ["swazi-luxe-opening", "portraits", "government-events"],
  studio: ["portraits"],
  graphic_poster: ["swazi-luxe-opening", "portraits"],
};

type MediaCandidate = {
  id: number;
  width?: number | null;
  height?: number | null;
  isFeatured?: boolean | null;
};

function isPortrait(media: MediaCandidate) {
  return (
    typeof media.width === "number" &&
    typeof media.height === "number" &&
    media.height > media.width
  );
}

function pickImage(
  candidates: MediaCandidate[],
  usedImageIds: Set<number>
): MediaCandidate | undefined {
  const available = candidates.filter(
    (media) => !usedImageIds.has(media.id)
  );
  const pool = available.length > 0 ? available : candidates;

  return (
    pool.find((media) => media.isFeatured && isPortrait(media)) ??
    pool.find(isPortrait) ??
    pool.find((media) => media.isFeatured) ??
    pool[0]
  );
}

async function main() {
  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  try {
    // Load the media library once so every package can be matched without
    // issuing a query per service.
    const [mediaResult, galleryResult] = await Promise.all([
      payload.find({
        collection: "media",
        limit: 1000,
        depth: 0,
        sort: "-createdAt",
        overrideAccess: true,
      }),
      payload.find({
        collection: "galleries",
        limit: 200,
        depth: 0,
        overrideAccess: true,
      }),
    ]);

    if (mediaResult.docs.length === 0) {
      throw new Error(
        "The media collection is empty. Upload service photos before seeding."
      );
    }

    const galleryIdBySlug = new Map<string, number>(
      galleryResult.docs.map(
        (gallery): [string, number] => [gallery.slug, gallery.id]
      )
    );
    const mediaByGallery = new Map<number, MediaCandidate[]>();

    for (const media of mediaResult.docs) {
      const galleryId =
        typeof media.gallery === "number" ? media.gallery : media.gallery?.id;
      if (typeof galleryId !== "number") continue;

      const bucket = mediaByGallery.get(galleryId) ?? [];
      bucket.push(media);
      mediaByGallery.set(galleryId, bucket);
    }

    const allMedia = mediaResult.docs as MediaCandidate[];
    const usedImageIds = new Set<number>();

    function resolveFeaturedImage(serviceSlug: string) {
      for (const gallerySlug of SERVICE_IMAGE_GALLERIES[serviceSlug] ?? []) {
        const galleryId = galleryIdBySlug.get(gallerySlug);
        if (typeof galleryId !== "number") continue;

        const match = pickImage(
          mediaByGallery.get(galleryId) ?? [],
          usedImageIds
        );
        if (match) {
          usedImageIds.add(match.id);
          return { media: match, gallerySlug };
        }
      }

      // Every service still gets an image, even when its preferred galleries
      // are empty.
      const fallback = pickImage(allMedia, usedImageIds);
      if (fallback) usedImageIds.add(fallback.id);
      return fallback ? { media: fallback, gallerySlug: "(fallback)" } : null;
    }

    for (const service of DEFAULT_SERVICES) {
      const existing = await payload.find({
        collection: "services",
        where: { slug: { equals: service.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });

      const image = resolveFeaturedImage(service.slug);
      if (!image) {
        throw new Error(
          `No media available to use as the image for ${service.slug}`
        );
      }

      const data = {
        title: service.title,
        slug: service.slug,
        category: service.category,
        badge: service.badge,
        description: service.description,
        featuredImage: image.media.id,
        rateLabel: service.rateLabel,
        rate: service.rate,
        icon: service.icon,
        featured: service.featured,
        isActive: service.isActive,
        sortOrder: service.sortOrder,
      };

      console.log(
        `  ${service.slug} -> media ${image.media.id} (gallery: ${image.gallerySlug})`
      );

      const existingDoc = existing.docs[0];
      if (existingDoc) {
        if (updateExisting) {
          await payload.update({
            collection: "services",
            id: existingDoc.id,
            data,
            overrideAccess: true,
            context: { disableRevalidate: true },
          });
          updated++;
        } else {
          skipped++;
        }
      } else {
        await payload.create({
          collection: "services",
          data,
          overrideAccess: true,
          context: { disableRevalidate: true },
        });
        created++;
      }
    }

    const persisted = await payload.find({
      collection: "services",
      sort: "sortOrder",
      limit: 100,
      depth: 0,
      overrideAccess: true,
    });

    console.log(
      `Services seed complete: created=${created}, updated=${updated}, skipped=${skipped}, total=${persisted.totalDocs}`
    );
    for (const doc of persisted.docs) {
      console.log(
        `  [${doc.sortOrder}] ${doc.slug} — ${doc.title} (${doc.rate}) active=${doc.isActive} image=${doc.featuredImage ?? "missing"}`
      );
    }
  } finally {
    try {
      await payload.destroy();
    } catch {
      // libSQL on Node 26/Windows can error during teardown after completing writes.
    }
  }
}

main().catch((error) => {
  console.error("Failed to seed services:", error);
  process.exitCode = 1;
});
