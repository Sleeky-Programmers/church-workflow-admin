import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/typography/Heading";
import { Span } from "@/components/ui/typography/Text";

export const StatCard = ({
  title,
  count,
  growth,
  growthText,
  statFilter,
  compact,
  className,
}: {
  title: string;
  count: string | number;
  growth: string;
  growthText?: string;
  statFilter?: string;
  compact?: boolean;
  className?: string;
}) => {
  const isPositiveGrowth = growth.startsWith("+");
  const Icon = isPositiveGrowth ? TrendingUp : TrendingDown;

  const sizeClasses = compact
    ? "w-full min-w-0 sm:min-w-[220px] h-[120px]"
    : "w-full min-w-0 sm:min-w-[260px] h-[150px]";

  return (
    <Card
      className={cn(
        sizeClasses,
        "bg-[#E7EFF7] shadow-none rounded-3xl overflow-hidden",
        className,
      )}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading level={5} text={title} />
            {statFilter && (
              <Button
                variant="ghost"
                className="hidden sm:flex items-center gap-2 hover:bg-transparent outline-0"
              >
                {statFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Heading level={1} text={count} />

            <div className="flex items-center justify-end gap-2">
              <div className="text-sm flex items-end justify-between flex-col gap-1">
                {growthText && <Span text={growthText} />}
                <Span text={growth} />
              </div>

              <div
                className={`${isPositiveGrowth ? "bg-success-500" : "bg-destructive-500"} rounded-xl p-2 flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
