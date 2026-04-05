"use client";

import { useState } from "react";
import { AddMemberStep1Data } from "@/types";
import { Gender, MaritalStatus, MemberTitle } from "@/lib/enums";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Span, Text } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";

type ProfileDetailsStepProps = {
  onNext: (data: AddMemberStep1Data) => void;
  initialData?: Partial<AddMemberStep1Data>;
};

export function ProfileDetailsStep({
  onNext,
  initialData = {},
}: ProfileDetailsStepProps) {
  const [formData, setFormData] =
    useState<Partial<AddMemberStep1Data>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = "Marital status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData as AddMemberStep1Data);
    }
  };

  return (
    <div className="flex justify-center">
      <div className=" max-w-2xl rounded-xl ">
        <div>
          <Heading level={2} variant="primary">
            Add a New Member Profile
          </Heading>
          <Text variant="default" className="mt-1">
            Provide the member's information to include them in the church
            community
          </Text>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Title</Label>
              <Select
                value={formData.title}
                onValueChange={(value) =>
                  setFormData({ ...formData, title: value as MemberTitle })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MemberTitle.MR}>Mr.</SelectItem>
                  <SelectItem value={MemberTitle.MRS}>Mrs.</SelectItem>
                  <SelectItem value={MemberTitle.MISS}>Miss</SelectItem>
                  <SelectItem value={MemberTitle.DR}>Dr.</SelectItem>
                  <SelectItem value={MemberTitle.PASTOR}>Pastor</SelectItem>
                  <SelectItem value={MemberTitle.REV}>Rev.</SelectItem>
                </SelectContent>
              </Select>
              {formData.title && (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => setFormData({ ...formData, title: undefined })}
                >
                  Clear selection
                </Button>
              )}
            </div>

            <div className="col-span-2">
              <Label>
                Full Name <Span variant="error">*</Span>
              </Label>
              <Input
                placeholder="Enter the full name"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={errors.fullName ? "border-destructive-600" : ""}
              />
              {errors.fullName && (
                <Text variant="error" className="mt-1">
                  {errors.fullName}
                </Text>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>
                Gender <Span variant="error">*</Span>
              </Label>
              <RadioGroup
                value={formData.gender || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value as Gender })
                }
                className="mt-2 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={Gender.MALE} id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={Gender.FEMALE} id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <Text variant="error" className="mt-1">
                  {errors.gender}
                </Text>
              )}
            </div>

            <div className="col-span-2">
              <Label>Birthday</Label>
              <Input
                type="date"
                value={formData.birthday || ""}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Marital Status</Label>
              <Select
                value={formData.maritalStatus || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    maritalStatus: value as MaritalStatus,
                  })
                }
              >
                <SelectTrigger
                  className={
                    errors.maritalStatus ? "border-destructive-600" : ""
                  }
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MaritalStatus.SINGLE}>Single</SelectItem>
                  <SelectItem value={MaritalStatus.MARRIED}>Married</SelectItem>
                  <SelectItem value={MaritalStatus.DIVORCED}>
                    Divorced
                  </SelectItem>
                  <SelectItem value={MaritalStatus.WIDOWED}>Widowed</SelectItem>
                </SelectContent>
              </Select>
              {errors.maritalStatus && (
                <Text variant="error" className="mt-1">
                  {errors.maritalStatus}
                </Text>
              )}
            </div>

            {formData.maritalStatus === MaritalStatus.MARRIED && (
              <div>
                <Label>Date of Marriage</Label>
                <Input
                  type="date"
                  value={formData.dateOfMarriage || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dateOfMarriage: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} className="px-6">
            Next step
          </Button>
        </div>
      </div>
    </div>
  );
}
