"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import AuthAlert from "../auth-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/typography/Heading";
import { Text, Span } from "@/components/ui/typography/Text";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "@/components/ui/loader";
import React from "react";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBackToLogin: () => void;
}

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordForm({
  onSubmit,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });
  const handleSubmit = async (data: ForgotPasswordFormValues) => {
    form.clearErrors("root");
    setIsLoading(true);
    try {
      await onSubmit(data.email);
    } catch (error) {
      const message = getAuthErrorMessage(
        error,
        "We couldn't send the reset code. Please try again."
      );
      form.setError("root", { type: "manual", message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 animate-slide-up">
      <div className="text-center mb-6 sm:mb-8">
        <Heading level={1}>Forgot Password</Heading>
        <Text variant="muted" className="mt-2">
          Enter your email to reset password
        </Text>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
          noValidate
        >
          <AuthAlert message={form.formState.errors.root?.message} />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Span className="flex items-center gap-2">
                <Loader />
                Sending…
              </Span>
            ) : (
              "Continue"
            )}
          </Button>
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onBackToLogin}
              className="h-auto p-0"
            >
              ← Back to login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
