import { Link } from "react-router";

import type { Route } from "./+types/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDueDate, STATUS_META } from "@/lib/format";
import { listTasks, listUsers } from "@/lib/api/resources";
import { requireUser } from "@/lib/session.server";
import { can } from "@/lib/permissions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Demandas | CSP Tech" },
    { name: "description", content: "Lista de demandas do kanban." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { token, user } = await requireUser(request);
  const [tasks, users] = await Promise.all([listTasks(token), listUsers({ token })]);
  return { tasks, users, canCreate: can(user.profile, "createTask") };
}

export default function Tasks({ loaderData }: Route.ComponentProps) {
  const { tasks, users, canCreate } = loaderData;
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <main className="px-8 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Demandas
            </h1>
            <Badge variant="secondary">{tasks.length}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Lista simples das demandas cadastradas.
          </p>
        </div>
        {canCreate ? (
          <Button asChild>
            <Link to="/tasks/new">Nova Demanda</Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
        {sortedTasks.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhuma demanda cadastrada ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {sortedTasks.map((task) => {
              const assignee = users.find((user) => user.id === task.assignedTo);
              return (
                <li
                  key={task.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignee?.name ?? "Sem responsável"} ·{" "}
                      {formatDueDate(task.dueDate)}
                    </p>
                  </div>
                  <Badge className={STATUS_META[task.status].badgeClass}>
                    {STATUS_META[task.status].label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
