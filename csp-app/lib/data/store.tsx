import { useEffect, useState } from "react";

import type { Task, TaskStatus } from "@/lib/types";

/**
 * Keeps a local, optimistic copy of the server tasks so drag-and-drop and
 * deletions feel instant. Whenever the server data changes (after a
 * revalidation) the local copy is reconciled back to the source of truth,
 * which also handles rejected moves (e.g. a task in production returning to
 * its column).
 */
export function useTaskBoard(serverTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(serverTasks);

  useEffect(() => {
    setTasks(serverTasks);
  }, [serverTasks]);

  function setStatus(id: string, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  }

  function remove(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return { tasks, setStatus, remove };
}
