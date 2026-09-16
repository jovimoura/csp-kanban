import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { destroyUserSession } from "@/lib/session.server";

export async function action({ request }: Route.ActionArgs) {
  return redirect("/login", {
    headers: { "Set-Cookie": await destroyUserSession(request) },
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  return redirect("/login", {
    headers: { "Set-Cookie": await destroyUserSession(request) },
  });
}
