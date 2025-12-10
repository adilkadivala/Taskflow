import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useTaskStore } from "@/store/task";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export function TaskSheet({ open, onClose, task }: any) {
  if (!task) return null;

  const { getTasks, addTask } = useTaskStore();

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
    const response = await tasksApies.updateTask(taskId, formData);
    console.log(response);
    if (response.ok === true) {
      addTask(response.data.data);
      await getTasks();
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
      <SheetContent className="w-full sm:max-w-md p-0 h-full">
        <SheetHeader>
          <SheetTitle>About the task</SheetTitle>
        </SheetHeader>
        <Separator className="" />
        <div className="flex flex-col gap-4 overflow-y-auto px-4 items-center h-full text-sm">
          <form className="flex flex-col gap-4 justify-center h-full w-full">
            <div className="flex flex-col gap-3">
              <Label htmlFor="title">Title</Label>
              <Input {...bindInput("title")} name="title" />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea {...bindInput("description")} name="description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select {...bindSelect("status")}>
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
              <div className="flex flex-col gap-3">
                <Label htmlFor="priority">Priority</Label>
                <Select {...bindSelect("priority")}>
                  <SelectTrigger
                    name="priority"
                    id="priority"
                    className="w-full"
                  >
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

            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Due Date</Label>
              <Input
                id="dueDate"
                {...bindInput("dueDate")}
                name="dueDate"
                type="date"
              />
            </div>
          </form>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={() => handleForm(task._id)}>
              Update
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
