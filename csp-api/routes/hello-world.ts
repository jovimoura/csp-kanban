import { FastifyInstance } from 'fastify';

export async function getHealth(app: FastifyInstance) {
  app.get('/', async () => {
    return { status: 'ok', service: 'csp-api' };
  });
}
