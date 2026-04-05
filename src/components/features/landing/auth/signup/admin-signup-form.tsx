"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GoogleSignupButton from "../oauth/google-signup-button";
import Heading from "@/components/ui/typography/Heading";
import { Text, Span } from "@/components/ui/typography/Text";
import { Loader } from "@/components/ui/loader";
import { adminSignupSchema } from "@/types/schema";
import { RouteConfig } from "@/config/routes";
import { adminRegister, googleAuth } from "@/lib/api";
import { initializeAuthSession } from "@/lib/auth/session";

type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;

interface AdminSignupFormProps {
  onSubmit: (email: string, data?: AdminSignupFormValues) => void;
  preFilledName?: { firstName: string; lastName: string };
  preFilledEmail?: string;
  invitedRole?: string;
}

export default function AdminSignupForm({
  onSubmit,
  preFilledName,
  preFilledEmail,
  invitedRole,
}: AdminSignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      firstName: preFilledName?.firstName || "",
      lastName: preFilledName?.lastName || "",
      email: preFilledEmail || "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: AdminSignupFormValues) => {
    const inviteToken =
      searchParams.get("invite") || searchParams.get("token") || "";

    if (!inviteToken) {
      form.setError("email", {
        message: "Invite token is missing. Please use your invite link.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminRegister(inviteToken, {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      initializeAuthSession({
        accessToken: response.accessToken,
        emailHint: data.email,
        user: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      onSubmit(data.email, { ...data, role: invitedRole } as any);
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      if (backendMessage.includes("already exists")) {
        form.setError("email", {
          type: "manual",
          message: "An account with this email already exists.",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: backendMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (idToken: string) => {
    const inviteToken =
      searchParams.get("invite") || searchParams.get("token") || undefined;
    try {
      setIsLoading(true);
      const data = await googleAuth(idToken, inviteToken);
      initializeAuthSession({
        accessToken: data.accessToken,
        emailHint: data.user?.email || preFilledEmail,
        user: data.user,
      });
      router.push(RouteConfig.dashboard.home);
    } catch (error: any) {
      form.setError("email", {
        message: error.message || "Google signup failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onLogin = () => router.push(RouteConfig.auth.signIn);

  return (
    <div className="animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <Heading level={1}>Get Started</Heading>
        <Text variant="muted">
          It&apos;s easy! Just take a minute to provide the details.
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name"
                      {...field}
                      disabled={!!preFilledName?.firstName}
                      readOnly={!!preFilledName?.firstName}
                      className={
                        preFilledName?.firstName
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name"
                      {...field}
                      disabled={!!preFilledName?.lastName}
                      readOnly={!!preFilledName?.lastName}
                      className={
                        preFilledName?.lastName
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                    disabled={!!preFilledEmail}
                    readOnly={!!preFilledEmail}
                    className={
                      preFilledEmail ? "bg-gray-100 cursor-not-allowed" : ""
                    }
                  />
                </FormControl>
                {preFilledEmail && (
                  <Text variant="muted" className="text-xs">
                    Email address from your invitation
                  </Text>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormControl>
                <Text variant="muted" className="text-xs mt-1">
                  Must contain 8+ characters, uppercase, lowercase, and a number
                </Text>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="w-full py-5 sm:py-6"
          >
            {isLoading ? (
              <Span variant="default" className="flex items-center gap-2">
                <Loader />
                Creating account…
              </Span>
            ) : (
              "Continue"
            )}
          </Button>
          <div className="relative my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200" />
            <Span variant="default" className="mx-4 px-4 py-1">
              OR
            </Span>
            <div className="flex-grow border-t border-gray-200" />
          </div>
          <GoogleSignupButton
            onCredential={handleGoogleSignup}
            disabled={isLoading}
          />
        </form>
      </Form>
      <div className="text-center mt-5 sm:mt-6">
        <Text variant="muted">
          Already have an account?
          <Button onClick={onLogin} variant="link">
            Sign in
          </Button>
        </Text>
      </div>
    </div>
  );
}
