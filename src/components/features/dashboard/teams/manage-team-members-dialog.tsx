"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberProfile, TeamRow } from "@/types";
import Heading from "@/components/ui/typography/Heading";
import { MemberMultiSelect } from "@/components/features/dashboard/departments/member-selectors";
import { Span, Text } from "@/components/ui/typography/Text";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: TeamRow | null;
  members: MemberProfile[];
  memberIds: string[];
  onSave: (nextMemberIds: string[]) => void | Promise<void>;
}

export default function ManageTeamMembersDialog({
  open,
  onOpenChange,
  team,
  members,
  memberIds,
  onSave,
}: Props) {
  const isMobile = useIsMobile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSelectedPanel, setShowSelectedPanel] = useState(false);
  const [panelQuery, setPanelQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedIds(memberIds);
    setShowSelectedPanel(false);
    setPanelQuery("");
  }, [open, memberIds]);

  const selectedMembers = useMemo(() => {
    if (!selectedIds.length) return [];
    return members.filter((member) => selectedIds.includes(member.id));
  }, [selectedIds, members]);

  const panelMembers = useMemo(() => {
    if (!panelQuery.trim()) return selectedMembers;
    const query = panelQuery.toLowerCase();
    return selectedMembers.filter(
      (member) =>
        member.fullName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query),
    );
  }, [panelQuery, selectedMembers]);

  function removeSelectedMember(id: string) {
    setSelectedIds((prev) => prev.filter((memberId) => memberId !== id));
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showClose={false}
          mobileSheet={isMobile}
          className={cn("!p-0 !bg-transparent !shadow-none !border-none")}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl shadow-lg w-full sm:w-[460px] h-full flex flex-col overflow-hidden bg-gray-50">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <Heading level={2}>
                  Manage Members {team ? `- ${team.name}` : ""}
                </Heading>

                <DialogClose asChild>
                  <Button
                    className="p-2"
                    size="icon"
                    variant="ghost"
                    aria-label="Close dialog"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>

              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
                <div className="space-y-2">
                  {selectedIds.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Span>Selected Members</Span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSelectedPanel(true)}
                          className="h-7"
                        >
                          View All Members
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedIds.slice(0, 3).map((id) => {
                          const member = members.find((m) => m.id === id);
                          if (!member) return null;

                          return (
                            <Span
                              key={id}
                              variant="chip"
                              className="inline-flex items-center gap-1 "
                            >
                              {member.fullName.split(" ")[0]}
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeSelectedMember(id)}
                                aria-label={`Remove ${member.fullName}`}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Span>
                          );
                        })}
                        {selectedIds.length > 3 && (
                          <Span variant="chip" className="inline-flex">
                            +{selectedIds.length - 3} others
                          </Span>
                        )}
                      </div>
                    </div>
                  )}
                  <Label>Add Members</Label>
                  <MemberMultiSelect
                    options={members}
                    value={selectedIds}
                    onChange={setSelectedIds}
                    placeholder="Select or search"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                <Button
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      await onSave(selectedIds);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  className="px-6"
                  disabled={isSaving}
                >
                  {isSaving ? "Updating..." : "Update Members"}
                </Button>
              </div>
            </div>

            {!isMobile && showSelectedPanel && (
              <div className="hidden sm:flex rounded-xl shadow-lg w-[340px] h-[80vh] flex-col overflow-hidden bg-gray-50">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <Heading level={3}>Selected Members</Heading>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSelectedPanel(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 border-b">
                  <Input
                    placeholder="Select or search"
                    value={panelQuery}
                    onChange={(e) => setPanelQuery(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {panelMembers.length === 0 ? (
                    <Text variant="muted">No members selected.</Text>
                  ) : (
                    panelMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Text variant="default" className="truncate">
                              {member.fullName}
                            </Text>
                            <Text variant="muted" className="truncate">
                              {member.email}
                            </Text>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSelectedMember(member.id)}
                          className="text-destructive-600 hover:text-destructive-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-gray-600">
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-800">
                      1
                    </span>
                    <span>2</span>
                    <span>Next</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {isMobile && showSelectedPanel && (
        <Dialog open={showSelectedPanel} onOpenChange={setShowSelectedPanel}>
          <DialogContent
            showClose={false}
            mobileSheet
            className="w-full max-w-[520px] p-0 overflow-hidden max-sm:max-h-[88vh] h-[80vh]"
          >
            <div className="rounded-xl shadow-lg w-full h-full flex flex-col overflow-hidden bg-gray-50">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <Heading level={3}>Selected Members</Heading>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSelectedPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 border-b">
                <Input
                  placeholder="Select or search"
                  value={panelQuery}
                  onChange={(e) => setPanelQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {panelMembers.length === 0 ? (
                  <Text variant="muted">No members selected.</Text>
                ) : (
                  panelMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Text variant="default" className="truncate">
                            {member.fullName}
                          </Text>
                          <Text variant="muted" className="truncate">
                            {member.email}
                          </Text>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSelectedMember(member.id)}
                        className="text-destructive-600 hover:text-destructive-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-gray-600">
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-gray-200 text-gray-800">
                    1
                  </span>
                  <span>2</span>
                  <span>Next</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  Next
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
