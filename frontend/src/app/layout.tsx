import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuildBoard - Project Management Platform",
  description: "A modern platform for buyers and sellers to manage project bidding and collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-background text-foreground min-h-screen`}
      >
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {children}
        </div>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
