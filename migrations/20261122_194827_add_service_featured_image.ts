import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`services\` ADD \`featured_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`services_featured_image_idx\` ON \`services\` (\`featured_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`category\` text DEFAULT 'events' NOT NULL,
  	\`badge\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`rate_label\` text DEFAULT 'Rate Range' NOT NULL,
  	\`rate\` text NOT NULL,
  	\`icon\` text DEFAULT 'camera' NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`is_active\` integer DEFAULT true,
  	\`sort_order\` numeric DEFAULT 100 NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_services\`("id", "title", "slug", "category", "badge", "description", "rate_label", "rate", "icon", "featured", "is_active", "sort_order", "updated_at", "created_at") SELECT "id", "title", "slug", "category", "badge", "description", "rate_label", "rate", "icon", "featured", "is_active", "sort_order", "updated_at", "created_at" FROM \`services\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_category_idx\` ON \`services\` (\`category\`);`)
  await db.run(sql`CREATE INDEX \`services_is_active_idx\` ON \`services\` (\`is_active\`);`)
  await db.run(sql`CREATE INDEX \`services_sort_order_idx\` ON \`services\` (\`sort_order\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
}
