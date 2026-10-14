// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const shares = sqliteTable('shares', { id: text('id').primaryKey(), deleteHash: text('delete_hash').notNull(), expires: integer('expires').notNull() });
export const limits = sqliteTable('share_limits', { id: text('id').primaryKey(), count: integer('count').notNull(), day: integer('day').notNull().default(0) });
