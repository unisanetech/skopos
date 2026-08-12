import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-clip">
      <a className="fixed top-3 left-3 z-[5000] -translate-y-[160%] border-2 border-[var(--skopos-ink)] bg-white px-4 py-2.5 font-bold text-[var(--skopos-ink)] focus:translate-y-0" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="min-w-0">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
