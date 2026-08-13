export type SiteNavItem = {
  href: string;
  label: string;
  description?: string;
  external?: boolean;
};

export const productNavigation: readonly SiteNavItem[] = [
  {
    href: "/project-memory",
    label: "Project memory",
    description: "Keep the project truth useful as the codebase changes.",
  },
  {
    href: "/how-it-works",
    label: "How Skopos works",
    description: "See the path from a request to verified work.",
  },
  {
    href: "/agents",
    label: "Agent support",
    description: "See what is certified, projected, or manual.",
  },
  {
    href: "/trust",
    label: "Trust and control",
    description: "See how scope, policy, and evidence keep work honest.",
  },
] as const;

export const primaryNavigation: readonly SiteNavItem[] = [
  { href: "/use-cases", label: "Use cases" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  {
    href: "https://github.com/unisanetech/skopos",
    label: "GitHub",
    external: true,
  },
] as const;

export function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
