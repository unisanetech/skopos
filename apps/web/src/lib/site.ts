import type { Metadata } from "next";

export const siteConfig = {
  name: "Skopos",
  shortDescription: "Project memory for coding agents.",
  description:
    "Skopos keeps project knowledge, task intent, project-specific rules, and proof with the repository so coding agents can continue real work without starting over.",
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4173"),
} as const;

export const publicRoutePaths = [
  "/",
  "/project-memory",
  "/how-it-works",
  "/use-cases",
  "/agents",
  "/trust",
  "/docs",
  "/docs/quickstart",
  "/docs/work-with-your-agent",
  "/docs/customize",
  "/docs/customize/connect-tools",
  "/docs/customize/project-rules",
  "/docs/customize/expert-guidance",
  "/docs/customize/coding-agents",
  "/docs/customize/external-services",
  "/docs/workflows/plan-and-finish-feature",
  "/docs/workflows/continue-fresh-session",
  "/changelog",
] as const;

export type PublicRoutePath = (typeof publicRoutePaths)[number];

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: PublicRoutePath;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
