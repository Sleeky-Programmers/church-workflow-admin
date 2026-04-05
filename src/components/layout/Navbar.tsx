"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bell, Search, Star, User } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { Text } from "../ui/typography/Text";
import { RouteConfig } from "@/config/routes";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { getCurrentUserProfile } from "@/lib/auth/session";

export function Navbar() {
  const pathname = usePathname() || RouteConfig.dashboard.home;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [fallbackName, setFallbackName] = useState("John Doe");
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const starred = isFavorite(pathname);

  useEffect(() => {
    const profile = getCurrentUserProfile();
    if (profile?.firstName) {
      setFallbackName(profile.firstName);
      return;
    }
    if (profile?.fullName) {
      setFallbackName(profile.fullName);
    }
  }, []);

  const pageLabel = useMemo(() => {
    const path = pathname.replace(/\/+$/, "");
    if (!path.startsWith("/dashboard")) return "Overview";
    const rest = path.replace(/^\/dashboard\/?/, "");
    if (!rest) return "Overview";
    return rest
      .split("/")[0]
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }, [pathname]);

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(
      `${RouteConfig.dashboard.search}?q=${encodeURIComponent(search)}`,
    );
    setSearch("");
  };

  return (
    <header className="w-full flex items-center h-16 gap-2 px-3 md:px-6 border-b">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Button
          size="icon"
          variant={starred ? "starred" : "ghost"}
          aria-label="Star this page"
          onClick={() =>
            toggleFavorite({
              path: pathname,
              label: pageLabel,
            })
          }
        >
          <Star className="w-4 h-4" fill={starred ? "currentColor" : "none"} />
        </Button>
        <div className="hidden md:block min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={RouteConfig.dashboard.home}>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="sm:hidden"
          aria-label="Open search"
          onClick={handleSearch}
        >
          <Search className="w-4 h-4" />
        </Button>

        <div className="hidden sm:block">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-48 md:w-64"
          />
        </div>

        <Link href={RouteConfig.dashboard.notifications}>
          <Button size="icon" variant="ghost" aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </Button>
        </Link>

        <Link href={RouteConfig.dashboard.admin.root}>
          <Button variant="ghost" className="flex items-center gap-2 p-0">
            <Avatar>
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <Text variant="default" className="hidden sm:block">
              {user?.name || fallbackName}
            </Text>
          </Button>
        </Link>
      </div>
    </header>
  );
}
