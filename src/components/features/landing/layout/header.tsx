"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { RouteConfig } from "@/config/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { StickyHeader } from "./sticky-header";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <StickyHeader>
      <div className="max-w-7xl mx-auto px-10">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "py-4" : "py-6"
          }`}
        >
          <Link href="/">
            <Image
              src="/assets/logo/horizontal/main.png"
              alt="Church Workflow logo"
              width={120}
              height={40}
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Features", "Pricing", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link href={RouteConfig.dashboard.home}>
                <Button variant="default" className="transition-transform hover:scale-105">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="default" className="transition-transform hover:scale-105">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </StickyHeader>
  );
}
