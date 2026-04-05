"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { MemberProfile } from "@/types";
import { Gender, MembershipStatus } from "@/lib/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Text, Span } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";
import { Card } from "@/components/ui/card";

type Props = {
  member: MemberProfile;
  onClose: () => void;
  onSave: (data: Partial<MemberProfile>) => Promise<void>;
};

export function EditMemberModal({ member, onClose, onSave }: Props) {
  const normalizeDate = (dateStr?: string) => {
    if (!dateStr) {
      return "";
    }
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
  };

  const [formData, setFormData] = useState<MemberProfile>({
    ...member,
    birthday: normalizeDate(member.birthday),
    dateJoined: normalizeDate(member.dateJoined),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof MemberProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <Card className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
          <div>
            <Heading level={2}>Edit Member Profile</Heading>
            <Text className="mt-1">Update member information</Text>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  Full Name <Span variant="error">*</Span>
                </Label>
                <Input
                  value={formData.fullName || ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={errors.fullName ? "border-destructive-600" : ""}
                />
                {errors.fullName && (
                  <Text variant="error" className="mt-1">
                    {errors.fullName}
                  </Text>
                )}
              </div>

              <div>
                <Label>
                  Gender <Span variant="error">*</Span>
                </Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(val) => handleChange("gender", val)}
                >
                  <SelectTrigger
                    className={errors.gender ? "border-destructive-600" : ""}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Male</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <Text variant="error" className="mt-1">
                    {errors.gender}
                  </Text>
                )}
              </div>

              <div>
                <Label>Birthday</Label>
                <Input
                  type="date"
                  value={formData.birthday || ""}
                  onChange={(e) => handleChange("birthday", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Heading level={4}>Contact</Heading>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Heading level={4}>Church Info</Heading>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label>Membership Status</Label>
                  <Select
                    value={formData.membershipStatus || ""}
                    onValueChange={(val) =>
                      handleChange("membershipStatus", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MembershipStatus.MEMBER}>
                        Member
                      </SelectItem>
                      <SelectItem value={MembershipStatus.VISITOR}>
                        Visitor
                      </SelectItem>
                      <SelectItem value={MembershipStatus.WORKER}>
                        Worker
                      </SelectItem>
                      <SelectItem value={MembershipStatus.LEADER}>
                        Leader
                      </SelectItem>
                      <SelectItem value={MembershipStatus.CONVERT}>
                        New Convert
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Joined</Label>
                  <Input
                    type="date"
                    value={formData.dateJoined || ""}
                    onChange={(e) => handleChange("dateJoined", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Baptized</Label>
                  <Select
                    value={
                      formData.baptized === true
                        ? "true"
                        : formData.baptized === false
                          ? "false"
                          : ""
                    }
                    onValueChange={(val) =>
                      handleChange("baptized", val === "true")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Volunteer Preference</Label>
                  <Input
                    value={formData.volunteersPreference || ""}
                    onChange={(e) =>
                      handleChange("volunteersPreference", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
