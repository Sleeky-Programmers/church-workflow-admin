"use client";

import { Users, Shield, Settings as SettingsIcon, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "user-management",
    label: "User Management",
    icon: Users,
    href: "/dashboard/settings/users",
  },
  {
    id: "roles-permissions",
    label: "Roles & Permissions",
    icon: Shield,
    href: "/dashboard/settings/roles",
  },
  {
    id: "preference",
    label: "Preference",
    icon: SettingsIcon,
    href: "/dashboard/settings/preferences",
  },
  {
    id: "account-settings",
    label: "Account Settings",
    icon: Lock,
    href: "/dashboard/settings/account",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="md:w-52 w-full border-r bg-white">
      <div className="space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 border rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary-500 text-white-600"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-white" : "text-gray-600",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
