import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { tasksApies } from "@/lib/task";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@/hooks/use-form-data";
import type { TaskType } from "@/lib/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTeamStore } from "@/store/teams";

export function TaskSheet({ open, onClose, task }: any) {
  if (!task) return null;
  const { teamId } = useParams();

  const { getAllTasks } = useTeamStore();

  const { formData, bindInput, bindSelect, resetForm, setFormValues } =
    useForm<TaskType>({
      title: "",
      description: "",
      priority: "Low",
      status: "Todo",
      dueDate: "",
    });

  // update
  const handleForm = async (taskId: string) => {
    const response = await tasksApies.updateTeamTask(teamId, taskId, formData);
    if (response.ok === true) {
      await getAllTasks(teamId);
      resetForm();
      toast.success("task updated!");
    }
    if (response.ok === false) {
      toast.error(response.message);
      toast.error(response.status);
    }
  };

  useEffect(() => {
    if (task) {
      setFormValues({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.slice(0, 10),
      });
    }
  }, [task]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden border-l">
        {/* Minimal Header */}
        <SheetHeader className="p-6 text-left border-b bg-muted/5">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Task Details
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Update task specifics and track progress.
          </p>
        </SheetHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider"
              >
                Title
              </Label>
              <Input
                {...bindInput("title")}
                name="title"
                placeholder="What needs to be done?"
                className="h-10 focus-visible:ring-1 focus-visible:ring-primary shadow-none border-muted-foreground/20"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                {...bindInput("description")}
                name="description"
                placeholder="Add more context..."
                className="min-h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-primary shadow-none border-muted-foreground/20"
              />
            </div>

            {/* Dual Select Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex w-full">
                <Label
                  htmlFor="status"
                  className="text-[13px] w-fit font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status -
                </Label>
                <Select {...bindSelect("status")}>
                  <SelectTrigger className="h-9 w-1/2 focus:ring-1 focus:ring-primary shadow-none border-muted-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo">To Do</SelectItem>
                    <SelectItem value="Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-full">
                <Label
                  htmlFor="priority"
                  className="text-[13px] w-fit font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Priority -
                </Label>
                <Select {...bindSelect("priority")}>
                  <SelectTrigger className="h-9 w-1/2 focus:ring-1 focus:ring-primary shadow-none border-muted-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Row */}
            <div className="space-y-2 pt-2">
              <Label
                htmlFor="dueDate"
                className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider"
              >
                Due Date
              </Label>
              <Input
                id="dueDate"
                {...bindInput("dueDate")}
                name="dueDate"
                type="date"
                className="h-9 focus-visible:ring-1 focus-visible:ring-primary shadow-none border-muted-foreground/20"
              />
            </div>
          </form>
        </div>

        {/* Minimal Footer */}
        <SheetFooter className="p-6 pt-2 border-t bg-muted/5 flex-row justify-end gap-3 sm:gap-3">
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="font-normal text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            className="px-8 shadow-sm transition-all hover:opacity-90"
            onClick={() => handleForm(task._id)}
          >
            Update Task
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
