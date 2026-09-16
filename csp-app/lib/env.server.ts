import "dotenv/config";

/**
 * Server-only environment configuration.
 * `BACKEND_URL` points to the csp-api instance and is never exposed to the client.
 */
function normalizeBackendUrl(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) {
    throw new Error(
      "BACKEND_URL environment variable is not set. Example: https://csp-api-iota.vercel.app",
    );
  }

  const withProtocol =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    throw new Error(
      `BACKEND_URL is not a valid URL: "${trimmed}". Use a full URL, e.g. https://csp-api-iota.vercel.app`,
    );
  }
}

export const env = {
  BACKEND_URL: normalizeBackendUrl(process.env.BACKEND_URL),
  SESSION_SECRET:
    process.env.SESSION_SECRET?.trim() || "csp-kanban-dev-session-secret",
};
