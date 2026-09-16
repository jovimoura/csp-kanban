import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { signAccessTokenFor } from '../lib/jwt';
import { badRequest, ok, unauthorized } from '../lib/http';
import { serializeUser } from '../lib/serializers';

const schema = z.object({
  userId: z.string().uuid(),
});

export async function postSignIn(app: FastifyInstance) {
  app.post('/signin', async (request, reply) => {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) {
      const response = badRequest({ errors: error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, data.userId))
      .limit(1);

    if (!user) {
      const response = unauthorized({ error: 'Invalid credentials.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const accessToken = signAccessTokenFor(user.id);

    const response = ok({ accessToken, user: serializeUser(user) });
    return reply.status(response.statusCode).send(response.body);
  });
}
