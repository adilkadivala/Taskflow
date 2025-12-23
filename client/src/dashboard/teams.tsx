import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewTeamForm } from "@/components/dashboard/team/new-team-form";
import { useTeamStore } from "@/store/teams";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { teamApies } from "@/lib/team";
import { toast } from "sonner";
import { TeamSheet } from "@/components/dashboard/team/team-sheet";

export default function TeamsPage() {
  const { teams, getTeams, teamsLoading } = useTeamStore();
  const navigate = useNavigate();

  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  useEffect(() => {
    getTeams();
  }, []);

  const onTeamClick = (team: any) => {
    setSelectedTeam(team);
    setOpenSheet(true);
  };

  // delete team

  const deleteTeam = async (teamId: any) => {
    const response = await teamApies.deleteTeam(teamId);
    if (response.ok) {
      toast.success("team deleted successfully");
      await getTeams();
    }
    if (response.status === 400) {
      toast.success("you're not authorised to delete");
    }
  };

  if (teamsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-6 py-6 px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with members
          </p>
        </div>

        <section className="flex flex-col gap-6 mt-6">
          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NewTeamForm />
            {teams.map((team, index) => {
              return (
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                  key={index}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="space-y-1">
                          <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                            {team.name}
                          </CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {team.description || "No description provided."}
                          </CardDescription>
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onTeamClick(team);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTeam(team._id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex -space-x-2">
                          {team?.members
                            .slice(0, 3)
                            .map((member: any, i: number) => (
                              <Avatar
                                key={i}
                                className="h-7 w-7 border-2 border-background shadow-sm"
                              >
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="text-[10px]">
                                  {member.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          {team.members.length > 3 && (
                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted border-2 border-background text-[9px] font-medium">
                              +{team.members?.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {team.members.length} members
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {team.tasks?.length} tasks
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                          <span>Progress</span>
                          <span className="text-foreground">65%</span>
                        </div>
                        <Progress value={65} className="h-1 bg-muted" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      <TeamSheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        team={selectedTeam}
      />
    </>
  );
}
