"use client";

import { useMemo, useState } from "react";
import { Plus, RefreshCw, ExternalLink, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberProfile } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import Heading from "@/components/ui/typography/Heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MemberMultiSelect,
  MemberSingleSelect,
} from "@/components/features/dashboard/departments/member-selectors";
import { InviteUserDialog } from "@/components/features/dashboard/admin/invite-user";
import { InviteFormData, PendingInvite } from "@/types/user";
import { Span, Text } from "@/components/ui/typography/Text";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  members: MemberProfile[];
  onSave?: (payload: {
    name: string;
    leaderId: string;
    memberIds: string[];
    status: string;
    description: string;
  }) => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  triggerLabel?: string;
}

export default function AddSmallTeamDialog({
  members,
  onSave,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
  triggerLabel = "Add a Team",
}: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSelectedPanel, setShowSelectedPanel] = useState(false);
  const [panelQuery, setPanelQuery] = useState("");
  const inviteDialogTitle = "Invite New Leader";

  const selectedMembers = useMemo(() => {
    if (!memberIds.length) return [];
    return members.filter((member) => memberIds.includes(member.id));
  }, [memberIds, members]);

  const panelMembers = useMemo(() => {
    if (!panelQuery.trim()) return selectedMembers;
    const query = panelQuery.toLowerCase();
    return selectedMembers.filter(
      (member) =>
        member.fullName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query),
    );
  }, [panelQuery, selectedMembers]);

  function handleInviteSubmit(formData: InviteFormData) {
    setIsInviteLoading(true);
    setTimeout(() => {
      const newInvite: PendingInvite = {
        id: crypto.randomUUID(),
        name:
          [formData.title, formData.firstName, formData.lastName]
            .filter(Boolean)
            .join(" ") || formData.email,
        email: formData.email,
        role: formData.role,
        status: "pending",
      };
      setPendingInvites((prev) => [...prev, newInvite]);
      setIsInviteLoading(false);
    }, 600);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          name: teamName,
          leaderId,
          memberIds,
          status,
          description,
        });
      }
      setTeamName("");
      setLeaderId("");
      setMemberIds([]);
      setStatus("active");
      setDescription("");
      setShowSelectedPanel(false);
      setPanelQuery("");
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetLeader() {
    setLeaderId("");
  }

  function removeSelectedMember(id: string) {
    setMemberIds((prev) => prev.filter((memberId) => memberId !== id));
  }

  const isOpen = controlledOpen ?? open;
  const setIsOpen = onOpenChange ?? setOpen;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {!hideTrigger && (
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {triggerLabel}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent
          showClose={false}
          mobileSheet={isMobile}
          className={cn(
            "!p-0 !bg-transparent !shadow-none !border-none",
            isMobile && "!rounded-t-2xl",
          )}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl shadow-lg w-full sm:w-[460px] h-full flex flex-col overflow-hidden bg-gray-50">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <Heading level={2}>Add a Small Team</Heading>

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
                <div className="space-y-1.5">
                  <Label>Team Name</Label>
                  <Input
                    placeholder="e.g. Youth Group A"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Assign Leader</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <MemberSingleSelect
                        options={members}
                        value={leaderId}
                        onChange={setLeaderId}
                        placeholder="Select or search"
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      title="Reset leader"
                      variant="outline"
                      onClick={handleResetLeader}
                    >
                      <RefreshCw className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                  <a
                    href="/dashboard/members/invite"
                    onClick={(e) => {
                      e.preventDefault();
                      setInviteOpen(true);
                    }}
                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Add New Team Lead
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  {memberIds.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Span variant="default">Selected Members</Span>
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
                        {memberIds.slice(0, 3).map((id) => {
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
                        {memberIds.length > 3 && (
                          <Span variant="chip" className="inline-flex">
                            +{memberIds.length - 3} others
                          </Span>
                        )}
                      </div>
                    </div>
                  )}
                  <Label>Add Members</Label>

                  <MemberMultiSelect
                    options={members}
                    value={memberIds}
                    onChange={setMemberIds}
                    placeholder="Select or search"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    placeholder="Add description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex w-full px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                <Button
                  onClick={handleSave}
                  disabled={!teamName.trim() || isSaving}
                  className="px-6"
                >
                  {isSaving ? "Saving..." : "Add Team"}
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
                    <Span className="px-2 py-1 rounded bg-gray-200 text-gray-800">
                      1
                    </Span>
                    <Span>2</Span>
                    <Span>Next</Span>
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

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={handleInviteSubmit}
        pendingInvites={pendingInvites}
        isLoading={isInviteLoading}
        title={inviteDialogTitle}
      />
    </>
  );
}
