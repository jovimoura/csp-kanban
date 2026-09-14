import { FastifyRequest, FastifyReply } from 'fastify';
import { parseProtectedEvent } from './parseProtectedEvent';
import { unauthorized } from './http';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const protectedRequest = parseProtectedEvent(request);
    
    // Adiciona o userId ao request para uso nas rotas
    (request as any).userId = protectedRequest.userId;
    (request as any).body = protectedRequest.body;
    (request as any).queryParams = protectedRequest.queryParams;
    (request as any).params = protectedRequest.params;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    const response = unauthorized({ error: message });
    return reply.status(response.statusCode).send(response.body);
  }
}