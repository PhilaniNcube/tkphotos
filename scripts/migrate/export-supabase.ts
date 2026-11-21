/**
 * Read every content table from the legacy Supabase project and write a single
 * JSON snapshot that `import-content.ts` can replay into Payload/Turso.
 *
 * Usage: pnpm migrate:data:export
 *
 * Read-only: this script never writes to Supabase.
 */
import fs from "node:fs/promises";
import path from "node:path";

type Row = Record<string, unknown>;

interface ExportFile {
  exportedAt: string;
  supabaseUrl: string;
  tables: Record<string, Row[]>;
}

const TABLES = [
  "galleries",
  "collections",
  "collection_galleries",
  "photos",
  "tags",
  "photo_tags",
] as const;

const PAGE_SIZE = 1000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function fetchAllRows(
  supabaseUrl: string,
  serviceRoleKey: string,
  table: string
): Promise<Row[]> {
  const rows: Row[] = [];
  let offset = 0;

  for (;;) {
    const url = new URL(`/rest/v1/${table}`, supabaseUrl);
    url.searchParams.set("select", "*");

    const response = await fetch(url, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Range-Unit": "items",
        Range: `${offset}-${offset + PAGE_SIZE - 1}`,
      },
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Supabase ${table} request failed (${response.status}): ${body}`
      );
    }

    const page = (await response.json()) as Row[];
    rows.push(...page);

    process.stdout.write(
      `\r  ${table}: ${rows.length} row${rows.length === 1 ? "" : "s"}`
    );

    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  process.stdout.write("\n");
  return rows;
}

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  console.log(`Exporting legacy content from ${supabaseUrl}\n`);

  const tables: Record<string, Row[]> = {};

  for (const table of TABLES) {
    tables[table] = await fetchAllRows(supabaseUrl, serviceRoleKey, table);
  }

  const outputDir = path.resolve("scripts/migrate/data");
  await fs.mkdir(outputDir, { recursive: true });

  const output: ExportFile = {
    exportedAt: new Date().toISOString(),
    supabaseUrl,
    tables,
  };

  const outputPath = path.join(outputDir, "supabase-export.json");
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(`\nWrote ${outputPath}`);
  console.log(
    Object.entries(tables)
      .map(([table, rows]) => `  ${table}: ${rows.length}`)
      .join("\n")
  );

  if (tables.photos.length === 0) {
    console.warn(
      "\nWarning: no photos were exported. The service-role key may be " +
        "missing or RLS is blocking the request."
    );
  }
}

main().catch((error) => {
  console.error("\nExport failed:", error);
  process.exitCode = 1;
});
