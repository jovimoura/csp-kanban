import { FastifyRequest } from 'fastify';
import { validateAccessToken } from './jwt';
import { ProtectedHttpRequest } from '../types/http';

function parseEvent(request: FastifyRequest) {
  return {
    body: (request.body as Record<string, any>) || {},
    queryParams: (request.query as Record<string, any>) || {},
    params: (request.params as Record<string, any>) || {},
  };
}

export function parseProtectedEvent(request: FastifyRequest): ProtectedHttpRequest {
  const baseEvent = parseEvent(request);
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new Error('Access token not provided.');
  }

  const [, token] = authorization.split(' ');
  const userId = validateAccessToken(token);

  if (!userId) {
    throw new Error('Invalid access token.');
  }

  return {
    ...baseEvent,
    userId,
  };
}