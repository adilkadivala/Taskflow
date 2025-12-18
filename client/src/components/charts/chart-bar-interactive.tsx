"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useTaskStore } from "@/store/task";
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

export const description = "A multiple bar chart";

const chartConfig = {
  high: {
    label: "High",
    color: "var(--color-chart-1)",
  },
  medium: {
    label: "Medium",
    color: "var(--color-chart-2)",
  },
  low: {
    label: "Low",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export function ChartBarPriority() {
  const { tasks } = useTaskStore();

  const chartData = useMemo(() => {
    const high = tasks.filter((t) => t.priority === "High").length;
    const medium = tasks.filter((t) => t.priority === "Medium").length;
    const low = tasks.filter((t) => t.priority === "Low").length;

    return [
      {
        label: "Tasks",
        high,
        medium,
        low,
      },
    ];
  }, [tasks]);
  return (
    <Card className="h-full justify-between">
      <CardHeader>
        <CardTitle>Task Priority </CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="high" fill={chartConfig.high.color} radius={4} />
            <Bar dataKey="medium" fill={chartConfig.medium.color} radius={4} />
            <Bar dataKey="low" fill={chartConfig.low.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
