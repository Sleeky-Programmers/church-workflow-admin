"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import AuthAlert from "../auth-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import Heading from "@/components/ui/typography/Heading";
import { Loader } from "@/components/ui/loader";
import { PasswordInput } from "@/components/ui/passport-input";
import { Text, Span } from "@/components/ui/typography/Text";
import { resetPassword } from "@/lib/api";

interface ResetPasswordFormProps {
  onSuccess: () => void;
}

type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordForm({
  onSuccess,
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) return;
    form.clearErrors("root");
    setIsLoading(true);
    try {
      await resetPassword({
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      });

      toast.success("Password reset successful. Please log in with your new password.");
      onSuccess();
    } catch (error) {
      const message = getAuthErrorMessage(
        error,
        "Failed to reset password. Please try again."
      );
      form.setError("root", { type: "manual", message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 animate-slide-up">
      <div className="text-left mb-6 sm:mb-8">
        <Heading level={1}>Reset Password</Heading>
        <Text variant="muted">
          Kindly set a new password. Your new password must be different from
          your previously used password.
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AuthAlert message={form.formState.errors.root?.message} />
          <FormField
            control={form.control}
            name="newPassword"
            rules={{
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter New Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter new password" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === form.getValues("newPassword") ||
                "Passwords must match",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Must be the same characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Span className="flex items-center gap-2">
                <Loader />
                Resetting...
              </Span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
