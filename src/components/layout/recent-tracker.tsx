"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRecentStore } from "@/stores/useRecentStore";

export function RecentTracker() {
  const pathname = usePathname();
  const addRecent = useRecentStore((s) => s.addRecent);

  useEffect(() => {
    if (!pathname?.startsWith("/dashboard")) return;

    if (pathname === "/dashboard") return;

    const slug = pathname.replace("/dashboard/", "").split("/")[0];

    if (!slug) return;

    const label = slug
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    addRecent({
      path: pathname,
      label,
    });
  }, [pathname, addRecent]);

  return null;
}
