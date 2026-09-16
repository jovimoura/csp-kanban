import { fastify, FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { env } from './env';
import { getHealth } from '../routes/hello-world';
import { postSignIn } from '../routes/signin';
import { getMe } from '../routes/me';
import { usersRoutes } from '../routes/users';
import { tasksRoutes } from '../routes/tasks';

export function buildApp(): FastifyInstance {
  const app = fastify({ logger: env.NODE_ENV !== 'test' });

  app.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  });

  app.register(getHealth);
  app.register(postSignIn);
  app.register(getMe);
  app.register(usersRoutes);
  app.register(tasksRoutes);

  return app;
}
