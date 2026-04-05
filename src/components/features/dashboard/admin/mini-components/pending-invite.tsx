"use client";

import { Span, Text } from "@/components/ui/typography/Text";
import { PendingInvite } from "@/types/user";

type PendingInvitesListProps = {
  invites: PendingInvite[];
};

export function PendingInvitesList({ invites }: PendingInvitesListProps) {
  if (invites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
        >
          <div className="flex-1">
            <Text variant="default">{invite.name}</Text>
            <Text variant="muted">
              {invite.role} · {invite.email}
            </Text>
          </div>
          <Span variant="pending" className="px-3 py-1  rounded-md">
            Pending
          </Span>
        </div>
      ))}
    </div>
  );
}
