import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export const pageType = {
  hero: "text-4xl leading-[0.98] font-[760] tracking-[-0.056em] text-balance sm:text-5xl lg:text-6xl",
  section: "text-3xl leading-[1.04] font-[730] tracking-[-0.044em] text-balance lg:text-4xl",
  card: "text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.08] font-[700] tracking-[-0.035em]",
  label: "font-mono text-[10px] leading-none font-bold tracking-[0.11em] uppercase",
} as const;

export function PageSection({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("px-0 md:px-[var(--page-gutter)]", className)} {...props} />;
}

export function PageFrame({ className, dark = false, ...props }: HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--page-max-width)] border-x-0 md:border-x",
        dark ? "border-[var(--skopos-rule-dark)]" : "border-[var(--skopos-rule-light)]",
        className,
      )}
      {...props}
    />
  );
}

export function PageHero({ children, visual }: { children: ReactNode; visual?: ReactNode }) {
  return (
    <PageSection className="bg-[var(--skopos-paper)]">
      <PageFrame className={cn("grid min-h-[clamp(570px,calc(100vh-64px),820px)]", visual && "min-[960px]:grid-cols-2")}>
        <div className="flex flex-col justify-end px-[var(--page-gutter)] py-[clamp(64px,8vw,108px)] md:px-[clamp(38px,5vw,72px)]">
          {children}
        </div>
        {visual ? <div className="flex min-h-[420px] items-center justify-center border-t border-[var(--skopos-rule-light)] p-[clamp(24px,4vw,58px)] min-[960px]:min-h-0 min-[960px]:border-t-0 min-[960px]:border-l">{visual}</div> : null}
      </PageFrame>
    </PageSection>
  );
}

export function PageActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-9 flex flex-col gap-3 sm:flex-row", className)}>{children}</div>;
}

export function PageAction({ href, children, primary = false, light = false }: { href: string; children: ReactNode; primary?: boolean; light?: boolean }) {
  const classes = cn(
    "inline-flex min-h-[52px] items-center justify-between gap-6 border px-[18px] text-[13px] font-bold transition-colors",
    primary && !light && "border-[var(--skopos-ink)] bg-[var(--skopos-ink)] text-white hover:bg-[#2a2a2a]",
    !primary && !light && "border-[#aaa] text-[var(--skopos-ink)] hover:border-[var(--skopos-ink)]",
    primary && light && "border-white bg-white text-[var(--skopos-ink)] hover:bg-[#e8e8e8]",
    !primary && light && "border-[var(--skopos-rule-dark)] text-white hover:border-white",
  );
  const content = <>{children}<Icon symbol={href.startsWith("http") ? "arrow_outward" : "arrow_forward"} size="sm" /></>;
  return href.startsWith("http") ? <a className={classes} href={href} target="_blank" rel="noreferrer">{content}</a> : <Link className={classes} href={href}>{content}</Link>;
}

export function SummaryStrip({ items }: { items: readonly string[] }) {
  return (
    <PageSection className="border-y border-[var(--skopos-rule-light)] bg-[var(--skopos-paper)]">
      <PageFrame className="grid md:grid-cols-3">
        {items.map((item, index) => (
          <p key={item} className={cn("m-0 flex min-h-[78px] items-center gap-[18px] border-b border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-5 text-sm font-semibold md:min-h-[90px] md:border-r md:border-b-0 md:px-[30px]", index === items.length - 1 && "border-b-0 md:border-r-0")}>
            <span className="font-mono text-[11px] text-[#777]">{String(index + 1).padStart(2, "0")}</span>
            {item}
          </p>
        ))}
      </PageFrame>
    </PageSection>
  );
}

export function SectionNumber({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <span className={cn("font-mono text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-light tracking-[-0.07em]", dark ? "text-[#262626]" : "text-[#b8b5ae]")}>{children}</span>;
}

export function SectionIntro({ number, title, description, dark = false, id }: { number: string; title: string; description?: string; dark?: boolean; id?: string }) {
  return (
    <div className="grid gap-7 px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] md:grid-cols-[170px_1fr] md:px-[clamp(38px,5vw,68px)]">
      <SectionNumber dark={dark}>{number}</SectionNumber>
      <div>
        <h2 id={id} className={pageType.section}>{title}</h2>
        {description ? <p className={cn("mt-6 max-w-[760px] leading-[1.65]", dark ? "text-[var(--skopos-night-muted)]" : "text-[var(--skopos-muted)]")}>{description}</p> : null}
      </div>
    </div>
  );
}

export function ClosingSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <PageSection className="bg-[var(--skopos-night)] text-white">
      <PageFrame dark className="grid min-h-[330px] items-center gap-12 px-[var(--page-gutter)] py-[clamp(56px,7vw,88px)] min-[901px]:grid-cols-[1fr_auto] md:px-[clamp(38px,5vw,68px)]">
        <div>
          <h2 className={pageType.section}>{title}</h2>
          <p className="mt-5 max-w-[670px] leading-[1.65] text-[var(--skopos-night-muted)]">{description}</p>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
      </PageFrame>
    </PageSection>
  );
}
