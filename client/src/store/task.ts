import { create } from "zustand";
import { tasksApies } from "@/lib/task";

interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;

  getTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  reset: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
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

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  reset: () => set({ tasks: [] }),
}));
