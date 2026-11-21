/**
 * Development helper: remove media documents (and their R2 objects) so the
 * migration can be replayed with a clean upload pipeline.
 *
 * Usage:
 *   node --import @swc-node/register/esm-register scripts/migrate/reset-media.ts --all
 */
import fs from "node:fs/promises";
import path from "node:path";

import { getPayload } from "payload";

import config from "../../payload.config";

const MAP_PATH = path.resolve("scripts/migrate/data/migration-map.json");

async function main() {
  if (!process.argv.includes("--all")) {
    throw new Error("Refusing to delete media without the --all flag");
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "media",
    limit: 10_000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });

  console.log(`Deleting ${result.docs.length} media documents...`);
  for (const doc of result.docs) {
    await payload.delete({
      collection: "media",
      id: doc.id,
      overrideAccess: true,
    });
    process.stdout.write(`\r  deleted ${doc.id}`);
  }
  process.stdout.write("\n");

  const map = await fs
    .readFile(MAP_PATH, "utf8")
    .then((raw) => JSON.parse(raw))
    .catch(() => null);

  if (map) {
    map.media = {};
    map.mediaByLegacyUrl = {};
    map.timestamps.media = {};
    map.failures = [];
    await fs.writeFile(MAP_PATH, JSON.stringify(map, null, 2), "utf8");
    console.log("Reset media entries in migration-map.json");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
