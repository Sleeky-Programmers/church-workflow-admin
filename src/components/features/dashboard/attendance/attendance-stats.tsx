"use client";

import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Member } from "@/types";
import { calculateGenderSplit, cn } from "@/lib/utils";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";

type AttendanceStatsViewProps = {
  presentMembers: Member[];
  absentMembers: Member[];
  presentCount?: number;
  absentCount?: number;
  isMembersLoaded: boolean;
  isAttendanceMarked: boolean;
  showLoadMembersButton?: boolean;
  loadMembersMuted?: boolean;
  onLoadMembers: () => void;
  onOpenPresentMembers: () => void;
  onOpenAbsentMembers: () => void;
};

export function AttendanceStatsView({
  presentMembers,
  absentMembers,
  isMembersLoaded,
  isAttendanceMarked,
  showLoadMembersButton = true,
  loadMembersMuted = false,
  onLoadMembers,
  onOpenPresentMembers,
  onOpenAbsentMembers,
}: AttendanceStatsViewProps) {
  const presentSplit = calculateGenderSplit(presentMembers);
  const absentSplit = calculateGenderSplit(absentMembers);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 flex items-center justify-between gap-3">
        <Heading level={4}>Members Attendance</Heading>

        {showLoadMembersButton &&
          (!isMembersLoaded ? (
            <Button
              onClick={onLoadMembers}
              className={
                loadMembersMuted
                  ? "bg-gray-300 text-gray-700 hover:bg-gray-300 whitespace-nowrap"
                  : "bg-orange-600 hover:bg-orange-700 whitespace-nowrap"
              }
            >
              Load members
            </Button>
          ) : (
            <Button
              disabled
              className="bg-gray-300 text-gray-700 hover:bg-gray-300 whitespace-nowrap"
            >
              Members loaded
            </Button>
          ))}
      </div>

      <div className="flex-1 p-4">
        {isAttendanceMarked ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onOpenPresentMembers}
              className={cn(
                "w-full p-3 rounded-xl border border-primary-500 bg-gray-50 text-left transition-colors",
                "hover:bg-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                  <CheckCircle2 className="h-5 w-5 text-primary-600" />
                </span>
                <div className="flex-1">
                  <Text className="mb-1 font-medium">Present Members</Text>
                  <Text variant="muted">
                    {presentSplit.males} Males - {presentSplit.females} Females
                  </Text>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenAbsentMembers}
              className={cn(
                "w-full p-3 rounded-xl border border-gray-300 bg-gray-100 text-left transition-colors",
                "hover:bg-gray-200",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
                  <XCircle className="h-5 w-5 text-destructive-600" />
                </span>
                <div className="flex-1">
                  <Text className="mb-1 font-medium">Absent Members</Text>
                  <Text variant="muted">
                    {absentSplit.males} Males - {absentSplit.females} Females
                  </Text>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </div>
            </button>
          </div>
        ) : (
          <div className="h-full" />
        )}
      </div>
    </div>
  );
}
