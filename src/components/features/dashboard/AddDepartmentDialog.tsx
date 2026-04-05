"use client";
import { useState } from "react";
import { Plus, RefreshCw, ExternalLink, X } from "lucide-react";
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
import { MOCK_MEMBERS_FULL } from "@/lib/data";
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
import { InviteUserDialog } from "./admin/invite-user";
import { InviteFormData, PendingInvite } from "@/types/user";
import { Span } from "@/components/ui/typography/Text";

interface Props {
  onSave?: (payload: {
    name: string;
    hodId: string;
    memberIds: string[];
    status: string;
    description: string;
  }) => void;
}

export default function AddDepartmentDialog({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [hodId, setHodId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const inviteDialogTitle = "Invite New HOD";

  const members: MemberProfile[] = MOCK_MEMBERS_FULL;

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

  function handleSave() {
    if (onSave) {
      onSave({ name: departmentName, hodId, memberIds, status, description });
    }
    setDepartmentName("");
    setHodId("");
    setMemberIds([]);
    setStatus("active");
    setDescription("");
    setOpen(false);
  }

  function handleReset() {
    setHodId("");
    setMemberIds([]);
  }

  function removeSelectedMember(id: string) {
    setMemberIds((prev) => prev.filter((memberId) => memberId !== id));
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add a department
          </Button>
        </DialogTrigger>

        <DialogContent
          showClose={false}
          className="sm:max-w-[480px] overflow-hidden p-0"
        >
          <div className="flex justify-between items-center border-b mb-2 p-3">
            <Heading level={2}>Add a department</Heading>

            <DialogClose asChild>
              <Button
                className="p-2"
                size="icon"
                variant="outline"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>

          <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
            <div className="space-y-1.5">
              <Label>Department Name</Label>
              <Input
                placeholder="e.g. ushering department"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Assign HOD</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <MemberSingleSelect
                    options={members}
                    value={hodId}
                    onChange={setHodId}
                    placeholder="Select or search"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  title="Reset HOD"
                  variant="outline"
                  onClick={handleReset}
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
                Invite new HOD
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-2">
              {memberIds.length > 0 && (
                <div className="rounded-xl shadow-lg w-full sm:w-[480px] h-[80vh] flex flex-col overflow-hidden bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Span variant="default">Selected Members</Span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {memberIds.map((id) => {
                      const member = members.find((m) => m.id === id);
                      if (!member) return null;

                      return (
                        <Span
                          key={id}
                          variant="chip"
                          className="inline-flex items-center gap-1 "
                        >
                          {member.fullName}
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

          <div className="flex justify-end border-t border-gray-100 px-6 py-4">
            <Button
              onClick={handleSave}
              disabled={!departmentName.trim()}
              className="px-6"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
