import { Sidebar } from "@/components/layout/Admin-layout/admin-sidebar";
import Heading from "@/components/ui/typography/Heading";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <Heading level={2}>Settings/Admin</Heading>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
