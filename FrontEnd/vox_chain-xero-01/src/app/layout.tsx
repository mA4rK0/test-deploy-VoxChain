import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";

import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "700"],
});

export const metadata: Metadata = {
  title: "Vox Chain",
  description: "A place for voting that is decentralised, free to vote, secure, and independent of third parties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`antialiased`}>
        <ThirdwebProvider>
          <Toaster richColors />
          <Navbar />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
