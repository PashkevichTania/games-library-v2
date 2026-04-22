import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Lib - Track & Rate Your Games",
  description: "Explore the gaming world, track your played games and share your ratings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className={cn("min-h-full flex flex-col bg-black text-white relative", "bg-dot-pattern bg-grid-pattern")}>
        <div className="fixed inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        <Navbar />
        <div className="flex-1 flex flex-col pt-16 relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
