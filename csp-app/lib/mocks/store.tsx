import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { emailFromName } from "@/lib/format";
import { seedTasks, seedUsers } from "@/lib/mocks/data";
import type { Task, TaskStatus, User, UserProfile } from "@/lib/types";

type AddTaskInput = Omit<Task, "id" | "status"> & { status?: TaskStatus };
type UpdateTaskInput = Partial<Omit<Task, "id">>;
type AddUserInput = {
  name: string;
  profile: UserProfile;
};

type MockStoreValue = {
  users: User[];
  tasks: Task[];
  addTask: (input: AddTaskInput) => Task;
  updateTask: (id: string, patch: UpdateTaskInput) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  addUser: (input: AddUserInput) => User;
};

const MockStoreContext = createContext<MockStoreValue | null>(null);

export function MockProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);

  const addTask = useCallback((input: AddTaskInput) => {
    const task: Task = {
      id: crypto.randomUUID(),
      status: input.status ?? "not_started",
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      assignedTo: input.assignedTo,
    };
    setTasks((current) => [...current, task]);
    return task;
  }, []);

  const updateTask = useCallback((id: string, patch: UpdateTaskInput) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    );
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;
        if (task.status === "prod") return task;
        return { ...task, status };
      }),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const addUser = useCallback((input: AddUserInput) => {
    const user: User = {
      id: crypto.randomUUID(),
      name: input.name,
      profile: input.profile,
      email: emailFromName(input.name),
    };
    setUsers((current) => [...current, user]);
    return user;
  }, []);

  const value = useMemo(
    () => ({
      users,
      tasks,
      addTask,
      updateTask,
      updateTaskStatus,
      removeTask,
      addUser,
    }),
    [users, tasks, addTask, updateTask, updateTaskStatus, removeTask, addUser],
  );

  return (
    <MockStoreContext.Provider value={value}>
      {children}
    </MockStoreContext.Provider>
  );
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) {
    throw new Error("useMockStore must be used within MockProvider");
  }
  return context;
}
