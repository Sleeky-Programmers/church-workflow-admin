"use client";

import { useEffect, useState } from "react";
import { MemberAttendanceRecord, MemberProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/ui/typography/Heading";
import { Span, Text } from "@/components/ui/typography/Text";
import { MemberOverviewTab } from "./member-overview-tab";
import { MemberAttendanceTab } from "./member-attendance-tab";
import { fetchMemberAttendanceHistory } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { EditMemberModal } from "./EditMemberModal";
import { updateMember } from "@/services/memberService";

type MemberDetailsPageProps = {
  member: MemberProfile;
  onBack: () => void;
};

export function MemberDetailsPage({ member, onBack }: MemberDetailsPageProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "attendance">(
    "overview",
  );
  const [filterValue, setFilterValue] = useState("all");
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentMember, setCurrentMember] = useState(member);
  const [attendanceRecords, setAttendanceRecords] = useState<
    MemberAttendanceRecord[]
  >([]);
  const [attendanceStats, setAttendanceStats] = useState({
    attended: member.servicesAttended || 0,
    missed: member.servicesMissed || 0,
    total: (member.servicesAttended || 0) + (member.servicesMissed || 0),
    rate: member.attendanceRate || 0,
  });
  const [attendanceTrends, setAttendanceTrends] = useState<
    { month: string; attended: number; total: number; rate: number }[]
  >([]);

  useEffect(() => {
    const loadAttendance = async () => {
      setIsAttendanceLoading(true);
      try {
        const response = await fetchMemberAttendanceHistory(member.id);
        const normalizedRecords: MemberAttendanceRecord[] = (
          response.records || []
        ).map((record) => ({
          ...record,
          date: (() => {
            const parsed = new Date(record.date);
            return Number.isNaN(parsed.getTime())
              ? record.date
              : parsed.toISOString().split("T")[0];
          })(),
        }));
        setAttendanceRecords(normalizedRecords);
        setAttendanceStats(response.stats);
        setAttendanceTrends(response.trends || []);
      } catch (error: any) {
        toast({
          title: "Unable to load attendance",
          description: error?.message || "Please try again.",
          variant: "destructive",
        });
        setAttendanceRecords(member.attendanceRecords || []);
      } finally {
        setIsAttendanceLoading(false);
      }
    };
    loadAttendance();
  }, [member.id, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-2 sm:left-6 gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <Span variant="default" className="hidden sm:inline">
              Back
            </Span>
          </Button>
          <Heading level={2}>Member Details</Heading>
        </div>
      </div>

      <div className="bg-white border-b px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gray-900 text-white text-lg font-semibold">
              {currentMember.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <Heading level={3} className="mb-1">
              {currentMember.fullName}
            </Heading>
            <Text variant="muted" className="text-sm">
              {currentMember.email}
            </Text>
          </div>
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-4 sm:px-6 gap-2">
          <div className="flex gap-1">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "attendance" ? "default" : "ghost"}
              onClick={() => setActiveTab("attendance")}
            >
              Attendance
            </Button>
          </div>

          {activeTab === "overview" ? (
            <Button
              variant="outline"
              className="flex items-center gap-2 h-8 sm:h-9"
              onClick={() => setOpenEdit(true)}
            >
              <Edit className="h-4 w-4" />
              <Span className="hidden sm:inline">Edit</Span>
            </Button>
          ) : (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[110px] sm:w-[120px] h-8 sm:h-9">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-3 sm:p-6">
        {activeTab === "overview" && (
          <MemberOverviewTab
            member={currentMember}
            attendanceStats={attendanceStats}
          />
        )}
        {activeTab === "attendance" && (
          <MemberAttendanceTab
            records={attendanceRecords}
            filterValue={filterValue}
            stats={attendanceStats}
            trends={attendanceTrends}
            isLoading={isAttendanceLoading}
          />
        )}
      </div>

      {openEdit && (
        <EditMemberModal
          member={currentMember}
          onClose={() => setOpenEdit(false)}
          onSave={async (data) => {
            try {
              const updated = await updateMember(currentMember.id, data);

              setCurrentMember((prev) => ({
                ...prev,
                ...updated,
              }));
              toast({
                title: "Member updated",
                description: "Changes saved successfully",
              });

              setOpenEdit(false);
            } catch (error: any) {
              toast({
                title: "Update failed",
                description: error?.message || "Something went wrong",
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </div>
  );
}
