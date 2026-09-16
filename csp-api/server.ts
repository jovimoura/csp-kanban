import { fastify } from 'fastify';
import { buildApp } from './lib/app';
import { env } from './lib/env';

const app = buildApp();

export default app;

if (process.env.VERCEL !== '1') {
  app
    .listen({ port: env.PORT, host: env.HOST })
    .then(() => {
      console.log(`HTTP server running on http://${env.HOST}:${env.PORT}`);
    })
    .catch((error) => {
      app.log.error(error);
      process.exit(1);
    });
}
