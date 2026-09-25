import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Sunga — Every kwacha has a purpose",
  description:
    "Sunga is a budgeting, savings and money-tracking companion built in Zambia, designed for Africa.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1b3b2f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-sunga-cream text-sunga-green">
        <PwaRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
