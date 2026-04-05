"use client";
import { useCallback, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { maskEmail } from "@/lib/mask-email";
import { cn } from "@/lib/utils";
import { Text, Span } from "@/components/ui/typography/Text";
import { Loader } from "@/components/ui/loader";
import Heading from "@/components/ui/typography/Heading";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  email: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<void>;
}

export default function VerifyOtpForm({ email, onVerify, onResend }: Props) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const { toast } = useToast();

  useEffect(() => {
    if (otp.length === 6) handleVerify(otp);
  }, [otp]);

  useEffect(() => {
    if (otp.length > 0 && error) setError(false);
  }, [otp, error]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (isVerifying) return;
      setIsVerifying(true);
      setError(false);

      const success = await onVerify(code);
      if (!success) {
        setError(true);
        setOtp("");
      }
      setIsVerifying(false);
    },
    [isVerifying, onVerify],
  );

  const handleResend = async () => {
    setIsResending(true);
    setError(false);
    setResendSuccess(false);
    setOtp("");

    try {
      await onResend();
      setResendSuccess(true);
      setResendTimer(60);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
      setError(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="space-y-2 max-w-sm">
        <Heading level={1}>Enter the code</Heading>
        <Text variant="muted">
          Enter the code sent to{" "}
          <Span variant="default">{maskEmail(email)}</Span>
        </Text>
      </div>

      <div
        className={cn(
          "w-full overflow-x-auto pb-1 flex justify-center",
          error && "animate-shake",
        )}
      >
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          autoFocus
          disabled={isVerifying}
          containerClassName="justify-center min-w-max mx-auto"
        >
          <InputOTPGroup className="space-x-2">
            <InputOTPSlot
              index={0}
              className="h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={1}
              className="h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={2}
              className="h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"
            />
          </InputOTPGroup>
          <InputOTPSeparator className="[&>svg]:h-4 [&>svg]:w-4 text-muted-foreground" />
          <InputOTPGroup className="space-x-2">
            <InputOTPSlot
              index={3}
              className="h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={4}
              className="h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"
            />
            <InputOTPSlot
              index={5}
              className="h-12 w-10 text-lg sm:h-14 sm:w-12 sm:text-xl"
            />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <Text variant="error" className="text-center">
          Incorrect code. Please try again.
        </Text>
      )}
      {resendSuccess && (
        <Text variant="success" className="text-center">
          {" "}
          Code resent successfully!
        </Text>
      )}

      <Button
        className="w-full mt-4"
        disabled={otp.length !== 6 || isVerifying}
        onClick={() => handleVerify(otp)}
      >
        {isVerifying ? (
          <Span className="flex items-center gap-2">
            <Loader /> Verifying…
          </Span>
        ) : (
          "Verify"
        )}
      </Button>

      <Text
        variant="muted"
        className="text-center flex flex-wrap justify-center items-center gap-1"
      >
        <Span variant="muted">Didn&apos;t receive a code?</Span>
        {resendTimer > 0 ? (
          <Span className="font-medium">
            Resend in {Math.floor(resendTimer / 60)}:
            {(resendTimer % 60).toString().padStart(2, "0")}
          </Span>
        ) : (
          <Button
            onClick={handleResend}
            variant="link"
            className="p-0 h-auto"
            disabled={isResending}
          >
            {isResending ? "Resending…" : "Resend"}
          </Button>
        )}
      </Text>
    </div>
  );
}
