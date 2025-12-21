import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "@/hooks/use-form-data";
import type { TeamType } from "@/lib/types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useTeamStore } from "@/store/teams";
import { teamApies } from "@/lib/team";

export function TeamSheet({ open, onClose, team }: any) {
  if (!team) return null;

  console.log(team);

  const { getTeams } = useTeamStore();

  const { formData, bindInput, resetForm, setFormValues } = useForm<TeamType>({
    name: "",
    description: "",
  });

  // update
  const handleForm = async (teamId: string) => {
    const response = await teamApies.updateTeam(teamId, formData);
    if (response.ok === true) {
      await getTeams();
      resetForm();
      toast.success("team updated!");
    }
    if (response.ok === false) {
      toast.error(response.message);
      toast.error(response.status);
    }
  };

  useEffect(() => {
    if (team) {
      setFormValues({
        name: team.name,
        description: team.description,
      });
    }
  }, [team]);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden border-l">
        {/* Minimal Header with subtle background */}
        <SheetHeader className="p-6 text-left border-b bg-muted/5">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Team Details
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Review and update your team's core information.
          </p>
        </SheetHeader>

        {/* Form area with consistent spacing */}
        <div className="flex-1 overflow-y-auto p-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider"
              >
                Team Name
              </Label>
              <Input
                {...bindInput("name")}
                name="name"
                placeholder="e.g., Creative Squad"
                className="h-10 focus-visible:ring-1 focus-visible:ring-primary shadow-none border-muted-foreground/20"
              />
            </div>

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
                placeholder="What does this team do?"
                className="min-h-[120px] resize-none focus-visible:ring-1 focus-visible:ring-primary shadow-none border-muted-foreground/20"
              />
            </div>
          </form>
        </div>

        {/* Minimal Footer with clear action hierarchy */}
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
            onClick={() => handleForm(team._id)}
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
