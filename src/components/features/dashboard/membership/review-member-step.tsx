"use client";

import { NewMemberData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Heading from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";

type ReviewMemberStepProps = {
  data: Partial<NewMemberData>;
};

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <Heading level={4} className="mb-3">
        {title}
      </Heading>
      <Card className="bg-gray-50 p-4">{children}</Card>
    </div>
  );
}

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: string | boolean | undefined;
}) {
  return (
    <div className="flex items-center justify-between border-b py-2 last:border-0">
      <Text variant="muted">{label}</Text>
      <Text variant="default">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "-"}
      </Text>
    </div>
  );
}

export function ReviewMemberStep({ data }: ReviewMemberStepProps) {
  return (
    <div className="space-y-6">
      <ReviewSection title="Profile Details">
        <ReviewField label="Title" value={data.title} />
        <ReviewField label="Full Name" value={data.fullName} />
        <ReviewField label="Gender" value={data.gender} />
        <ReviewField label="Birthday" value={data.birthday} />
        <ReviewField label="Marital Status" value={data.maritalStatus} />
        {data.dateOfMarriage && (
          <ReviewField label="Date of Marriage" value={data.dateOfMarriage} />
        )}
      </ReviewSection>

      <ReviewSection title="Contact Information">
        <ReviewField label="Email" value={data.email} />
        <ReviewField label="Phone" value={data.phone} />
        <ReviewField label="Address" value={data.address} />
        <ReviewField label="Occupation" value={data.occupation} />
        <ReviewField label="Educational Background" value={data.education} />
      </ReviewSection>

      <ReviewSection title="Church Activity">
        <ReviewField label="Membership Status" value={data.membershipStatus} />
        <ReviewField label="Date Joined" value={data.dateJoined} />
        <ReviewField
          label="Previous Church Membership"
          value={data.previousChurchMembership}
        />
        <ReviewField label="Baptized" value={data.baptized} />
        <ReviewField
          label="Ministries Involved in"
          value={data.ministriesInvolved}
        />
        <ReviewField
          label="Volunteers Preference"
          value={data.volunteersPreference}
        />
      </ReviewSection>
    </div>
  );
}
