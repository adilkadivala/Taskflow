import { create } from "zustand";
import { tasksApies } from "@/lib/task";
import type { TaskType } from "@/lib/types";

interface TaskStore {
  tasks: TaskType[];
  recentTasks: TaskType[];
  taskStats: any;
  activity: any[];

  getTaskLoading: boolean;
  searchTaskLoading: boolean;
  filterTaskLoading: boolean;
  taskStatsLoading: boolean;
  recentStatsLoading: boolean;
  taskActivityLoading: boolean;

  getTasks: () => Promise<void>;
  searchTasks: (title?: string, description?: string) => Promise<void>;
  filterTasks: (status?: string, priority?: string) => Promise<void>;

  getTaskStats: () => Promise<void>;
  getRecentTasks: () => Promise<void>;
  getTaskActivity: (taskId: string) => Promise<void>;

  addTask: (task: TaskType) => void;

  reset: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  recentTasks: [],
  taskStats: null,
  activity: [],

  getTaskLoading: false,
  searchTaskLoading: false,
  filterTaskLoading: false,
  taskStatsLoading: false,
  recentStatsLoading: false,
  taskActivityLoading: false,

  getTasks: async () => {
    set({ getTaskLoading: true });
    const response = await tasksApies.getAllTask();

    if (response.ok) {
      set({ tasks: response.data.tasks, getTaskLoading: false });
    } else {
      set({ getTaskLoading: false });
    }
  },

  searchTasks: async (title, description) => {
    set({ searchTaskLoading: true });

    const response = await tasksApies.searchTask(title, description);

    if (response.ok) {
      set({ tasks: response.data.tasks, searchTaskLoading: false });
    } else {
      set({ searchTaskLoading: false });
    }
  },

  filterTasks: async (status, priority) => {
    set({ filterTaskLoading: true });
    const response = await tasksApies.filterTask(status, priority);
    if (response.ok)
      set({ tasks: response.data.tasks, filterTaskLoading: false });
    else set({ filterTaskLoading: false });
  },

  getTaskStats: async () => {
    set({ taskStatsLoading: true });
    const response = await tasksApies.getTaskStats();
    if (response.ok) {
      set({ taskStats: response.data?.stats, taskStatsLoading: false });
    } else set({ taskStatsLoading: false });
  },

  getRecentTasks: async () => {
    set({ recentStatsLoading: true });
    const response = await tasksApies.getRecentTask();
    if (response.ok) {
      set({ recentTasks: response.data.recentTasks, recentStatsLoading: false });
    } else set({ recentStatsLoading: false });
  },

  getTaskActivity: async (taskId) => {
    set({ taskActivityLoading: true });
    const response = await tasksApies.getTaskActivity(taskId);
    if (response.ok) {
      set({ activity: response.data.activity, taskActivityLoading: false });
    } else {
      set({ taskActivityLoading: false });
    }
  },

  addTask: (task: TaskType) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  reset: () => set({ tasks: [] }),
}));
