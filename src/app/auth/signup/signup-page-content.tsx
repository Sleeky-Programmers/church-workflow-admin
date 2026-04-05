"use client";
import { useEffect, useState } from "react";
import SignupForm from "@/components/features/landing/auth/signup/signup-form";
import AdminSignupForm from "@/components/features/landing/auth/signup/admin-signup-form";
import VerifyOtpForm from "@/components/features/landing/auth/signup/verify-code";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminInvite } from "@/hooks/use-admin-invite";
import { Loader } from "@/components/ui/loader";
import { Text } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button";
import { RouteConfig } from "@/config/routes";
import { SignUpStep } from "@/lib/enums";
import AuthLayout from "@/components/features/landing/auth/signup/auth-layout";
import { resendOtp, verifyOtp } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { initializeAuthSession } from "@/lib/auth/session";

export function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, inviteData, isLoading, error } = useAdminInvite();
  const [currentStep, setCurrentStep] = useState<SignUpStep>(SignUpStep.SIGNUP);
  const [email, setEmail] = useState("");
  const [signupData, setSignupData] = useState<any>(null);
  const preFilledSignupEmail = searchParams?.get("email") || "";

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pendingEmail = sessionStorage.getItem("pendingVerificationEmail");
    const paramEmail = searchParams?.get("email") || "";
    const shouldVerify =
      searchParams?.get("step") === "verify" ||
      searchParams?.get("verify") === "1";

    let storedSignup: any = null;
    try {
      const stored = sessionStorage.getItem("signupData");
      if (stored) storedSignup = JSON.parse(stored);
    } catch {
      storedSignup = null;
    }

    const resolvedEmail =
      paramEmail || pendingEmail || storedSignup?.email || "";

    if (shouldVerify && resolvedEmail) {
      setEmail(resolvedEmail);
      setCurrentStep(SignUpStep.VERIFY_OTP);

      if (!storedSignup) {
        const minimalData = { email: resolvedEmail };
        setSignupData(minimalData);
        sessionStorage.setItem("signupData", JSON.stringify(minimalData));
      }
    }

    if (pendingEmail) {
      sessionStorage.removeItem("pendingVerificationEmail");
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <AuthLayout variant="signup">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader />
          <Text variant="muted">Loading your invite...</Text>
        </div>
      </AuthLayout>
    );
  }

  if (error && isAdmin) {
    return (
      <AuthLayout variant="signup">
        <div className="flex flex-col items-center justify-center gap-4">
          <Text variant="error" className="text-center">
            {error}
          </Text>
          <Button
            onClick={() => router.push(RouteConfig.auth.signIn)}
            variant="link"
          >
            Go to login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const handleSignupSuccess = (submittedEmail: string, data?: any) => {
    setEmail(submittedEmail);
    if (data) {
      setSignupData(data);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("signupData", JSON.stringify(data));
      }
    }

    if (isAdmin) {
      router.push(RouteConfig.dashboard.home);
    } else {
      setCurrentStep(SignUpStep.VERIFY_OTP);
    }
  };

  const handleOtpVerified = async (otp: string) => {
    try {
      const response = await verifyOtp({ email, otp: Number(otp) });

      if (response.accessToken) {
        initializeAuthSession({
          accessToken: response.accessToken,
          emailHint: email,
          user: {
            email,
            firstName: signupData?.firstName,
            lastName: signupData?.lastName,
          },
        });
      }

      if (signupData && typeof window !== "undefined") {
        sessionStorage.setItem("signupData", JSON.stringify(signupData));
      }

      router.push(RouteConfig.onboarding);
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while verifying OTP",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while resending OTP",
        variant: "destructive",
      });
      throw error;
    }
  };

  const layoutVariant = isAdmin ? "admin-signup" : "signup";

  return (
    <AuthLayout variant={layoutVariant}>
      <div className="relative">
        {currentStep === SignUpStep.SIGNUP && !isAdmin && (
          <SignupForm
            onSubmit={handleSignupSuccess}
            preFilledEmail={preFilledSignupEmail}
          />
        )}
        {currentStep === SignUpStep.SIGNUP && isAdmin && inviteData && (
          <AdminSignupForm
            onSubmit={handleSignupSuccess}
            preFilledName={{
              firstName: inviteData.firstName,
              lastName: inviteData.lastName,
            }}
            preFilledEmail={inviteData.email}
            invitedRole={inviteData.role}
          />
        )}
        {currentStep === SignUpStep.VERIFY_OTP && (
          <VerifyOtpForm
            email={email}
            onVerify={handleOtpVerified}
            onResend={handleResendOtp}
          />
        )}
      </div>
    </AuthLayout>
  );
}
