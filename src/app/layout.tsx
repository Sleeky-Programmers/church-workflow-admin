import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
   title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Your Church workflow processes all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body>
    
        {children}

      </body>
    </html>
  );
}
