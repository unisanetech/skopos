import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { siteConfig } from "@/lib/site";
import "@material-symbols/font-400/outlined.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: "Skopos — Project memory for coding agents",
    template: "%s — Skopos",
  },
  description: siteConfig.description,
  applicationName: "Skopos",
  keywords: [
    "coding agents",
    "agentic engineering",
    "repository memory",
    "AI coding workflow",
    "engineering evidence",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Skopos — Project memory for coding agents",
    description: siteConfig.description,
    type: "website",
    url: "/",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Skopos — Project memory for coding agents",
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
