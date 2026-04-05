"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Span, Text } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";
import { MemberProfile, RegularService, TeamRow } from "@/types";
import { SelectMembersView } from "@/components/features/dashboard/attendance/select-member-view";
import { useAttendanceModal } from "@/hooks/useAttendanceModal";
import { cn, convertTo12Hour } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamRow | null;
  members: MemberProfile[];
  services: RegularService[];
  teamMemberIds: string[];
  onSaveAttendance: (payload: {
    serviceId: string;
    date: string;
    memberIds: string[];
  }) => Promise<void> | void;
};

const getServiceLabel = (service: RegularService) => {
  return service.serviceName;
};

export default function MarkTeamAttendanceDialog({
  open,
  onOpenChange,
  team,
  members,
  services,
  teamMemberIds,
  onSaveAttendance,
}: Props) {
  const isMobile = useIsMobile();
  const {
    state,
    setMembers,
    toggleMember,
    markPresent,
    removeMember,
    undoRemove,
    moveToPresent,
    setLoading,
    setSearch,
    reset,
    getPresentMembers,
    getAbsentMembers,
  } = useAttendanceModal();

  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [membersViewMode, setMembersViewMode] = useState<
    "select" | "present" | "absent"
  >("select");
  const [absentSelections, setAbsentSelections] = useState<string[]>([]);
  const [hasMembersLoaded, setHasMembersLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) || null,
    [serviceId, services],
  );

  useEffect(() => {
    if (!open) return;
    reset();
    setIsMembersDialogOpen(false);
    setMembersViewMode("select");
    setAbsentSelections([]);
    setHasMembersLoaded(false);
    setIsSaving(false);
    setIsEditMode(true);
  }, [open, reset]);

  const ensureMembersLoaded = async () => {
    if (hasMembersLoaded) return;
    setLoading(true);
    try {
      const filtered = members
        .filter((member) => teamMemberIds.includes(member.id))
        .map((member) => ({
          id: member.id,
          name: member.fullName,
          email: member.email,
          initials: member.initials,
        }));
      setMembers(filtered);
      setHasMembersLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMembers = async () => {
    await ensureMembersLoaded();
    setSearch("");
    setMembersViewMode("select");
    setIsMembersDialogOpen(true);
  };

  const openPresentMembersView = async () => {
    await ensureMembersLoaded();
    setMembersViewMode("present");
    setSearch("");
    setIsMembersDialogOpen(true);
  };

  const openAbsentMembersView = async () => {
    await ensureMembersLoaded();
    setMembersViewMode("absent");
    setSearch("");
    setAbsentSelections([]);
    setIsMembersDialogOpen(true);
  };

  const handleAbsentSelection = (memberId: string, selected: boolean) => {
    setAbsentSelections((prev) =>
      selected
        ? prev.includes(memberId)
          ? prev
          : [...prev, memberId]
        : prev.filter((id) => id !== memberId),
    );
  };

  const handleMarkPresent = () => {
    markPresent(state.presentMembers);
    if (isMobile) {
      setIsMembersDialogOpen(false);
    }
  };

  const handleMarkAbsentAsPresent = () => {
    moveToPresent(absentSelections);
    setAbsentSelections([]);
    if (isMobile) {
      setIsMembersDialogOpen(false);
    }
  };

  const handleUpdatePresentRecord = () => {
    if (isMobile) {
      setIsMembersDialogOpen(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsMembersDialogOpen(false);
    setMembersViewMode("select");
    setAbsentSelections([]);
    setHasMembersLoaded(false);
    onOpenChange(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveAttendance({
        serviceId,
        date,
        memberIds: state.presentMembers,
      });
      setIsEditMode(false);
    } finally {
      setIsSaving(false);
    }
  };

  const presentMembers = getPresentMembers();
  const absentMembers = getAbsentMembers();
  const presentCount = presentMembers.length;
  const absentCount = absentMembers.length;

  const attendanceRatio = teamMemberIds.length
    ? Math.round((presentCount / teamMemberIds.length) * 100)
    : 0;

  const summaryCard = (
    <div className="rounded-xl shadow-lg w-full sm:w-[460px] h-full flex flex-col overflow-hidden bg-gray-50">
      <DialogHeader className="px-6 py-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold">
              Mark Attendance {team ? `- ${team.name}` : ""}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>

      <div className="p-4 sm:p-6 space-y-4">
        {isEditMode ? (
          <>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Select Service</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select or search" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex flex-col">
                        <Span>{getServiceLabel(service)}</Span>
                        <Span className="text-xs text-muted-foreground">
                          Regular Service
                        </Span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Span>{format(new Date(date), "MMMM d, yyyy")}</Span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Span>Offline</Span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Span>
                {selectedService?.startTime
                  ? convertTo12Hour(selectedService.startTime)
                  : "8am"}
              </Span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <Span className="truncate">
                {selectedService?.location || "7 Gimbiya St, Garki, Abuja"}
              </Span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Heading level={4}>Members Attendance</Heading>
          {isEditMode ? (
            <Button
              onClick={loadAllMembers}
              className="bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              Load members
            </Button>
          ) : (
            <span className="rounded-full px-2 py-1 text-xs bg-rose-50 text-rose-600">
              {presentCount}/{teamMemberIds.length} present ({attendanceRatio}%)
            </span>
          )}
        </div>

        {isEditMode ? (
          <div className="space-y-3">
            {hasMembersLoaded && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={openPresentMembersView}
                  className={cn(
                    "w-full p-3 rounded-xl border border-primary-500 bg-white text-left transition-colors",
                    "hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                      <Search className="h-4 w-4 text-primary-600" />
                    </span>
                    <div className="flex-1">
                      <Text className="mb-1 font-medium">Present Members</Text>
                      <Text variant="muted">{presentCount} present</Text>
                    </div>
                    <span className="text-gray-700">›</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={openAbsentMembersView}
                  className={cn(
                    "w-full p-3 rounded-xl border border-gray-300 bg-white text-left transition-colors",
                    "hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
                      <X className="h-4 w-4 text-destructive-600" />
                    </span>
                    <div className="flex-1">
                      <Text className="mb-1 font-medium">Absent Members</Text>
                      <Text variant="muted">{absentCount} absent</Text>
                    </div>
                    <span className="text-gray-700">›</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={openPresentMembersView}
              className={cn(
                "w-full p-3 rounded-xl border border-primary-500 bg-white text-left transition-colors",
                "hover:bg-gray-50",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100">
                  <Search className="h-4 w-4 text-primary-600" />
                </span>
                <div className="flex-1">
                  <Text className="mb-1 font-medium">Present Members</Text>
                  <Text variant="muted">{presentCount} present</Text>
                </div>
                <span className="text-gray-700">›</span>
              </div>
            </button>

            <button
              type="button"
              onClick={openAbsentMembersView}
              className={cn(
                "w-full p-3 rounded-xl border border-gray-300 bg-white text-left transition-colors",
                "hover:bg-gray-50",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
                  <X className="h-4 w-4 text-destructive-600" />
                </span>
                <div className="flex-1">
                  <Text className="mb-1 font-medium">Absent Members</Text>
                  <Text variant="muted">{absentCount} absent</Text>
                </div>
                <span className="text-gray-700">›</span>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="px-6 py-4 mt-auto">
        {isEditMode ? (
          <Button
            onClick={handleSave}
            disabled={!serviceId || isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button onClick={() => setIsEditMode(true)} className="w-full">
            Edit
          </Button>
        )}
      </div>
    </div>
  );

  const panelMembers =
    membersViewMode === "present"
      ? presentMembers
      : membersViewMode === "absent"
        ? absentMembers
        : state.allMembers;

  const panelTitle =
    membersViewMode === "present"
      ? "Present Members"
      : membersViewMode === "absent"
        ? "Absent Members"
        : "Select Members";

  const panelActionLabel =
    membersViewMode === "present"
      ? isEditMode
        ? "Update Record"
        : "Close"
      : membersViewMode === "absent"
        ? isEditMode
          ? "Mark as present"
          : "Close"
        : "Mark as present";

  const membersCard = (
    <div className="rounded-xl shadow-lg w-full sm:w-[420px] h-[80vh] flex flex-col overflow-hidden bg-gray-50">
      <SelectMembersView
        mode={membersViewMode}
        title={panelTitle}
        actionLabel={panelActionLabel}
        editable={isEditMode}
        members={panelMembers}
        selectedMembers={
          membersViewMode === "absent"
            ? absentSelections
            : membersViewMode === "select"
              ? state.presentMembers
              : []
        }
        onToggleMember={
          membersViewMode === "absent"
            ? handleAbsentSelection
            : (memberId: any, selected: any) => {
                if (!selected && state.presentMembers.includes(memberId)) {
                  toggleMember(memberId);
                }

                if (selected && !state.presentMembers.includes(memberId)) {
                  toggleMember(memberId);
                }
              }
        }
        onAction={
          !isEditMode
            ? () => setIsMembersDialogOpen(false)
            : membersViewMode === "present"
              ? handleUpdatePresentRecord
              : membersViewMode === "absent"
                ? handleMarkAbsentAsPresent
                : handleMarkPresent
        }
        searchQuery={state.searchQuery}
        onSearchChange={setSearch}
        removedCount={state.removedMembers.length}
        onUndoRemove={undoRemove}
        onRemoveMember={removeMember}
      />
    </div>
  );

  if (isMobile) {
    const isSummaryOpen = open && !isMembersDialogOpen;
    const isMembersOpen = open && isMembersDialogOpen;

    return (
      <>
        <Dialog open={isSummaryOpen} onOpenChange={handleClose}>
          <DialogContent
            showClose={false}
            mobileSheet
            className="w-full max-w-[420px] p-0 overflow-hidden max-sm:max-h-[88vh]"
          >
            {summaryCard}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isMembersOpen}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setIsMembersDialogOpen(false);
          }}
        >
          <DialogContent
            showClose={false}
            mobileSheet
            className="w-full max-w-[520px] p-0 overflow-hidden max-sm:max-h-[88vh] h-[80vh]"
          >
            {membersCard}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showClose={false}
        className="!p-0 !bg-transparent !shadow-none !border-none !max-w-none !w-auto !h-auto"
      >
        <div className="flex items-start gap-4">
          {summaryCard}
          {isMembersDialogOpen && membersCard}
        </div>
      </DialogContent>
    </Dialog>
  );
}
