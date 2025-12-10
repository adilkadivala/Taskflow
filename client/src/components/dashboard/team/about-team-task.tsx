"use client";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskChatRoom } from "@/components/dashboard/team/team-chat-room";
import { Link, useParams } from "react-router-dom";

const mockTask = {
  id: "1",
  title: "Design landing page",
  description: "Create mockups and design system for the new landing page",
  priority: "high",
  status: "in-progress",
  dueDate: "2024-12-20",
  assigned: [
    { id: "1", name: "John Doe", avatar: "/placeholder-user.jpg" },
    { id: "2", name: "Jane Smith", avatar: "/placeholder-user.jpg" },
  ],
  comments: [
    {
      id: "1",
      author: "John Doe",
      avatar: "/placeholder-user.jpg",
      content:
        "Started working on the design mockups. Will have them ready by tomorrow.",
      timestamp: "2024-12-12 10:30 AM",
    },
    {
      id: "2",
      author: "Jane Smith",
      avatar: "/placeholder-user.jpg",
      content:
        "Great! Please make sure to follow the design system guidelines.",
      timestamp: "2024-12-12 11:15 AM",
    },
  ],
};

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
        <TaskChatRoom taskId="1" teamId="2" taskTitle={mockTask.title} />
      </div>
    </div>
  );
}
