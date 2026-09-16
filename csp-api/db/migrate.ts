import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

function migrationDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      'Set DATABASE_URL (or DATABASE_URL_UNPOOLED for Neon migrations) in the environment.',
    );
  }

  return url;
}

const sql = neon(migrationDatabaseUrl());
const db = drizzle(sql);

try {
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations applied successfully.');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
