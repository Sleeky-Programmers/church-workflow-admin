"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import Heading from "@/components/ui/typography/Heading";
import { ChartContainer } from "@/components/ui/chart";
import { Span, Text } from "@/components/ui/typography/Text";

const ZERO_INCOME_BREAKDOWN = [
  { name: "Tithes", value: 0, color: "#2563EB" },
  { name: "Offering", value: 0, color: "#F97316" },
  { name: "Seeds", value: 0, color: "#10B981" },
  { name: "Donations", value: 0, color: "#EF4444" },
];

export function IncomeBreakdown() {
  const top = ZERO_INCOME_BREAKDOWN[0];

  const config = ZERO_INCOME_BREAKDOWN.reduce(
    (acc, item) => {
      acc[item.name] = { color: item.color };
      return acc;
    },
    {} as Record<string, { color: string }>,
  );

  return (
    <Card className="rounded-3xl p-3 h-full">
      <CardContent>
        <Heading level={4} text="Income Breakdown" />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <ChartContainer
            className="w-full aspect-auto h-[180px] sm:h-[160px] overflow-hidden"
            config={config}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ZERO_INCOME_BREAKDOWN}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  cx="50%"
                  cy="50%"
                >
                  {ZERO_INCOME_BREAKDOWN.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>

                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "14px", fill: "var(--muted-foreground)" }}
                >
                  {top.name}
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    fill: "var(--foreground)",
                  }}
                >
                  {top.value}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="space-y-2">
            <Text variant="muted" className="text-sm">
              No income records yet.
            </Text>
            {ZERO_INCOME_BREAKDOWN.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <Span className="truncate">{item.name}</Span>
                </div>
                <Span className="font-mono">{item.value}%</Span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
