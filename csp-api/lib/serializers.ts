import { TaskRow, UserRow } from '../db/schema';

export type SerializedUser = {
  id: string;
  name: string;
  email: string;
  profile: UserRow['profile'];
};

export type SerializedTask = {
  id: string;
  title: string;
  status: TaskRow['status'];
  description: string;
  dueDate: string;
  assignedTo: string;
};

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function serializeUser(user: UserRow): SerializedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
  };
}

export function serializeTask(task: TaskRow): SerializedTask {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    description: task.description,
    dueDate: toDateOnly(task.dueDate),
    assignedTo: task.assignedTo,
  };
}
