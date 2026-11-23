import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'editor';`)
  await db.run(sql`CREATE INDEX \`users_role_idx\` ON \`users\` (\`role\`);`)
  // Accounts that existed before roles were introduced keep full access.
  await db.run(sql`UPDATE \`users\` SET \`role\` = 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`users_role_idx\`;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
