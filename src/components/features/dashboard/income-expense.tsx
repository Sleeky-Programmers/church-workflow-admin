"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

function getDateRange(data: { month: string }[]) {
  if (!data.length) return "";
  return `${data[0].month} - ${data[data.length - 1].month}`;
}

export function IncomeVsExpenses() {
  const zeroIncomeData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      income: 0,
      expenses: 0,
    };
  });

  const range = getDateRange(zeroIncomeData);

  return (
    <Card className="rounded-3xl p-3 h-full w-full">
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <Heading level={4} text="Income vs Expenses" />
          <Span text={range} variant="default" />
        </div>

        <div className="mt-4">
          <ChartContainer
            className="w-full aspect-auto h-[260px] sm:h-[300px] overflow-hidden p-2 sm:p-3"
            config={{
              income: { color: "#2563EB" },
              expenses: { color: "#F97316" },
            }}
          >
            <BarChart
              data={zeroIncomeData}
              margin={{ top: 10, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={32} />
              <Tooltip content={<ChartTooltipContent />} />

              <Bar
                dataKey="income"
                fill="var(--color-income)"
                barSize={18}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                barSize={18}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Span className="w-3 h-3 rounded-sm bg-primary-600" />
              <Text text="Income" />
            </div>

            <div className="flex items-center gap-2">
              <Span className="w-3 h-3 rounded-sm bg-orange-500" />
              <Text text="Expenses" />
            </div>
          </div>

          <Link
            href="/dashboard/finance"
            className="text-sm text-primary-600 hover:underline"
          >
            View all
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
