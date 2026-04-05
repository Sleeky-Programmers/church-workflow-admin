"use client";

import { useState } from "react";
import { AddMemberStep2Data } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";

type ContactDetailsStepProps = {
  onNext: (data: AddMemberStep2Data) => void;
  onSaveImmediately: (data: AddMemberStep2Data) => void;
  onBack: () => void;
  initialData?: Partial<AddMemberStep2Data>;
};

export function ContactDetailsStep({
  onNext,
  onSaveImmediately,
  onBack,
  initialData = {},
}: ContactDetailsStepProps) {
  const [formData, setFormData] =
    useState<Partial<AddMemberStep2Data>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData as AddMemberStep2Data);
    }
  };

  const handleSaveImmediately = () => {
    if (validateForm()) {
      onSaveImmediately(formData as AddMemberStep2Data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2} variant="primary">
          Contact Details
        </Heading>
        <Text variant="default" className="mt-1">
          Enter the member's phone number, email, and address details
        </Text>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">Email</Label>
          <Input
            type="email"
            placeholder="Enter email occupation"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={errors.email ? "border-destructive-600" : ""}
          />
          {errors.email && (
            <Text variant="error" className="mt-1">
              {errors.email}
            </Text>
          )}
        </div>

        <div>
          <Label className="mb-2">Phone Number</Label>
          <Input
            placeholder="Enter phone number"
            value={formData.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={errors.phone ? "border-destructive-600" : ""}
          />
          {errors.phone && (
            <Text variant="error" className="mt-1">
              {errors.phone}
            </Text>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label className="mb-2">Address</Label>
          <Input
            placeholder="Enter address"
            value={formData.address || ""}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={errors.address ? "border-destructive-600" : ""}
          />
          {errors.address && (
            <Text variant="error" className="mt-1">
              {errors.address}
            </Text>
          )}
        </div>
        <div>
          <Label className="mb-2">Occupation</Label>
          <Input
            placeholder="Enter occupation"
            value={formData.occupation || ""}
            onChange={(e) =>
              setFormData({ ...formData, occupation: e.target.value })
            }
            className={errors.occupation ? "border-destructive-600" : ""}
          />
          {errors.occupation && (
            <Text variant="error" className="mt-1">
              {errors.occupation}
            </Text>
          )}
        </div>
        <div>
          <Label className="mb-2">Educational Background</Label>
          <Input
            placeholder="Enter educational background"
            value={formData.education || ""}
            onChange={(e) =>
              setFormData({ ...formData, education: e.target.value })
            }
            className={errors.education ? "border-destructive-600" : ""}
          />
          {errors.education && (
            <Text variant="error" className="mt-1">
              {errors.education}
            </Text>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="secondary" onClick={handleSaveImmediately}>
          Save Immediately
        </Button>
        <Button onClick={handleNext} variant="primary">
          Next step
        </Button>
      </div>
    </div>
  );
}
