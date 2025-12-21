"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Plus } from "lucide-react";
import { tasksApies } from "@/lib/task";
import type { TaskType } from "@/lib/types";
import { toast } from "sonner";

import { useForm } from "@/hooks/use-form-data";
import { useTeamStore } from "@/store/teams";
import { useParams } from "react-router-dom";

export function NewTaskForm() {
  const { teamId } = useParams();

  const { addTeamTask } = useTeamStore();
  const [open, setOpen] = useState(false);
  const { formData, bindInput, bindSelect, resetForm } = useForm<TaskType>({
    title: "",
    description: "",
    priority: "Low",
    status: "Todo",
    dueDate: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await tasksApies.createTeamTask(teamId, formData);

    if (response.ok) {
      addTeamTask(response.data);
      resetForm();
      setOpen(false);
      toast.success("task created!");
    } else {
      toast.error(response.message);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              {...bindInput("title")}
              id="title"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...bindInput("description")}
              id="description"
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 w-full">
            <div className="flex md:flex-col gap-2 w-full">
              <Label htmlFor="priority">Priority</Label>
              <Select {...bindSelect("priority")} value={formData.priority}>
                <SelectTrigger name="priority" id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex md:flex-col gap-2 w-full">
              <Label htmlFor="status">Status</Label>
              <Select {...bindSelect("status")} value={formData.status}>
                <SelectTrigger name="status" id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todo">To Do</SelectItem>
                  <SelectItem value="Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              {...bindInput("dueDate")}
              name="dueDate"
              type="date"
              value={formData.dueDate}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isLoading ? <Loader className="" /> : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
