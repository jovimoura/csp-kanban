import { useDraggable } from "@dnd-kit/core";
import { Calendar, MoreVertical } from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import { formatDueDate, isOverdue } from "@/lib/format";
import type { Task, User } from "@/lib/types";
import { cn } from "@/lib/utils";

export function KanbanCard({
  task,
  assignee,
  onOpen,
}: {
  task: Task;
  assignee?: User;
  onOpen: (taskId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });

  return (
    <article
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task.id)}
      className={cn(
        "cursor-grab rounded-xl bg-card p-3 shadow-sm ring-1 ring-foreground/6 transition-shadow hover:shadow-md",
        isDragging && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug text-card-foreground">
          {task.title}
        </h3>
        <MoreVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {assignee ? (
            <UserAvatar name={assignee.name} />
          ) : (
            <span className="size-6" />
          )}
          {task.status === "not_started" ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Não iniciada
            </span>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs",
            isOverdue(task.dueDate)
              ? "text-amber-600"
              : "text-muted-foreground",
          )}
        >
          <Calendar className="size-3.5" />
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </article>
  );
}

export function KanbanCardPreview({
  task,
  assignee,
}: {
  task: Task;
  assignee?: User;
}) {
  return (
    <article className="w-64 cursor-grabbing rounded-xl bg-card p-3 shadow-lg ring-1 ring-foreground/10">
      <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
      <div className="mt-3 flex items-center justify-between gap-2">
        {assignee ? <UserAvatar name={assignee.name} /> : <span className="size-6" />}
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </article>
  );
}
