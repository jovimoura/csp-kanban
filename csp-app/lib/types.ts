export const USER_PROFILES = ["admin", "developer", "agile"] as const;
export type UserProfile = (typeof USER_PROFILES)[number];

export const TASK_STATUSES = [
  "not_started",
  "in_progress",
  "paused",
  "homolog",
  "prod",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
  dueDate: string;
  assignedTo: string;
};
