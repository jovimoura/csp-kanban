import { FastifyInstance } from 'fastify';
import { authenticate } from '../lib/authHook';
import { getAuthUser } from '../lib/getAuthUser';
import { ok, unauthorized } from '../lib/http';
import { serializeUser } from '../lib/serializers';

export async function getMe(app: FastifyInstance) {
  app.get('/me', { preHandler: authenticate }, async (request, reply) => {
    const user = await getAuthUser(request);

    if (!user) {
      const response = unauthorized({ error: 'User not found.' });
      return reply.status(response.statusCode).send(response.body);
    }

    const response = ok({ user: serializeUser(user) });
    return reply.status(response.statusCode).send(response.body);
  });
}
