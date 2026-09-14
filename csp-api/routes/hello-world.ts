import { FastifyInstance } from "fastify";

export async function getHelloWorld(app: FastifyInstance) {
  app.get("/", async () => {
    const message = {
      message: "Hello World",
    }

    return message;
  });
}