import { fastify } from 'fastify';
import { buildApp } from './lib/app';
import { env } from './lib/env';

void fastify;

const app = buildApp();

app.listen({ port: env.PORT, host: env.HOST }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
