export interface TaskType {
  _id?: string;
  userId?: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "Progress" | "Completed";
  dueDate: string;
  createdAt?: string;
}

export interface TaskStats {
  total_tasks: number;
  completed_tasks: number;
  todo_tasks: number;
  in_progress_tasks: number;
  low_prority_tasks: number;
  high_priority_tasks: number;
  midium_priority_tasks: number;
  task_completion_rate: number;
}

export interface TeamType {
  _id?: string;
  name: string;
  description: string;
}
