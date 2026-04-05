"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import AddSmallTeamDialog from "./add-small-team-dialog";
import { MemberProfile } from "@/types";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  members: MemberProfile[];
  onSave: (payload: {
    name: string;
    leaderId: string;
    memberIds: string[];
    status: string;
    description: string;
  }) => Promise<void>;
}

export default function TeamsSearchBar({
  query,
  onQueryChange,
  members,
  onSave,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by Small Team, Member"
          leftIcon={<Search className="w-4 h-4" />}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-[300px]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="hidden sm:flex items-center gap-2">
          Filter
          <ChevronDown className="w-4 h-4" />
        </Button>
        <AddSmallTeamDialog members={members} onSave={onSave} />
      </div>
    </div>
  );
}
