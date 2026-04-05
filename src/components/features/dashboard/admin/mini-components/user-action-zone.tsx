"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/typography/Heading";
import { UserStatus } from "@/types/user";
import { AlertTriangle, Clock, Ban } from "lucide-react";
import { Text } from "@/components/ui/typography/Text";

type ActionZoneConfig = {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "warning" | "danger" | "info";
  primaryAction: {
    label: string;
    variant: "default" | "destructive" | "outline";
    onClick: () => void;
  };
  secondaryAction: {
    label: string;
    variant: "default" | "destructive" | "outline";
    onClick: () => void;
  };
};

type UserActionZoneProps = {
  status: UserStatus;
  onSuspend: () => void;
  onRemove: () => void;
  onResendInvite: () => void;
  onDeleteInvite: () => void;
  onReinstate: () => void;
};

export function UserActionZone({
  status,
  onSuspend,
  onRemove,
  onResendInvite,
  onDeleteInvite,
  onReinstate,
}: UserActionZoneProps) {
  const getActionConfig = (): ActionZoneConfig => {
    switch (status) {
      case "active":
        return {
          title: "Danger Zone",
          description:
            "Deactivating a user will immediately revoke their access.",
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          variant: "danger",
          primaryAction: {
            label: "Suspend User",
            variant: "outline",
            onClick: onSuspend,
          },
          secondaryAction: {
            label: "Remove User",
            variant: "destructive",
            onClick: onRemove,
          },
        };

      case "pending":
        return {
          title: "Pending User",
          description:
            "This user is pending activation. You can resend the invitation or delete it.",
          icon: <Clock className="h-5 w-5 text-orange-600" />,
          variant: "info",
          primaryAction: {
            label: "Resend Invitation",
            variant: "default",
            onClick: onResendInvite,
          },
          secondaryAction: {
            label: "Delete Invite",
            variant: "destructive",
            onClick: onDeleteInvite,
          },
        };

      case "suspended":
        return {
          title: "Suspended User",
          description:
            "This user's account is suspended. You may reinstate access or permanently remove the user.",
          icon: <Ban className="h-5 w-5 text-orange-600" />,
          variant: "warning",
          primaryAction: {
            label: "Reinstate User",
            variant: "default",
            onClick: onReinstate,
          },
          secondaryAction: {
            label: "Remove User",
            variant: "destructive",
            onClick: onRemove,
          },
        };
    }
  };

  const config = getActionConfig();

  const getZoneClasses = () => {
    switch (config.variant) {
      case "danger":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getZoneClasses()}`}>
      <Heading level={4}>{config.title}</Heading>
      <div className="flex items-center justify-between mt-1 gap-4">
        <Text variant="default" className="text-muted-foreground flex-1">
          {config.description}
        </Text>
      </div>
      <div className=" mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Button
          variant={config.primaryAction.variant}
          onClick={config.primaryAction.onClick}
        >
          {config.primaryAction.label}
        </Button>
        <Button
          variant={config.secondaryAction.variant}
          onClick={config.secondaryAction.onClick}
        >
          {config.secondaryAction.label}
        </Button>
      </div>
    </div>
  );
}
