"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  TimerPlan,
  updateTimerPlan,
  UpdateTimerPlanPayload,
} from "@/services/timerPlanService";

type EditTimerPlanDrawerProps = {
  plan: TimerPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (plan: TimerPlan) => void;
};

type FormState = {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  userLimit: string;
  importLimit: string;
  branchLimit: string;
  customBranding: boolean;
};

function toFormState(plan: TimerPlan): FormState {
  return {
    name: plan.name,
    monthlyPrice: String(plan.monthlyPrice),
    yearlyPrice: String(plan.yearlyPrice),
    userLimit: String(plan.userLimit),
    importLimit: String(plan.importLimit),
    branchLimit: String(plan.branchLimit),
    customBranding: plan.customBranding,
  };
}

const whole = (value: string) => /^\d+$/.test(value.trim());

/** What's wrong with the form, if anything (the backend checks the same). */
function problem(form: FormState, paid: boolean): string | null {
  if (!form.name.trim()) return "Give the plan a name.";
  const numbers = paid
    ? [
        form.monthlyPrice,
        form.yearlyPrice,
        form.userLimit,
        form.importLimit,
        form.branchLimit,
      ]
    : [form.userLimit, form.importLimit, form.branchLimit];
  if (!numbers.every(whole))
    return "Prices and limits must be whole numbers, 0 or more.";
  if (paid && (Number(form.monthlyPrice) <= 0 || Number(form.yearlyPrice) <= 0))
    return "The Church plan needs a monthly and a yearly price above ₦0.";
  return null;
}

export function EditTimerPlanDrawer({
  plan,
  open,
  onOpenChange,
  onSaved,
}: EditTimerPlanDrawerProps) {
  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm(toFormState(plan));
    }
  }, [plan]);

  const update = (patch: Partial<FormState>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const paid = plan?.plan === "CHURCH";
  const error = form ? problem(form, paid) : null;
  const priceChanged =
    !!plan &&
    !!form &&
    paid &&
    (Number(form.monthlyPrice) !== plan.monthlyPrice ||
      Number(form.yearlyPrice) !== plan.yearlyPrice);
  const renewing = plan?.autoRenewing
    ? plan.autoRenewing.monthly + plan.autoRenewing.yearly
    : 0;

  const handleSave = async () => {
    if (!plan || !form || error) return;

    const payload: UpdateTimerPlanPayload = {
      name: form.name.trim(),
      userLimit: Number(form.userLimit),
      importLimit: Number(form.importLimit),
      branchLimit: Number(form.branchLimit),
      customBranding: form.customBranding,
      ...(paid
        ? {
            monthlyPrice: Number(form.monthlyPrice),
            yearlyPrice: Number(form.yearlyPrice),
          }
        : {}),
    };

    setIsSaving(true);
    try {
      const { paystack, ...updated } = await updateTimerPlan(
        plan.plan,
        payload,
      );
      const failed = paystack.reduce((n, p) => n + p.failed, 0);
      if (failed) {
        toast.warning(
          `${plan.name} plan saved, but Paystack didn't accept the new price on ${failed} renewal plan${failed === 1 ? "" : "s"}. New sign-ups pay the new price; check those renewals in Paystack.`,
        );
      } else {
        toast.success(`Service Timer ${updated.name} plan updated`);
      }
      onSaved(updated);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update plan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent direction="right" className="p-0">
        <DrawerHeader className="text-left px-6 pt-6">
          <DrawerTitle>Edit Service Timer {plan?.name} plan</DrawerTitle>
        </DrawerHeader>

        <Separator />

        {form && (
          <div className="space-y-4 px-6 py-5 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="timer-name">Display name</Label>
              <Input
                id="timer-name"
                value={form.name}
                maxLength={40}
                onChange={(e) => update({ name: e.target.value })}
                disabled={isSaving}
              />
            </div>

            {paid ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timer-monthlyPrice">
                      Monthly price (₦)
                    </Label>
                    <Input
                      id="timer-monthlyPrice"
                      type="number"
                      min={1}
                      value={form.monthlyPrice}
                      onChange={(e) => update({ monthlyPrice: e.target.value })}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timer-yearlyPrice">Yearly price (₦)</Label>
                    <Input
                      id="timer-yearlyPrice"
                      type="number"
                      min={1}
                      value={form.yearlyPrice}
                      onChange={(e) => update({ yearlyPrice: e.target.value })}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Price changes also update live Paystack plans, so
                  auto-renewals charge the new price from their next renewal.
                  {renewing > 0
                    ? ` ${renewing} ${renewing === 1 ? "church renews" : "churches renew"} automatically today.`
                    : ""}
                </p>
                {priceChanged && renewing > 0 ? (
                  <p
                    className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
                    role="status"
                  >
                    Saving changes what{" "}
                    {renewing === 1
                      ? "this church is"
                      : `these ${renewing} churches are`}{" "}
                    charged at {renewing === 1 ? "its" : "their"} next renewal.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                The Free plan has no price. Its limits are what timer-only
                churches get without paying.
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Limits: 0 means unlimited. Saving a limit change applies it to
              every church on this plan straight away.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timer-userLimit">People using the timer</Label>
                <Input
                  id="timer-userLimit"
                  type="number"
                  min={0}
                  value={form.userLimit}
                  onChange={(e) => update({ userLimit: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timer-importLimit">Smart imports a month</Label>
                <Input
                  id="timer-importLimit"
                  type="number"
                  min={0}
                  value={form.importLimit}
                  onChange={(e) => update({ importLimit: e.target.value })}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timer-branchLimit">Branches</Label>
                <Input
                  id="timer-branchLimit"
                  type="number"
                  min={0}
                  value={form.branchLimit}
                  onChange={(e) => update({ branchLimit: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="timer-customBranding">
                  Own logo and colours
                </Label>
                <p className="text-xs text-muted-foreground">
                  Off: colour presets only, with a small Service Timer mark on
                  the display.
                </p>
              </div>
              <Switch
                id="timer-customBranding"
                checked={form.customBranding}
                onCheckedChange={(checked) =>
                  update({ customBranding: checked })
                }
                disabled={isSaving}
              />
            </div>

            {error ? <p className="text-xs text-red-600">{error}</p> : null}
          </div>
        )}

        <DrawerFooter className="flex-row justify-end gap-3 border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !form || !!error}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
