import type React from "react";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islamic App Admin Panel",
  description: "Admin panel for managing your platform",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
