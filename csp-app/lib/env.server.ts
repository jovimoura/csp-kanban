import "dotenv/config";

/**
 * Server-only environment configuration.
 * `BACKEND_URL` points to the csp-api instance and is never exposed to the client.
 */
const BACKEND_URL = process.env.BACKEND_URL?.trim();

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL environment variable is not set");
}

export const env = {
  BACKEND_URL,
  SESSION_SECRET: process.env.SESSION_SECRET?.trim() || "csp-kanban-dev-session-secret",
};
