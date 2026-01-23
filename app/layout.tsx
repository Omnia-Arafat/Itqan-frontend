import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Itqan - Quran Academy Platform",
  description: "Connect with expert teachers, track your progress, and perfect your recitation from anywhere in the world.",
};

import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="antialiased bg-white"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
