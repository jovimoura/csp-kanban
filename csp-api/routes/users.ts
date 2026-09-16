import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { asc, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { authenticate } from '../lib/authHook';
import { getAuthUser } from '../lib/getAuthUser';
import { badRequest, conflict, created, forbidden, ok, unauthorized } from '../lib/http';
import { can } from '../lib/permissions';
import { emailFromName } from '../lib/emailFromName';
import { serializeUser } from '../lib/serializers';

const listQuerySchema = z.object({
  assignable: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => value === 'true'),
});

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome é obrigatório.')
    .regex(/^[\p{L}\s]+$/u, 'O nome deve conter apenas letras.'),
  profile: z.enum(['admin', 'developer', 'agile']),
});

export async function usersRoutes(app: FastifyInstance) {
  // Public: needed by the login screen to select a user.
  app.get('/users', async (request, reply) => {
    const { assignable } = listQuerySchema.parse(request.query ?? {});

    const rows = assignable
      ? await db
          .select()
          .from(usersTable)
          .where(inArray(usersTable.profile, ['developer', 'agile']))
          .orderBy(asc(usersTable.name))
      : await db.select().from(usersTable).orderBy(asc(usersTable.name));

    const response = ok({ users: rows.map(serializeUser) });
    return reply.status(response.statusCode).send(response.body);
  });

  app.post('/users', { preHandler: authenticate }, async (request, reply) => {
    const authUser = await getAuthUser(request);

    if (!authUser) {
      const response = unauthorized({ error: 'User not found.' });
      return reply.status(response.statusCode).send(response.body);
    }

    if (!can(authUser.profile, 'createUser')) {
      const response = forbidden({ error: 'You are not allowed to create users.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const { success, error, data } = createUserSchema.safeParse(request.body);

    if (!success) {
      const response = badRequest({ errors: error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const email = emailFromName(data.name);

    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing) {
      const response = conflict({ error: 'Já existe um usuário com esse nome.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const [user] = await db
      .insert(usersTable)
      .values({ name: data.name, email, profile: data.profile })
      .returning();

    const response = created({ user: serializeUser(user!) });
    return reply.status(response.statusCode).send(response.body);
  });
}
