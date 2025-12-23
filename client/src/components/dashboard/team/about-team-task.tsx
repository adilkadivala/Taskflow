"use client";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskChatRoom } from "@/components/dashboard/team/team-chat-room";
import { Link, useParams } from "react-router-dom";

export default function AboutTeamTask() {
  const { teamId } = useParams();
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 h-full">
      <Link to={`/dashboard/teams/${teamId}`}>
        <Button variant="ghost" className="gap-2 mb-2 w-fit">
          <ChevronLeft className="w-4 h-4" />
          Back to Team
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-4 flex-1 min-h-0">
        <TaskChatRoom />
      </div>
    </div>
  );
}
