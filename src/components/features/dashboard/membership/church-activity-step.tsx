"use client";

import { useState } from "react";
import { AddMemberStep3Data } from "@/types";
import { MembershipStatus } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Text, Span } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";

type ChurchActivityStepProps = {
  onNext: (data: AddMemberStep3Data) => void;
  onBack: () => void;
  initialData?: Partial<AddMemberStep3Data>;
};

export function ChurchActivityStep({
  onNext,
  onBack,
  initialData = {},
}: ChurchActivityStepProps) {
  const [formData, setFormData] = useState<Partial<AddMemberStep3Data>>({
    membershipStatus: MembershipStatus.MEMBER,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.membershipStatus) {
      newErrors.membershipStatus = "Membership status is required";
    }
    if (formData.baptized === undefined) {
      newErrors.baptized = "Baptism status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData as AddMemberStep3Data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading variant="primary" level={2}>
          Church Involvement
        </Heading>
        <Text variant="muted">
          Share details about the member&apos;s participation and church journey
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label className="mb-2">
            Membership Status <Span variant="error">*</Span>
          </Label>
          <Select
            value={formData.membershipStatus || ""}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                membershipStatus: value as MembershipStatus,
              })
            }
          >
            <SelectTrigger
              className={
                errors.membershipStatus ? "border-destructive-600" : ""
              }
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MembershipStatus.MEMBER}>Member</SelectItem>
              <SelectItem value={MembershipStatus.VISITOR}>Visitor</SelectItem>
              <SelectItem value={MembershipStatus.VOLUNTEER}>
                Volunteer
              </SelectItem>
              <SelectItem value={MembershipStatus.LEADER}>Leader</SelectItem>
              <SelectItem value={MembershipStatus.CONVERT}>
                New Convert
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.membershipStatus && (
            <Text variant="error" className="mt-1">
              {errors.membershipStatus}
            </Text>
          )}
        </div>

        <div>
          <Label className="mb-2">Date Joined the Church</Label>
          <Input
            type="date"
            value={formData.dateJoined || ""}
            onChange={(e) =>
              setFormData({ ...formData, dateJoined: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="mb-2">Previous Church Membership</Label>
          <Input
            placeholder="Enter the previous church name"
            value={formData.previousChurchMembership || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                previousChurchMembership: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label className="mb-2">
            Are you baptized? <Span variant="error">*</Span>
          </Label>
          <Select
            value={
              formData.baptized !== undefined ? String(formData.baptized) : ""
            }
            onValueChange={(value) =>
              setFormData({ ...formData, baptized: value === "true" })
            }
          >
            <SelectTrigger
              className={errors.baptized ? "border-destructive-600" : ""}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          {errors.baptized && (
            <Text variant="error" className="mt-1">
              {errors.baptized}
            </Text>
          )}
        </div>

        <div>
          <Label className="mb-2">Ministries Involved in</Label>
          <Input
            placeholder="e.g. Choir, Usher or none"
            value={formData.ministriesInvolved || ""}
            onChange={(e) =>
              setFormData({ ...formData, ministriesInvolved: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="mb-2">Volunteer Preferences</Label>
          <Select
            value={formData.volunteersPreference || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, volunteersPreference: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Interested">Interested</SelectItem>
              <SelectItem value="Not Interested">Not Interested</SelectItem>
              <SelectItem value="Maybe Later">Maybe Later</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
