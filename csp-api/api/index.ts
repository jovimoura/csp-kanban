import 'dotenv/config';

import { fastify } from "fastify";
import cors from "@fastify/cors";
import { getHelloWorld } from "../routes/hello-world";
import { postSignIn } from "../routes/signin";
import swagger from '@fastify/swagger';

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(getHelloWorld);
app.register(postSignIn);
app.register(swagger, {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: { title: 'CSP API' },
  },
});
app.register(me);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running!");
  });