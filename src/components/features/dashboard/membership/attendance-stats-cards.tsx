"use client";

import { Card } from "@/components/ui/card";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";

type AttendanceStatsCardsProps = {
  servicesAttended: number;
  servicesMissed: number;
  attendanceRate: number;
};

export function AttendanceStatsCards({
  servicesAttended,
  servicesMissed,
  attendanceRate,
}: AttendanceStatsCardsProps) {
  const stats = [
    {
      label: "Services Attended",
      value: servicesAttended,
      textColor: "text-blue-700",
    },
    {
      label: "Services Missed",
      value: servicesMissed,
      textColor: "text-red-700",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      textColor: "text-green-700",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <Heading level={2} className={`${stat.textColor} items-center mb-1`}>
            {stat.value}
          </Heading>
          <Text variant="label" className="mb-2">
            {stat.label}
          </Text>
        </Card>
      ))}
    </div>
  );
}
