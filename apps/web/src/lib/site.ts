import type { Metadata } from "next";

type SiteEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  NODE_ENV?: string;
};

const LOCAL_SITE_URL = "http://localhost:4173";

export function resolveSiteUrl(environment: SiteEnvironment): URL {
  const configuredUrl = environment.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) {
    if (environment.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be set to the public HTTPS origin for a production web build.",
      );
    }
    return new URL(LOCAL_SITE_URL);
  }

  const url = new URL(configuredUrl);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use an HTTP or HTTPS origin.");
  }
  if (environment.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS for a production web build.");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without a path, query, or fragment.");
  }
  return url;
}

export const siteConfig = {
  name: "Skopos",
  shortDescription: "Project memory for coding agents.",
  description:
    "Skopos keeps project knowledge, task intent, project-specific rules, and proof with the repository so coding agents can continue real work without starting over.",
  url: resolveSiteUrl(process.env),
} as const;

export const siteSocialImage = {
  url: "/brand/og-image.png",
  width: 1200,
  height: 630,
  alt: "Skopos — Project memory for coding agents",
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
      images: [siteSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteSocialImage.url],
    },
  };
}
