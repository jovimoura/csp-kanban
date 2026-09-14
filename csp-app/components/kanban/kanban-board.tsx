import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { KanbanCardPreview } from "@/components/kanban/kanban-card";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TASK_STATUSES, type Task, type TaskStatus, type User } from "@/lib/types";

function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}

export function KanbanBoard({
  tasks,
  users,
  onStatusChange,
  onOpenTask,
}: {
  tasks: Task[];
  users: User[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenTask: (taskId: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const usersById = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );
  const tasksById = useMemo(
    () => new Map(tasks.map((task) => [task.id, task])),
    [tasks],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const grouped = useMemo(() => {
    const columns = Object.fromEntries(
      TASK_STATUSES.map((status) => [status, [] as Task[]]),
    ) as Record<TaskStatus, Task[]>;

    for (const task of tasks) {
      columns[task.status].push(task);
    }

    for (const status of TASK_STATUSES) {
      columns[status].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    }

    return columns;
  }, [tasks]);

  const activeTask = activeId ? tasksById.get(activeId) : undefined;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const task = tasksById.get(String(active.id));
    if (!task || task.status === "prod") return;

    const overId = String(over.id);
    const nextStatus = isTaskStatus(overId)
      ? overId
      : tasksById.get(overId)?.status;

    if (!nextStatus || nextStatus === task.status) return;
    onStatusChange(task.id, nextStatus);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex h-full min-h-0 gap-3 overflow-x-auto pb-2">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            usersById={usersById}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <KanbanCardPreview
            task={activeTask}
            assignee={usersById.get(activeTask.assignedTo)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
