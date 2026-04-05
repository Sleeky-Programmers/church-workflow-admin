"use client";

import { useState } from "react";
import LoginForm from "@/components/features/landing/auth/login/login";
import ForgotPasswordForm from "@/components/features/landing/auth/login/forgot-password";
import VerifyCodeForm from "@/components/features/landing/auth/login/verify-code";
import ResetPasswordForm from "@/components/features/landing/auth/login/reset-password";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "@/components/features/landing/auth/signup/auth-layout";
import { AuthVariant } from "@/lib/auth-content";
import { requestOtp, verifyOtp } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type AuthStep = "login" | "forgot-password" | "verify-code" | "reset-password";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");

  const { toast } = useToast();

  const getVariant = (): AuthVariant => {
    switch (step) {
      case "login":
        return "login";
      case "forgot-password":
        return "forgot-password";
      case "verify-code":
        return "verify-otp";
      case "reset-password":
        return "reset-password";
      default:
        return "login";
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await requestOtp(email);
      setEmail(email);
      setStep("verify-code");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while requesting OTP",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async (code: string) => {
    try {
      const data = await verifyOtp({ email, otp: parseInt(code) });
      localStorage.setItem("accessToken", data.accessToken);

      setStep("reset-password");

      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthLayout variant={getVariant()}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {step === "login" && (
            <LoginForm onForgotPassword={() => setStep("forgot-password")} />
          )}

          {step === "forgot-password" && (
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              onBackToLogin={() => setStep("login")}
            />
          )}

          {step === "verify-code" && (
            <VerifyCodeForm
              email={email}
              onVerify={handleVerifyOtp}
              onResend={() => requestOtp(email)}
            />
          )}

          {step === "reset-password" && (
            <ResetPasswordForm onSuccess={() => setStep("login")} />
          )}
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
}
