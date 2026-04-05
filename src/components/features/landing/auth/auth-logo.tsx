"use client";
import Link from "next/link";
import Image from "next/image";

interface AuthLogoProps {
  className?: string;
  href?: string;
}

export default function AuthLogo({
  className = "",
  href = "#",
}: AuthLogoProps) {
  const logoContent = (
    <div
      className={`inline-flex ml-[-25] items-right space-x-3 bg-gray-50 rounded-full px-6 py-3 shadow-sm ${className}`}
    >
      <Image
        src="/assets/logo/horizontal/main.png"
        alt="Church Workflow Logo"
        width={80}
        height={80}
        priority
        quality={100}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
