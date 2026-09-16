import { createCookieSessionStorage, redirect } from "react-router";

import { env } from "@/lib/env.server";
import { getMe } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/types";

type SessionData = {
  accessToken: string;
};

const storage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "csp_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 3, // 3 days, matches the API token lifetime
  },
});

function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

/** Creates the auth cookie header after a successful sign-in. */
export async function createUserSession(accessToken: string): Promise<string> {
  const session = await storage.getSession();
  session.set("accessToken", accessToken);
  return storage.commitSession(session);
}

/** Clears the auth cookie. */
export async function destroyUserSession(request: Request): Promise<string> {
  const session = await getSession(request);
  return storage.destroySession(session);
}

export async function getAccessToken(request: Request): Promise<string | null> {
  const session = await getSession(request);
  return session.get("accessToken") ?? null;
}

/**
 * Returns the current user (and token) or null when the session is missing/invalid.
 * Invalid sessions are treated as logged out.
 */
export async function getOptionalUser(
  request: Request,
): Promise<{ user: User; token: string } | null> {
  const token = await getAccessToken(request);
  if (!token) return null;

  try {
    const user = await getMe(token);
    return { user, token };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

/** Requires an authenticated user, redirecting to /login otherwise. */
export async function requireUser(
  request: Request,
): Promise<{ user: User; token: string }> {
  const result = await getOptionalUser(request);
  if (!result) {
    throw redirect("/login", {
      headers: { "Set-Cookie": await destroyUserSession(request) },
    });
  }
  return result;
}
