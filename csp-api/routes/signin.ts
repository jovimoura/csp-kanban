import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { signAccessTokenFor } from '../utils/jwt';
import { badRequest, ok, unauthorized } from '../utils/http';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function postSignIn(app: FastifyInstance) {
  app.post("/signin", async (request, reply) => {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) {
      const response = badRequest({ errors: error.issues });
      return reply.status(response.statusCode).send(response.body);
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, data.email))
      .limit(1);

    if (!user) {
      const response = unauthorized({ error: 'Invalid credentials.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const isPasswordValid = await compare(data.password, user.password);

    if (!isPasswordValid) {
      const response = unauthorized({ error: 'Invalid credentials.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const accessToken = signAccessTokenFor(user.id);

    const response = ok({ accessToken });
    return reply.status(response.statusCode).send(response.body);
  });
}