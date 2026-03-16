import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SilentVoice - Breaking Communication Barriers",
  description: "Indian Sign Language communication platform for deaf and mute individuals.",
};

import { ISLProvider } from "@/store/islStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <ISLProvider>
          {children}
        </ISLProvider>
      </body>
    </html>
  );
}