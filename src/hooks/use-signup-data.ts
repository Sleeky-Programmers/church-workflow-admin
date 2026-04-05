import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export interface SignupDataType {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function useSignupData(): SignupDataType | null {
  const [signupData, setSignupData] = useState<SignupDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("signupData");
        if (stored) {
          const data = JSON.parse(stored) as SignupDataType;
          setSignupData(data);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.message || "Failed to parse signup data from session storage",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }, []);

  return !isLoading ? signupData : null;
}

export function clearSignupData(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("signupData");
  }
}
