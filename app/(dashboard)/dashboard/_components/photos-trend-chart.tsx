"use client";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { getDashboardStats } from "@/lib/queries/stats";

interface PhotosTrendChartProps {
  stats: Awaited<ReturnType<typeof getDashboardStats>>;
  days?: number;
}

export function PhotosTrendChart({ stats, days = 14 }: PhotosTrendChartProps) {
  const data = stats.photosLastNDays.map((d) => ({
    date: d.date,
    label: format(parseISO(d.date), "MMM d"),
    count: d.count,
  }));

  return (
    <CardContent>
      {data.length ? (
        <ChartContainer
          config={{
            count: { label: "Photos", color: "hsl(var(--primary))" },
          }}
          className="w-full h-64"
        >
          <AreaChart
            data={data}
            margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="fillCount" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={data.length > 10 ? 1 : 0}
              className="text-xs"
            />
            <YAxis
              width={30}
              tickLine={false}
              axisLine={false}
              className="text-xs"
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              content={<ChartTooltipContent nameKey="label" />}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#fillCount)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      ) : (
        <p className="text-sm text-muted-foreground">
          No uploads in the selected window.
        </p>
      )}
      {stats.error && (
        <p className={cn("text-xs mt-2", stats.error && "text-destructive")}>
          Error: {stats.error}
        </p>
      )}
    </CardContent>
  );
}
