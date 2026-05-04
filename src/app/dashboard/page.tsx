"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchOverview } from "@/services/overviewServices";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { getCurrentUserProfile } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import { PlanType } from "@/lib/enums";
import { useToast } from "@/hooks/use-toast";

const planBadgeClass = {
  Enterprise: "bg-green-100 text-green-700",
  Growth: "bg-blue-100 text-blue-700",
  Starter: "bg-amber-100 text-amber-700",
  Expansion: "bg-yellow-100 text-amber-700",
};

const colorMap = {
  ENTERPRISE: "bg-green-500",
  EXPANSION: "bg-purple-500",
  GROWTH: "bg-blue-500",
  STARTER: "bg-amber-500",
};

export default function OverviewDashboard() {
  const [displayName, setDisplayName] = useState("Admin");
  const { toast } = useToast();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchOverview();
        setOverview(data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch Churches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    const profile = getCurrentUserProfile();
    if (profile?.firstName) {
      setDisplayName(profile.firstName);
    } else if (profile?.fullName) {
      setDisplayName(profile.fullName);
    }
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const total =
    (overview?.churchesByPlan?.ENTERPRISE ?? 0) +
    (overview?.churchesByPlan?.EXPANSION ?? 0) +
    (overview?.churchesByPlan?.GROWTH ?? 0) +
    (overview?.churchesByPlan?.STARTER ?? 0);

  const planDistribution = [
    {
      name: "Enterprise",
      type: PlanType.ENTERPRISE,
      count: overview?.churchesByPlan?.ENTERPRISE ?? 0,
    },
    {
      name: "Expansion",
      type: PlanType.EXPANSION,
      count: overview?.churchesByPlan?.EXPANSION ?? 0,
    },
    {
      name: "Growth",
      type: PlanType.GROWTH,
      count: overview?.churchesByPlan?.GROWTH ?? 0,
    },
    {
      name: "Starter",
      type: PlanType.STARTER,
      count: overview?.churchesByPlan?.STARTER ?? 0,
    },
  ].map((plan) => {
    const safeCount = Number(plan.count) || 0;

    const percentage = total > 0 ? (safeCount / total) * 100 : 0;

    return {
      ...plan,
      percentage: Math.min(Math.max(percentage, 0), 100),
    };
  });

  const getColor = (type: string) => {
    switch (type) {
      case "ENTERPRISE":
        return "bg-green-500";
      case "EXPANSION":
        return "bg-amber-500";
      case "GROWTH":
        return "bg-blue-500";
      case "STARTER":
        return "bg-amber-500";
      default:
        return "bg-gray-400";
    }
  };
  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-6">
            <Heading level={1} text={`${greeting}, ${displayName}`} />
            <Text
              text="Here's what's happening across the platform today."
              variant="muted"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Churches"
              count={overview?.totalChurches ?? 0}
              growth={`${overview?.newChurchesLast30Days ?? 0} this month`}
            />

            <StatCard
              title="Total Members"
              count={overview?.totalMembers ?? 0}
              growth="Across all churches"
            />

            <StatCard
              title="Active Plans"
              count={overview?.totalActivePlans ?? 0}
              growth={`${overview?.totalStarterPlans ?? 0} Starter`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Churches by Plan */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Churches by Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {planDistribution.map((plan) => (
                  <div key={plan.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <Span text={plan.name} />
                      <Span text={`${plan.count} churches`} variant="muted" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          getColor(plan.type),
                        )}
                        style={{ width: `${plan.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overview?.recentActivities.map((activity: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5",
                        activity.color,
                      )}
                    />
                    <div>
                      <Text text={activity.text} className="text-sm" />
                      <Span
                        text={activity.time}
                        variant="muted"
                        className="text-xs"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Churches Table */}
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-medium">
                Top Churches by Member Count
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/churches">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Church
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Members
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">
                        Plan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview?.topChurchByMembers?.map((church: any) => (
                      <tr
                        key={church.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback
                                className={cn(
                                  "text-xs font-medium",
                                  church.plan === "Enterprise"
                                    ? "bg-green-100 text-green-700"
                                    : church.plan === "Growth"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700",
                                )}
                              >
                                {church.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{church.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {church.location}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {church.membersCount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              planBadgeClass[
                                church.plan as keyof typeof planBadgeClass
                              ],
                            )}
                          >
                            {church.plan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
