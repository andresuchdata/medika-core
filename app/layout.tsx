import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { RouteGuard } from "@/components/route-guard";
import { UIProvider } from "@/lib/context/ui-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medika - Medical Hospital Management System",
  description: "Comprehensive medical hospital management system for patients, doctors, and staff",
  keywords: ["medical", "hospital", "management", "healthcare", "appointments", "patients"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UIProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
          <Toaster />
        </UIProvider>
      </body>
    </html>
  );
}
