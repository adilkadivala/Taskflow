export interface TaskType {
  _id?: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "Progress" | "Completed";
  dueDate: string;
}

export interface TeamType {
  _id?: string;
  name: string;
  description: string;
}
