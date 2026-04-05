"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: (callback?: (notification: any) => void) => void;
        };
      };
    };
  }
}

type GoogleSignupButtonProps = {
  onCredential: (idToken: string) => Promise<void> | void;
  disabled?: boolean;
  label?: string;
};

export default function GoogleSignupButton({
  onCredential,
  disabled = false,
  label = "Continue with Google",
}: GoogleSignupButtonProps) {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsScriptReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existing) {
      const onLoad = () => setIsScriptReady(true);
      existing.addEventListener("load", onLoad);
      return () => existing.removeEventListener("load", onLoad);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptReady(true);
    document.head.appendChild(script);
  }, []);

  const handleGoogleClick = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    if (!isScriptReady || !window.google?.accounts?.id) {
      return;
    }

    setIsLoading(true);

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          if (!response.credential) {
            throw new Error("Google did not return a credential.");
          }

          await onCredential(response.credential);
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Google auth failed",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });

    window.google.accounts.id.prompt((notification) => {
      const notDisplayed =
        typeof notification?.isNotDisplayed === "function" &&
        notification.isNotDisplayed();
      const skipped =
        typeof notification?.isSkippedMoment === "function" &&
        notification.isSkippedMoment();

      if (notDisplayed || skipped) {
        setIsLoading(false);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleClick}
      disabled={disabled || isLoading}
      className="w-full py-6 flex items-center gap-2"
    >
      <FcGoogle />
      {isLoading ? "Connecting..." : label}
    </Button>
  );
}
