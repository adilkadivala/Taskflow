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
import { UserPlus } from "lucide-react";
import { teamApies } from "@/lib/team";
import { useParams } from "react-router-dom";
import { useTeamStore } from "@/store/teams";
import { toast } from "sonner";

export function InviteMemberForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { teamId } = useParams();
  const { getAllMembersOfTeam } = useTeamStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail("");
      setOpen(false);
    }
  };

  // add member to a team

  const inviteMember = async (email: string) => {
    const response = await teamApies.addMemberToATeam(teamId, email);
    if (response.ok) {
      await getAllMembersOfTeam(teamId);
      setOpen(false);
      toast.success("invitation sent successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to add to this team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={() => inviteMember(email)}
          >
            Send invitation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
