import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildApp } from '../lib/app';

const app = buildApp();
let ready: Promise<unknown> | null = null;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (!ready) {
    ready = Promise.resolve(app.ready());
  }
  await ready;

  app.server.emit('request', req, res);
}
