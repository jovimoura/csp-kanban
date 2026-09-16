import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const userProfile = pgEnum('user_profile', ['admin', 'developer', 'agile']);

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  profile: userProfile('profile').notNull().default('developer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const taskStatus = pgEnum('task_status', [
  'not_started',
  'in_progress',
  'paused',
  'homolog',
  'prod',
]);

export const tasksTable = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  status: taskStatus('status').notNull().default('not_started'),
  description: text('description').notNull(),
  dueDate: timestamp('due_date').notNull(),
  assignedTo: uuid('assigned_to')
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserRow = typeof usersTable.$inferSelect;
export type TaskRow = typeof tasksTable.$inferSelect;
