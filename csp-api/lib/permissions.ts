import { UserRow } from '../db/schema';

export type UserProfile = UserRow['profile'];

export type Action =
  | 'createUser'
  | 'createTask'
  | 'editTask'
  | 'deleteTask'
  | 'moveTask';

const PERMISSIONS: Record<UserProfile, Action[]> = {
  admin: ['createUser', 'createTask'],
  agile: ['createTask', 'editTask', 'deleteTask', 'moveTask'],
  developer: ['editTask', 'moveTask'],
};

export function can(profile: UserProfile, action: Action): boolean {
  return PERMISSIONS[profile]?.includes(action) ?? false;
}
