"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "@/components/ui/loader";
import Heading from "@/components/ui/typography/Heading";
import { Text, Span } from "@/components/ui/typography/Text";

interface VerifyCodeFormProps {
  email: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<any>;
}

type VerifyCodeFormValues = {
  code: string;
};

export default function VerifyCodeForm({
  email,
  onVerify,
  onResend,
}: VerifyCodeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const form = useForm<VerifyCodeFormValues>({
    defaultValues: {
      code: "",
    },
  });
  useEffect(() => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleSubmit = async ({ code }: VerifyCodeFormValues) => {
    if (code.length !== 6) return;

    setIsLoading(true);

    try {
      const success = await onVerify(code);
      setIsLoading(false);

      if (!success) {
        form.setError("code", {
          type: "manual",
          message: "Invalid or expired code",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    await onResend();
    setCountdown(90);
  };

  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 animate-slide-up">
      <div className="text-center mb-6 sm:mb-8">
        <Heading level={1}>Forgot Password</Heading>
        <Text variant="muted">
          Please check your email, we&apos;ve sent a code to{" "}
          <Span variant="default">{email}</Span>
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            rules={{
              required: "Verification code is required",
              minLength: {
                value: 6,
                message: "Enter the 6-digit code",
              },
            }}
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <div className="w-full overflow-x-auto pb-1">
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      inputMode="numeric"
                      autoComplete="one-time-code"
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading || form.watch("code").length !== 6}
            className="w-full"
          >
            {isLoading ? (
              <Span className="flex items-center gap-2">
                <Loader />
                Verifying...
              </Span>
            ) : (
              "Continue"
            )}
          </Button>
          <div className="text-center">
            <Text variant="muted">
              Didn&apos;t receive a code?{" "}
              {countdown > 0 ? (
                <Span variant="default" className="cursor-default">
                  Resend in {formatTime(countdown)}
                </Span>
              ) : (
                <Button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  variant="link"
                >
                  Resend
                </Button>
              )}
            </Text>
          </div>
        </form>
      </Form>
    </div>
  );
}
