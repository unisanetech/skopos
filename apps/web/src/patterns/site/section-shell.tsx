import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionShellProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  tone?: "light" | "dark";
}

export function SectionShell({ children, tone = "light", className, ...props }: SectionShellProps) {
  return (
    <section className={cn("px-0 md:px-[var(--page-gutter)]", tone === "dark" ? "bg-[var(--skopos-night)] text-white" : "bg-[var(--skopos-paper)] text-[var(--skopos-ink)]", className)} {...props}>
      <div className={cn("mx-auto w-full max-w-[var(--page-max-width)] border-x-0 md:border-x", tone === "dark" ? "border-[var(--skopos-rule-dark)]" : "border-[var(--skopos-rule-light)]")}>{children}</div>
    </section>
  );
}
