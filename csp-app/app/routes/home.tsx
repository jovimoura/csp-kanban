import { useMemo, useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { Link } from "react-router";

import type { Route } from "./+types/home";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDetailsDialog } from "@/components/kanban/task-details-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { useMockStore } from "@/lib/mocks/store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kanban | CSP Tech" },
    { name: "description", content: "Quadro kanban das demandas da CSP Tech." },
  ];
}

export default function Home() {
  const { tasks, users, updateTaskStatus } = useMockStore();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tasks;

    return tasks.filter((task) => {
      const assignee = users.find((user) => user.id === task.assignedTo);
      return (
        task.title.toLowerCase().includes(term) ||
        assignee?.name.toLowerCase().includes(term)
      );
    });
  }, [query, tasks, users]);

  return (
    <div className="flex h-svh flex-col">
      <header className="flex items-center gap-4 px-6 py-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Kanban
        </h1>

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

          <Button asChild>
            <Link to="/tasks/new">
              <Plus data-icon="inline-start" />
              Nova Demanda
            </Link>
          </Button>

          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell />
          </Button>

          <UserAvatar name="Felipe Gomes" size="default" />
        </div>
      </header>

      <div className="min-h-0 flex-1 px-6 pb-6">
        <KanbanBoard
          tasks={filteredTasks}
          users={users}
          onStatusChange={updateTaskStatus}
          onOpenTask={setSelectedId}
        />
      </div>

      <TaskDetailsDialog
        taskId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
