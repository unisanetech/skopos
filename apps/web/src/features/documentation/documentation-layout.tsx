import Link from "next/link";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export const documentationType = {
  kicker: "font-mono text-[10px] font-bold tracking-[0.11em] text-[#747474] uppercase",
  hero: "text-4xl leading-[0.99] font-[760] tracking-[-0.052em] text-balance sm:text-5xl lg:text-6xl",
  section: "text-3xl leading-[1.04] font-[730] tracking-[-0.046em] text-balance lg:text-4xl",
} as const;

export function DocumentationSection({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("px-0 md:px-[var(--page-gutter)]", className)} {...props}>{children}</section>;
}

export function DocumentationFrame({ dark = false, className, children, ...props }: HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--page-max-width)] border-x-0 md:border-x",
        dark ? "border-[var(--skopos-rule-dark)]" : "border-[var(--skopos-rule-light)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DocumentationKicker({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(documentationType.kicker, className)}>{children}</span>;
}

export function DocumentationGrid({ className, children }: { className?: string; children: ReactNode }) {
  const style: CSSProperties = {
    backgroundColor: "#faf9f5",
    backgroundImage:
      "linear-gradient(var(--skopos-rule-light) 1px, transparent 1px), linear-gradient(90deg, var(--skopos-rule-light) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
  };
  return <div className={className} style={style}>{children}</div>;
}

export function DocumentationBackLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="inline-flex items-center gap-2 text-xs font-bold text-[var(--skopos-ink)]" href={href}><Icon symbol="arrow_back" size="sm" />{children}</Link>;
}

export function DocumentationSectionHeading({ number, title, description, id, dark = false }: { number: string; title: string; description?: string; id?: string; dark?: boolean }) {
  return <header className="grid gap-7 px-[var(--page-gutter)] pb-[clamp(48px,6vw,72px)] md:grid-cols-[110px_1fr] md:px-[clamp(38px,5vw,68px)]"><span className={cn("font-mono text-[11px] font-semibold tracking-[0.08em]", dark ? "text-[#8a8a8a]" : "text-[#7c7c7c]")}>{number}</span><div><h2 id={id} className={documentationType.section}>{title}</h2>{description && <p className={cn("mt-5 max-w-[690px] leading-[1.65]", dark ? "text-[var(--skopos-night-muted)]" : "text-[var(--skopos-muted)]")}>{description}</p>}</div></header>;
}
