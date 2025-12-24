import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { tasksApies } from "@/lib/task";
import { useTeamStore } from "@/store/teams";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const AssignTask = ({ open, onClose, task }: any) => {
  const { teamId } = useParams();
  const { teamMembers, getAllTasks } = useTeamStore();

  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  //   assing a task
  const assignATask = async () => {
    const response = await tasksApies.assignATaskToTheMember(
      task._id,
      teamId,
      selectedMember
    );
    if (response.ok) {
      toast.success("task assigned");
      onClose();
      await getAllTasks(teamId);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden border-l">
        {/* Minimal Header */}
        <SheetHeader className="p-6 text-left border-b bg-muted/5">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Assign Task
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Select a team member to handle this task.
          </p>
        </SheetHeader>

        {/* Members List Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <label
                  key={member._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={member?.name.charAt(0)} />
                      <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                        {member.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none">
                        {member.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <Checkbox
                    className="size-5 data-[state=checked]:bg-primary"
                    id={member._id}
                    checked={selectedMember === member._id}
                    onCheckedChange={(checked) => {
                      setSelectedMember(checked ? member._id! : null);
                    }}
                  />
                </label>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No members found in this team.
                </p>
              </div>
            )}
          </div>
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
            onClick={assignATask}
            disabled={!selectedMember}
          >
            Assign Member
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AssignTask;
