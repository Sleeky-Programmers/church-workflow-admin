"use client";

import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/typography/Text";
import { TeamRow } from "@/types";

interface Props {
  team: TeamRow;
  onViewTeam: (team: TeamRow) => void;
}

export default function TeamsMobileCard({ team, onViewTeam }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Span>{team.name}</Span>
      <Button variant="outline" size="sm" onClick={() => onViewTeam(team)}>
        View Team
      </Button>
    </div>
  );
}
