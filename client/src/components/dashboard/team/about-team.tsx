"use client";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useParams } from "react-router-dom";
import { InviteMemberForm } from "./invite-member";
import { useTeamStore } from "@/store/teams";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewTaskForm } from "./new-task-form";

import TaskTable from "./tasks-tabel";
import { teamApies } from "@/lib/team";
import { toast } from "sonner";

export default function AboutTeam() {
  const { teamId } = useParams();

  const {
    teamDetail,
    teamLoading,
    teamTasks,
    teamMembers,

    getATeam,
    getAllTasks,
    getAllMembersOfTeam,
  } = useTeamStore();

  // remove member form team
  const removeMember = async (teamId: string, memberId: string) => {
    const response = await teamApies.removeMemberFromATeam(teamId, memberId);
    if (response.ok) {
      getAllMembersOfTeam(teamId);
      toast.success("member removed successfully");
    }
  };

  useEffect(() => {
    getATeam(teamId);
    getAllTasks(teamId);
    getAllMembersOfTeam(teamId);
  }, [teamId]);

  if (teamLoading) {
    return <p className="p-6">Loading team...</p>;
  }

  if (!teamDetail) {
    return <p className="p-6">Team not found</p>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Link to="/dashboard/teams">
        <Button variant="ghost" className="gap-2 mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Teams
        </Button>
      </Link>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold break-words">
              {teamDetail?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {teamDetail?.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <InviteMemberForm />
          <NewTaskForm />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Total Members
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{teamTasks.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers.map((member, index) => (
                <div className="flex flex-col gap-4 ">
                  <div
                    key={index}
                    className="flex items-center justify-between first:pt-0 last:pb-0 divide-y"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1 py-2">
                      <Avatar
                        key={index}
                        className="size-10 border-2 border-background shadow-sm"
                      >
                        <AvatarImage src={member.name?.charAt(0)} />
                        <AvatarFallback className="text-[10px]">
                          {member.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{member?.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              removeMember(teamDetail._id, member._id!)
                            }
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="tasks"
          className="mt-6 border-none p-0 outline-none"
        >
          <TaskTable teamTasks={teamTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
