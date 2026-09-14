import { useDroppable } from "@dnd-kit/core";

import { KanbanCard } from "@/components/kanban/kanban-card";
import { STATUS_META } from "@/lib/format";
import type { Task, TaskStatus, User } from "@/lib/types";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  status,
  tasks,
  usersById,
  onOpenTask,
}: {
  status: TaskStatus;
  tasks: Task[];
  usersById: Map<string, User>;
  onOpenTask: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = STATUS_META[status];

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-0 min-w-64 flex-1 flex-col rounded-2xl p-3",
        meta.columnClass,
        isOver && "ring-2 ring-primary/50",
      )}
    >
      <header className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("size-2.5 rounded-full", meta.dotClass)} />
        <h2 className="text-sm font-medium">{meta.label}</h2>
        <span className="ml-auto inline-flex size-5 items-center justify-center rounded-full bg-background/80 text-[11px] font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="flex min-h-24 flex-1 flex-col gap-2.5">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            assignee={usersById.get(task.assignedTo)}
            onOpen={onOpenTask}
          />
        ))}
      </div>
    </section>
  );
}
