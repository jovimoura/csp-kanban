import { Link, redirect } from "react-router";

import type { Route } from "./+types/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { PROFILE_LABELS } from "@/lib/format";
import { listUsers } from "@/lib/api/resources";
import { requireUser } from "@/lib/session.server";
import { can } from "@/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Usuários | CSP Tech" },
    { name: "description", content: "Lista de usuários do kanban." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { token, user } = await requireUser(request);
  if (!can(user.profile, "createUser")) {
    throw redirect("/");
  }
  const users = await listUsers({ token });
  return { users };
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  return (
    <main className="px-8 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Usuários
            </h1>
            <Badge variant="secondary">{users.length}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Lista simples dos usuários cadastrados.
          </p>
        </div>
        <Button asChild>
          <Link to="/users/new">Novo usuário</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
        {users.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhum usuário cadastrado ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar name={user.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge variant="secondary">{PROFILE_LABELS[user.profile]}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
