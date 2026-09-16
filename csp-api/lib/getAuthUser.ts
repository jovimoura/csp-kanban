import { FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { UserRow, usersTable } from '../db/schema';

/**
 * Loads the authenticated user row using the userId set by the auth hook.
 * Returns null when the user no longer exists.
 */
export async function getAuthUser(request: FastifyRequest): Promise<UserRow | null> {
  if (!request.userId) {
    return null;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, request.userId))
    .limit(1);

  return user ?? null;
}
