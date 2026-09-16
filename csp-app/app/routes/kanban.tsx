import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Link, useFetcher } from "react-router";

import type { Route } from "./+types/kanban";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDetailsDialog } from "@/components/kanban/task-details-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listTasks, listUsers, deleteTask, updateTaskStatus } from "@/lib/api/resources";
import { requireUser } from "@/lib/session.server";
import { useTaskBoard } from "@/lib/data/store";
import { can } from "@/lib/permissions";
import { TASK_STATUSES, type TaskStatus } from "@/lib/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kanban | CSP Tech" },
    { name: "description", content: "Quadro kanban das demandas da CSP Tech." },
  ];
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && (TASK_STATUSES as readonly string[]).includes(value);
}

export async function loader({ request }: Route.LoaderArgs) {
  const { token, user } = await requireUser(request);
  const [tasks, users] = await Promise.all([listTasks(token), listUsers({ token })]);
  return { tasks, users, user };
}

export async function action({ request }: Route.ActionArgs) {
  const { token } = await requireUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const id = String(formData.get("id") ?? "");

  try {
    if (intent === "move") {
      const status = formData.get("status");
      if (!id || !isTaskStatus(status)) {
        return { ok: false, error: "Movimentação inválida." };
      }
      await updateTaskStatus(token, id, status);
      return { ok: true };
    }

    if (intent === "delete") {
      if (!id) return { ok: false, error: "Demanda inválida." };
      await deleteTask(token, id);
      return { ok: true };
    }

    return { ok: false, error: "Ação desconhecida." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar a ação.";
    return { ok: false, error: message };
  }
}

export default function Kanban({ loaderData }: Route.ComponentProps) {
  const { users, user } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const { tasks, setStatus, remove } = useTaskBoard(loaderData.tasks);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canMove = can(user.profile, "moveTask");
  const canCreate = can(user.profile, "createTask");
  const canEdit = can(user.profile, "editTask");
  const canDelete = can(user.profile, "deleteTask");

  const filteredTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tasks;
    return tasks.filter((task) => {
      const assignee = users.find((item) => item.id === task.assignedTo);
      return (
        task.title.toLowerCase().includes(term) ||
        (assignee?.name.toLowerCase().includes(term) ?? false)
      );
    });
  }, [query, tasks, users]);

  function handleStatusChange(taskId: string, status: TaskStatus) {
    setStatus(taskId, status);
    fetcher.submit({ intent: "move", id: taskId, status }, { method: "post" });
  }

  function handleDelete(taskId: string) {
    remove(taskId);
    setSelectedId(null);
    fetcher.submit({ intent: "delete", id: taskId }, { method: "post" });
  }

  return (
    <div className="flex h-svh flex-col">
      <header className="flex items-center gap-4 px-6 py-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Kanban</h1>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative w-64">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar demandas..."
              className="h-10 rounded-full pr-9"
              aria-label="Buscar demandas"
            />
            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {canCreate ? (
            <Button asChild>
              <Link to="/tasks/new">
                <Plus data-icon="inline-start" />
                Nova Demanda
              </Link>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 px-6 pb-6">
        <KanbanBoard
          tasks={filteredTasks}
          users={users}
          canMove={canMove}
          onStatusChange={handleStatusChange}
          onOpenTask={setSelectedId}
        />
      </div>

      <TaskDetailsDialog
        taskId={selectedId}
        tasks={tasks}
        users={users}
        canEdit={canEdit}
        canDelete={canDelete}
        onDelete={handleDelete}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
