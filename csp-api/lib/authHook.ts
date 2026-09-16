import { FastifyReply, FastifyRequest } from 'fastify';
import { validateAccessToken } from './jwt';
import { unauthorized } from './http';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    const response = unauthorized({ error: 'Access token not provided.' });
    return reply.status(response.statusCode).send(response.body);
  }

  const [, token] = authorization.split(' ');
  const userId = token ? validateAccessToken(token) : null;

  if (!userId) {
    const response = unauthorized({ error: 'Invalid access token.' });
    return reply.status(response.statusCode).send(response.body);
  }

  request.userId = String(userId);
}
