import type React from "react";
import type { Metadata } from "next";

import "@/app/globals.css";
import { Providers } from "@/app/providers";

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
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
