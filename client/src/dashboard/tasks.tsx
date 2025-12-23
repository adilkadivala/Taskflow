"use client";

import { NewTaskForm } from "@/components/dashboard/tasks/new-task-form";
import { TaskSheet } from "@/components/dashboard/tasks/task-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { tasksApies } from "@/lib/task";
import type { TaskType } from "@/lib/types";
import { useDebounce } from "@/lib/utils";
import { useTaskStore } from "@/store/task";
import { Edit, MoreVertical, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TasksPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const { tasks, searchTasks, getTasks, loading } = useTaskStore();

  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const onTaskClick = (task: any) => {
    return () => {
      setSelectedTask(task);
      setOpenSheet(true);
    };
  };

  // delete
  const deleteTask = async (taskId: TaskType["_id"]) => {
    const response = await tasksApies.deleteTask(taskId);
    if (response.ok === true) {
      toast.success("task deleted successfully");
      await getTasks();
    }
    if (response.status === 403) {
      toast.success("task not deleted");
    }
  };

  useEffect(() => {
    if (!debouncedQuery) {
      getTasks();
    } else {
      searchTasks(debouncedQuery);
    }
  }, [debouncedQuery]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your tasks
          </p>
        </div>
        <NewTaskForm />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0.5">
        {["Todo", "Progress", "Completed"].map((status) => (
          <section
            key={status}
            className="bg-muted/30 p-4 rounded-lg flex flex-col gap-4"
          >
            <p className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
              {status} ({tasks.filter((t) => t.status === status).length})
            </p>

            {tasks.length > 0 ? (
              tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <Card
                    key={task._id}
                    onClick={onTaskClick(task)}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">
                              {task.title}
                            </h3>
                            <Badge>{task.priority}</Badge>
                            <Badge>{task.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {task.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="right">
                            <DropdownMenuItem onClick={onTaskClick(task)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task._id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <p className="text-red-500">No task availabel to display</p>
            )}
          </section>
        ))}
      </div>

      {/* Sheet appears here */}
      <TaskSheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        task={selectedTask}
      />
    </div>
  );
}
