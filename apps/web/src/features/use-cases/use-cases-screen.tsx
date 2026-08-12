import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ClosingSection, PageAction, PageFrame, PageHero, PageSection, SummaryStrip, pageType } from "@/patterns/site/page-layout";
import { SiteShell } from "@/patterns/site/site-shell";
import { useCasesCopy } from "./content";
import { PromptBlock } from "./prompt-block";

export function UseCasesScreen() {
  return (
    <SiteShell>
      <article className="bg-[var(--skopos-paper)]">
        <header>
          <PageHero visual={
            <nav className="w-full border border-[var(--skopos-rule-light)]" aria-label="Use case index">
              <span className="block border-b border-[var(--skopos-rule-light)] px-6 py-5 font-mono text-[10px] font-bold tracking-[0.11em] text-[#777] uppercase">Start with your situation</span>
              {useCasesCopy.cases.map((useCase) => <a key={useCase.id} className="grid min-h-20 grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-[var(--skopos-rule-light)] px-6 text-sm last:border-b-0 hover:bg-[#f0eee8]" href={`#${useCase.id}`}><span className="font-mono text-xs text-[#777]">{useCase.number}</span><strong>{useCase.title}</strong><Icon symbol="arrow_downward" size="sm" /></a>)}
            </nav>
          }>
            <h1 className={pageType.hero}>{useCasesCopy.title}</h1>
            <p className="mt-8 max-w-[680px] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.65] text-[var(--skopos-muted)]">{useCasesCopy.description}</p>
            <div className="mt-9"><a className="inline-flex min-h-[52px] items-center gap-7 border border-[var(--skopos-ink)] bg-[var(--skopos-ink)] px-[18px] text-[13px] font-bold text-white" href="#use-case-list">Find your workflow<Icon symbol="arrow_downward" size="sm" /></a></div>
          </PageHero>
        </header>
        <SummaryStrip items={useCasesCopy.summary} />

        <PageSection id="use-case-list" aria-label="Skopos use cases">
          <PageFrame>
            {useCasesCopy.cases.map((useCase) => (
              <article key={useCase.id} id={useCase.id} className="grid border-b border-[var(--skopos-rule-light)] last:border-b-0 min-[960px]:grid-cols-[140px_1fr_1.05fr]">
                <div className="px-[var(--page-gutter)] pt-12 font-mono text-[clamp(3rem,6vw,5.5rem)] leading-none font-light tracking-[-0.07em] text-[#b8b5ae] min-[960px]:px-8 min-[960px]:py-[clamp(58px,6vw,82px)]">{useCase.number}</div>
                <div className="px-[var(--page-gutter)] py-12 min-[960px]:border-l min-[960px]:border-[var(--skopos-rule-light)] min-[960px]:px-[clamp(34px,4vw,58px)] min-[960px]:py-[clamp(58px,6vw,82px)]">
                  <span className={cn(pageType.label, "text-[#777]")}>{useCase.category}</span>
                  <h2 className={cn(pageType.section, "mt-5")}>{useCase.title}</h2>
                  <div className="mt-9 border-t border-[var(--skopos-rule-light)] pt-6"><span className={cn(pageType.label, "text-[#777]")}>The problem</span><p className="mt-3 leading-[1.6] text-[var(--skopos-muted)]">{useCase.problem}</p></div>
                  <div className="mt-6 border-t border-[var(--skopos-rule-light)] pt-6"><span className={cn(pageType.label, "text-[#777]")}>The outcome</span><p className="mt-3 leading-[1.6] text-[var(--skopos-muted)]">{useCase.outcome}</p></div>
                  {useCase.note ? <p className="mt-7 flex gap-2 text-sm text-[var(--skopos-muted)]"><Icon symbol="info" size="sm" />{useCase.note}</p> : null}
                </div>
                <div className="border-t border-[var(--skopos-rule-light)] p-[var(--page-gutter)] min-[960px]:border-t-0 min-[960px]:border-l min-[960px]:p-[clamp(28px,4vw,52px)]">
                  <PromptBlock prompt={useCase.prompt} label={useCase.title} />
                  <Link className="mt-4 grid min-h-[82px] grid-cols-[1fr_auto] items-center border border-[var(--skopos-rule-light)] px-5 hover:bg-[#f0eee8]" href={useCase.guideHref}><span><small className={cn(pageType.label, "block text-[#777]")}>Related guide</small><strong className="mt-2 block text-sm">{useCase.guideLabel}</strong></span><Icon symbol="arrow_forward" size="sm" /></Link>
                </div>
              </article>
            ))}
          </PageFrame>
        </PageSection>
        <ClosingSection title="Start with the workflow that costs you the most context." description="Add Skopos to one real repository and let the project carry the important parts forward."><PageAction href="/docs" primary light>Get started</PageAction><PageAction href="/how-it-works" light>See the complete loop</PageAction></ClosingSection>
      </article>
    </SiteShell>
  );
}
