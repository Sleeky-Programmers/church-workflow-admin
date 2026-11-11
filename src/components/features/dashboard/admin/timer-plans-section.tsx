"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import {
  fetchTimerPlans,
  formatTimerLimit,
  TimerPlan,
} from "@/services/timerPlanService";

import { EditTimerPlanDrawer } from "./edit-timer-plan-drawer";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

const TH = "text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase";

/**
 * The Service Timer's own plans, for churches that use the timer without
 * Church Workflow. Church Workflow churches get the timer included.
 */
export function TimerPlansSection() {
  const [plans, setPlans] = useState<TimerPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<TimerPlan | null>(null);

  useEffect(() => {
    fetchTimerPlans()
      .then(setPlans)
      .catch((error: any) =>
        toast.error(error.message || "Failed to load Service Timer plans"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="mt-10">
      <div className="mb-6">
        <Heading level={2} text="Service Timer" />
        <Text
          text="Plans for churches that use the Service Timer on its own. Churches on Church Workflow get the timer included."
          variant="muted"
        />
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-2">
              <Loader />
              <Text text="Loading Service Timer plans..." variant="muted" />
            </div>
          ) : plans.length === 0 ? (
            <div className="py-16 text-center">
              <Text
                text="Couldn't load the Service Timer plans."
                variant="muted"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className={TH}>Plan</th>
                    <th className={TH}>Monthly</th>
                    <th className={TH}>Yearly</th>
                    <th className={TH}>Users</th>
                    <th className={TH}>Imports / month</th>
                    <th className={TH}>Branches</th>
                    <th className={TH}>Own branding</th>
                    <th className={TH}>Auto-renewing</th>
                    <th className={TH}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr
                      key={plan.plan}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">{plan.name}</td>
                      <td className="py-3 px-4">
                        {plan.plan === "FREE"
                          ? "—"
                          : formatNaira(plan.monthlyPrice)}
                      </td>
                      <td className="py-3 px-4">
                        {plan.plan === "FREE"
                          ? "—"
                          : formatNaira(plan.yearlyPrice)}
                      </td>
                      <td className="py-3 px-4">
                        {formatTimerLimit(plan.userLimit)}
                      </td>
                      <td className="py-3 px-4">
                        {formatTimerLimit(plan.importLimit)}
                      </td>
                      <td className="py-3 px-4">
                        {formatTimerLimit(plan.branchLimit)}
                      </td>
                      <td className="py-3 px-4">
                        {plan.customBranding ? "Yes" : "No"}
                      </td>
                      <td className="py-3 px-4">
                        {plan.autoRenewing
                          ? `${plan.autoRenewing.monthly} monthly · ${plan.autoRenewing.yearly} yearly`
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(plan)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <EditTimerPlanDrawer
        plan={editing}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSaved={(updated) =>
          setPlans((prev) =>
            prev.map((p) => (p.plan === updated.plan ? updated : p)),
          )
        }
      />
    </section>
  );
}
