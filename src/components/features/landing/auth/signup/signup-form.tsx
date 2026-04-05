"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useRouter } from "next/navigation";
import { Link } from "@/components/ui/link";
import { signupSchema } from "@/types/schema";
import { googleAuth, signup } from "@/lib/api";
import { RouteConfig } from "@/config/routes";
import { initializeAuthSession } from "@/lib/auth/session";

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (email: string, data?: SignupFormValues) => void;
  preFilledEmail?: string;
}

export default function SignupForm({
  onSubmit,
  preFilledEmail,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: preFilledEmail || "",
      password: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    if (preFilledEmail) {
      form.setValue("email", preFilledEmail, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [form, preFilledEmail]);

  const handleSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);

      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      onSubmit(data.email, data);
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
    try {
      setIsLoading(true);
      const data = await googleAuth(idToken);
      initializeAuthSession({
        accessToken: data.accessToken,
        emailHint: data.user?.email,
        user: data.user,
      });
      router.push(RouteConfig.onboarding);
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
                    <Input placeholder="Enter your first name" {...field} />
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
                    <Input placeholder="Enter your last name" {...field} />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the <Link href="/terms">Terms & Conditions</Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 sm:py-6"
          >
            {isLoading ? (
              <Span variant="default" className="flex items-center gap-2">
                <Loader />
                Creating account...
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
