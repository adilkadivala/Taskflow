"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useTaskStore } from "@/store/task";

export const description = "Task completion rate";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--color-chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function ChartCompletionRate() {
  const { tasks } = useTaskStore();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) => t.status === "Completed"
    ).length;

    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, rate };
  }, [tasks]);

  const chartData = [
    {
      total: stats.total,
      completed: stats.completed,
    },
  ];

  return (
    <Card className="flex flex-col h-full justify-between">
      <CardHeader className="items-center pb-0">
        <CardTitle>Completion Rate</CardTitle>
        <CardDescription>Overall task progress</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={200}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;

                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {stats.rate}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 14}
                        className="fill-muted-foreground text-sm"
                      >
                        {stats.completed} / {stats.total} tasks
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>

            <RadialBar
              dataKey="total"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.total.color}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="completed"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.completed.color}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
