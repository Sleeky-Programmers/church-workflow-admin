"use client";
import { Suspense } from "react";
import { SignupPageContent } from "./signup-page-content";
import AuthLayout from "@/components/features/landing/auth/signup/auth-layout";
import { Loader } from "@/components/ui/loader";
import { Text } from "@/components/ui/typography/Text";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout variant="signup">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader />
            <Text variant="muted">Loading...</Text>
          </div>
        </AuthLayout>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
