import { useTaskStore } from "@/store/task";
import StatusCards from "./dashboard/status-card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export function SectionCards() {
  const { taskStats, getTaskStats } = useTaskStore();

  useEffect(() => {
    getTaskStats();
  }, []);

  if (!taskStats) return null;

  const cards = [
    {
      title: "Total Tasks",
      count: taskStats.totalTasks,
      precentage: taskStats.completionRate,
      icon: TrendingUp,
      taststast: "Overall task count for your workspace.",
      tastrasio: "All tasks across statuses included.",
    },
    {
      title: "To-Do Tasks",
      count: taskStats.todoTasks,
      precentage: "",
      icon: TrendingDown,
      taststast: "Tasks waiting to be started.",
      tastrasio: "Focus here to improve progress.",
    },
    {
      title: "In-Progress Tasks",
      count: taskStats.inProgressTasks,
      precentage: "",
      icon: TrendingUp,
      taststast: "Tasks currently being worked on.",
      tastrasio: "Active execution is underway.",
    },
    {
      title: "Completed Tasks",
      count: taskStats.completedTasks,
      precentage: taskStats.completionRate,
      icon: TrendingUp,
      taststast: "Tasks completed successfully.",
      tastrasio: "Great job keeping momentum!",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <StatusCards
          key={card.title}
          title={card.title}
          count={card.count}
          precentage={card.precentage}
          icon={card.icon}
          tastrasio={card.tastrasio}
          taststast={card.taststast}
        />
      ))}
    </div>
  );
}
