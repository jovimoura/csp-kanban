import { Outlet, useOutletContext } from "react-router";

import type { Route } from "./+types/_app";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireUser } from "@/lib/session.server";
import type { User } from "@/lib/types";

export async function loader({ request }: Route.LoaderArgs) {
  const { user } = await requireUser(request);
  return { user };
}

export type AppContext = {
  user: User;
};

export function useAppContext() {
  return useOutletContext<AppContext>();
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <AppSidebar user={user} />
      <div className="min-w-0 flex-1 bg-background">
        <Outlet context={{ user } satisfies AppContext} />
      </div>
    </div>
  );
}
