import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lopezpetergabriel-portfolio.vercel.app"),
  title: {
    default: "Peter Gabriel Lopez — Software Engineer & Automation Specialist",
    template: "%s · Peter Gabriel Lopez",
  },
  description:
    "Portfolio of Peter Gabriel Lopez, a software engineer and automation specialist in Iloilo City, Philippines, building backend systems, client automations and AI-agent infrastructure.",
};

// Matches --color-ground (app/tokens.css) for the browser UI tint.
export const viewport: Viewport = {
  themeColor: "#1b2a2c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geistMono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
