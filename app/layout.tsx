import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter for a clean, industrial look
import "./globals.css";
import { cn } from "@/lib/utils"; // Ensure we can use cn in layout if needed (not strictly used yet but good practice)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gear Guard | Maintenance Tracker",
  description: "The Ultimate Equipment Maintenance Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background font-sans")}>
        {children}
      </body>
    </html>
  );
}
