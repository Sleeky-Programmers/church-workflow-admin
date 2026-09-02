import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { RecentTracker } from "@/components/layout/recent-tracker";
import { PageTransition } from "@/components/layout/page-transition";
import { DashboardGuard } from "@/components/auth/dashboard-guard";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Your Church workflow processes all in one place.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <SidebarProvider>
        <RecentTracker />
        <div className="relative flex min-h-screen w-full bg-gray-50">
          <AppSidebar />

          <SidebarInset className="min-w-0">
            <Navbar />
            <main className="min-w-0 w-full p-3 sm:p-4 md:p-6">
              <PageTransition>{children}</PageTransition>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DashboardGuard>
  );
}
