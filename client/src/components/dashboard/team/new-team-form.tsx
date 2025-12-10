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
import { Plus } from "lucide-react";
import { useForm } from "@/hooks/use-form-data";
import type { TeamType } from "@/lib/types";
import { teamApies } from "@/lib/team";
import { useTeamStore } from "@/store/teams";
import { toast } from "sonner";

export function NewTeamForm() {
  const { getTeams, addTeam } = useTeamStore();
  const [open, setOpen] = useState<boolean>(false);
  const { formData, bindInput, resetForm } = useForm<TeamType>({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await teamApies.createTeam(formData);

    if (response.ok === true) {
      addTeam(response.data);
      await getTeams();
      setOpen(!open);
      toast.success(response.message);
      resetForm();
    }
    if (response.ok === false) {
      setOpen(false);
      toast.success(response.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center min-h-[220px] border-2 border-dashed hover:border-primary cursor-pointer transition-colors">
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              New Team
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Set up a new team to collaborate with your team members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              {...bindInput("name")}
              id="name"
              placeholder="Enter team name"
              value={formData.name}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...bindInput("description")}
              placeholder="Enter team description"
              value={formData.description}
              rows={3}
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
            <Button type="submit" onClick={handleSubmit}>
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
