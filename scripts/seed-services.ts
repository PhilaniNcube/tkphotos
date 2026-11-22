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

async function main() {
  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  try {
    for (const service of DEFAULT_SERVICES) {
      const existing = await payload.find({
        collection: "services",
        where: { slug: { equals: service.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });

      const data = {
        title: service.title,
        slug: service.slug,
        category: service.category,
        badge: service.badge,
        description: service.description,
        rateLabel: service.rateLabel,
        rate: service.rate,
        icon: service.icon,
        featured: service.featured,
        isActive: service.isActive,
        sortOrder: service.sortOrder,
      };

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
        `  [${doc.sortOrder}] ${doc.slug} — ${doc.title} (${doc.rate}) active=${doc.isActive}`
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
