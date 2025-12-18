"use client";

import { Pie, PieChart, Sector, Label } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskStore } from "@/store/task";
import { useMemo, useState } from "react";

export const description = "Task Status Distribution";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--color-chart-1)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--color-chart-2)",
  },
  todo: {
    label: "Todo",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

const ChartColors = `
  :root {
    --color-completed: var(--color-chart-1);
    --color-inProgress: var(--color-chart-2);
    --color-todo: var(--color-chart-3);
  }
`;

export function StatusChart() {
  const { tasks } = useTaskStore();

  const taskData = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const progress = tasks.filter((t) => t.status === "Progress").length;
    const todo = tasks.filter((t) => t.status === "Todo").length;

    return [
      {
        status: "completed",
        count: completed,
        fill: "var(--color-completed)",
      },
      {
        status: "inProgress",
        count: progress,
        fill: "var(--color-inProgress)",
      },
      {
        status: "todo",
        count: todo,
        fill: "var(--color-todo)",
      },
    ];
  }, [tasks]);

  const id = "task-status-pie";
  const [activeStatus, setActiveStatus] = useState<
    "completed" | "inProgress" | "todo"
  >("completed");

  const activeIndex = useMemo(
    () => taskData.findIndex((item) => item.status === activeStatus),
    [activeStatus]
  );

  return (
    <Card data-chart={id} className="flex flex-col gap-1">
      {/* inject the dynamic color style */}
      <ChartStyle id={id} config={chartConfig} />
      <style>{ChartColors}</style>

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Task Status Distribution</CardTitle>
          <CardDescription>Overall proportion of tasks</CardDescription>
        </div>

        <Select
          value={activeStatus}
          onValueChange={(value) =>
            setActiveStatus(value as "completed" | "inProgress" | "todo")
          }
        >
          <SelectTrigger
            className="ml-auto h-7 w-[150px] rounded-lg pl-2.5"
            aria-label="Select a status"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {taskData.map((item) => {
              const config =
                chartConfig[item.status as keyof typeof chartConfig];
              if (!config) return null;
              return (
                <SelectItem
                  key={item.status}
                  value={item.status}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={taskData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const active = taskData[activeIndex];
                    const config =
                      chartConfig[active.status as keyof typeof chartConfig];
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {active.count}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {config.label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
