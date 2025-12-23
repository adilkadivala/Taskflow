import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tasksApies } from "@/lib/task";
import type { TeamTaskType, TeamType } from "@/lib/types";
import { useTeamStore } from "@/store/teams";
import {
  Edit2,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface TaskTableProps {
  teamTasks: TeamTaskType[];
}

const TaskTable = ({ teamTasks }: TaskTableProps) => {
  const { teamId } = useParams();
  const { getAllTasks } = useTeamStore();
  const navigate = useNavigate();

  // State to track selected row IDs
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Toggle "Select All"
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(teamTasks.map((task) => task._id!));
    } else {
      setSelectedRows([]);
    }
  };

  // Toggle single row
  const handleSelectRow = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, taskId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const isAllSelected =
    teamTasks.length > 0 && selectedRows.length === teamTasks.length;

  // delete one by one
  const deleteTask = async (
    teamId: TeamType["_id"],
    taskId: TeamTaskType["_id"]
  ) => {
    const response = await tasksApies.deleteATaskOFTeam(teamId, taskId);
    console.log(response);
    if (response.ok) {
      await getAllTasks(teamId);
      toast.success("task deleted successfully");
    }
  };

  // delete all
  const deleteAllTasks = async (teamId: TeamType["_id"], taskIds: string[]) => {
    const response = await tasksApies.deleteAllTaskOfTeam(teamId, taskIds);
    console.log(response);
    if (response.ok) {
      await getAllTasks(teamId);
      setSelectedRows([]);
      toast.success("bulk deleted successfully");
    }
  };

  useEffect(() => {
    getAllTasks(teamId);
  }, []);

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px]">
              <Checkbox
                aria-label="Select all"
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="font-medium">Task</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden md:table-cell">Assignee</TableHead>
            <TableHead className="hidden lg:table-cell">Due Date</TableHead>
            <TableHead className="text-right">
              {selectedRows.length > 0 ? (
                <Trash2
                  className="size-5 text-rose-400 cursor-pointer"
                  onClick={() => deleteAllTasks(teamId, selectedRows)}
                />
              ) : (
                "Actions"
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamTasks?.length > 0 ? (
            teamTasks.map((task: TeamTaskType) => (
              <TableRow
                key={task._id}
                className={`group transition-colors ${
                  selectedRows.includes(task._id!) ? "bg-muted/50" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    aria-label="Select row"
                    checked={selectedRows.includes(task._id!)}
                    onCheckedChange={(checked) =>
                      handleSelectRow(task._id!, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-[250px] md:max-w-[400px]">
                    <span className="font-medium leading-none group-hover:text-primary transition-colors truncate">
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {task.description || "No description"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        task.status === "Completed"
                          ? "bg-emerald-500"
                          : task.status === "Progress"
                          ? "bg-blue-500"
                          : "bg-slate-300"
                      }`}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {task.status === "Progress" ? "In Progress" : task.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal uppercase tracking-tighter h-5 border-muted-foreground/20"
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-xs text-muted-foreground">
                    {task.assignedTo?.name || "Unassigned"}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No date"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/dashboard/teams/${teamId}/tasks/${task._id}`
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-3.5 w-3.5" /> Task Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        {task.assignedTo?.name ? (
                          <UserMinus className="mr-2 h-3.5 w-3.5" />
                        ) : (
                          <UserPlus className="mr-2 h-3.5 w-3.5" />
                        )}
                        {task.assignedTo?.name
                          ? "Unassign Task"
                          : "Assign Task"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTask(teamId, task._id)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                No tasks found for this team.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
