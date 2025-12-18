import { create } from "zustand";
import { tasksApies } from "@/lib/task";
import type { TaskType } from "@/lib/types";

interface TaskStore {
  tasks: TaskType[];
  recentTasks: TaskType[];
  taskStats: any;
  activity: any[];

  loading: boolean;

  getTasks: () => Promise<void>;
  searchTasks: (title?: string, description?: string) => Promise<void>;
  filterTasks: (status?: string, priority?: string) => Promise<void>;

  getTaskStats: () => Promise<void>;
  getRecentTasks: () => Promise<void>;
  getTaskActivity: (taskId: string) => Promise<void>;

  reset: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  recentTasks: [],
  taskStats: null,
  activity: [],

  loading: false,

  getTasks: async () => {
    set({ loading: true });
    const response = await tasksApies.getAllTask();

    if (response.ok) {
      set({ tasks: response.data.tasks, loading: false });
    } else {
      set({ loading: false });
    }
  },

  searchTasks: async (title, description) => {
    set({ loading: true });

    const response = await tasksApies.searchTask(title, description);

    if (response.ok) {
      set({ tasks: response.data.tasks, loading: false });
    } else {
      set({ loading: false });
    }
  },

  filterTasks: async (status, priority) => {
    set({ loading: true });
    const res = await tasksApies.filterTask(status, priority);
    if (res.ok) set({ tasks: res.data.tasks, loading: false });
    else set({ loading: false });
  },

  getTaskStats: async () => {
    const res = await tasksApies.getTaskStats();
    if (res.ok) set({ taskStats: res.data?.stats });
  },

  getRecentTasks: async () => {
    const res = await tasksApies.getRecentTask();
    if (res.ok) set({ recentTasks: res.data.tasks });
  },

  getTaskActivity: async (taskId) => {
    const res = await tasksApies.getTaskActivity(taskId);
    if (res.ok) set({ activity: res.data.activity });
  },

  addTask: (task: TaskType) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  reset: () => set({ tasks: [] }),
}));
