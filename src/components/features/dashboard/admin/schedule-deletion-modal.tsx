"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { Text, Span } from "@/components/ui/typography/Text";

type ScheduleDeletionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (waitingPeriodDays: number) => void;
  isLoading?: boolean;
};

export function ScheduleDeletionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ScheduleDeletionDialogProps) {
  const [waitingPeriod, setWaitingPeriod] = useState("14");

  const handleConfirm = () => {
    onConfirm(parseInt(waitingPeriod));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule account deletion</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-secondary-100 p-4">
              <AlertTriangle className="h-8 w-8 text-secondary-600" />
            </div>
          </div>

          <DialogDescription className="text-center space-y-2">
            <Text variant="default">
              You are about to schedule the deletion of your account.
            </Text>
            <Text variant="default">
              Once scheduled, you will lose access immediately. Your account
              will be permanently deleted after the waiting period below.
            </Text>
          </DialogDescription>

          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Label htmlFor="waiting-period" className="text-sm font-medium">
              Waiting period
            </Label>
            <div className="flex items-center gap-3">
              <Select value={waitingPeriod} onValueChange={setWaitingPeriod}>
                <SelectTrigger id="waiting-period" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <Span variant="default">days</Span>
            </div>
            <Text variant="default">
              You can cancel the deletion within this period.
            </Text>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-destructive-600 hover:bg-destructive-700"
            >
              {isLoading ? "Scheduling..." : "Schedule deletion"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
