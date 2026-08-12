import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { promiseCopy } from "../content/homepage-copy";
import { cn } from "@/lib/utils";
import { pageType } from "@/patterns/site/page-layout";

export function PromisesSection() {
  return (
    <div aria-label="Skopos product promises">
      {promiseCopy.map((promise) => (
        <section
          key={promise.id}
          id={promise.id}
          className={cn("px-0 md:px-[var(--page-gutter)]", promise.tone === "dark" ? "bg-[var(--skopos-night)] text-white" : "bg-[var(--skopos-paper)] text-[var(--skopos-ink)]")}
          aria-labelledby={`${promise.id}-title`}
        >
          <div className={cn("mx-auto grid min-h-[300px] w-full max-w-[var(--page-max-width)] items-center gap-8 border-x-0 px-[var(--page-gutter)] py-14 md:border-x md:px-[clamp(38px,5vw,68px)] min-[960px]:grid-cols-[160px_1.1fr_1fr_100px]", promise.tone === "dark" ? "border-[var(--skopos-rule-dark)]" : "border-[var(--skopos-rule-light)]")}>
            <div className={cn("font-mono text-[clamp(4rem,8vw,7rem)] leading-none font-light tracking-[-0.08em]", promise.tone === "dark" ? "text-[#333]" : "text-[#b8b5ae]")} aria-hidden="true">
              {promise.number}
            </div>
            <div>
              <p className={cn(pageType.label, promise.tone === "dark" ? "text-[#888]" : "text-[#666]")}>{promise.eyebrow}</p>
              <h2 className={cn(pageType.section,"mt-5")} id={`${promise.id}-title`}>{promise.title}</h2>
            </div>
            <div className={cn("leading-[1.6]",promise.tone === "dark" ? "text-[var(--skopos-night-muted)]" : "text-[var(--skopos-muted)]")}>
              <p>{promise.description}</p>
              {"supporting" in promise ? <p className="mt-4 font-mono text-xs">{promise.supporting}</p> : null}
              <Link className={cn("mt-7 inline-flex items-center gap-3 text-sm font-bold",promise.tone === "dark" ? "text-white" : "text-[var(--skopos-ink)]")} href={promise.linkHref}>
                {promise.linkLabel}
                <Icon symbol="arrow_forward" size="sm" />
              </Link>
            </div>
            <Icon className="justify-self-start min-[960px]:justify-self-end" symbol={promise.icon} size={64} aria-hidden="true" />
          </div>
        </section>
      ))}
    </div>
  );
}
