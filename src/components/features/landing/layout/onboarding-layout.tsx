import { ReactNode } from "react";

type OnboardingLayoutProps = {
  children: ReactNode;
};

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-start sm:items-center justify-center relative px-4 py-6 sm:px-6 sm:py-10"
      style={{
        backgroundImage: "url(/assets/onboarding-bg.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
