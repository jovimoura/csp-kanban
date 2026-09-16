import { apiFetch } from "@/lib/api/client";
import type { Task, TaskStatus, User, UserProfile } from "@/lib/types";

export type SignInResult = {
  accessToken: string;
  user: User;
};

export function signIn(userId: string): Promise<SignInResult> {
  return apiFetch<SignInResult>("/signin", {
    method: "POST",
    body: { userId },
  });
}

export async function getMe(token: string): Promise<User> {
  const data = await apiFetch<{ user: User }>("/me", { token });
  return data.user;
}

export async function listUsers(options?: {
  token?: string | null;
  assignable?: boolean;
}): Promise<User[]> {
  const data = await apiFetch<{ users: User[] }>("/users", {
    token: options?.token ?? null,
    query: options?.assignable ? { assignable: true } : undefined,
  });
  return data.users;
}

export async function createUser(
  token: string,
  input: { name: string; profile: UserProfile },
): Promise<User> {
  const data = await apiFetch<{ user: User }>("/users", {
    method: "POST",
    token,
    body: input,
  });
  return data.user;
}

export async function listTasks(token: string): Promise<Task[]> {
  const data = await apiFetch<{ tasks: Task[] }>("/tasks", { token });
  return data.tasks;
}

export type TaskInput = {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
};

export async function createTask(token: string, input: TaskInput): Promise<Task> {
  const data = await apiFetch<{ task: Task }>("/tasks", {
    method: "POST",
    token,
    body: input,
  });
  return data.task;
}

export async function updateTask(
  token: string,
  id: string,
  input: Partial<TaskInput> & { status?: TaskStatus },
): Promise<Task> {
  const data = await apiFetch<{ task: Task }>(`/tasks/${id}`, {
    method: "PATCH",
    token,
    body: input,
  });
  return data.task;
}

export function updateTaskStatus(
  token: string,
  id: string,
  status: TaskStatus,
): Promise<Task> {
  return updateTask(token, id, { status });
}

export function deleteTask(token: string, id: string): Promise<void> {
  return apiFetch<void>(`/tasks/${id}`, { method: "DELETE", token });
}
