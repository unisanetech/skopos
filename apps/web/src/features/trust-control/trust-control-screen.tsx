import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ClosingSection, PageAction, PageFrame, PageHero, PageSection, SectionIntro, SummaryStrip, pageType } from "@/patterns/site/page-layout";
import { SiteShell } from "@/patterns/site/site-shell";
import { trustControlCopy } from "./content";

function TruthBoundaryVisual() {
  return (
    <div className="trust-boundary-visual" role="img" aria-label="Tracked project truth is separated from rebuildable local Skopos state">
      <div className="trust-boundary-repo">
        <Icon symbol="folder_open" size="lg" />
        <span>Your repository</span>
        <strong>PROJECT TRUTH</strong>
      </div>
      <div className="trust-boundary-divider">
        <span>tracked</span>
        <i aria-hidden="true" />
        <span>local</span>
      </div>
      <div className="trust-boundary-local">
        <code>.skopos/**</code>
        <span>Rebuildable working state</span>
      </div>
    </div>
  );
}

export function TrustControlScreen() {
  return (
    <SiteShell>
      <article className="bg-[var(--skopos-paper)]">
        <header><PageHero visual={<TruthBoundaryVisual />}><h1 className={pageType.hero}>{trustControlCopy.title}</h1><p className="mt-8 max-w-[680px] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.65] text-[var(--skopos-muted)]">{trustControlCopy.description}</p><div className="mt-9"><a className="inline-flex min-h-[52px] items-center gap-7 border border-[var(--skopos-ink)] bg-[var(--skopos-ink)] px-[18px] text-[13px] font-bold text-white" href="#ownership">
                See the boundaries
                <Icon symbol="arrow_downward" size="sm" />
              </a></div></PageHero></header>
        <SummaryStrip items={trustControlCopy.summary} />

        <PageSection id="ownership" aria-labelledby="trust-ownership-title"><PageFrame><SectionIntro number="01" id="trust-ownership-title" title="Tracked truth and local working state stay separate." description="Your durable project knowledge remains reviewable and portable. Runtime machinery can be rebuilt without becoming another source of truth." /><div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-2">
              <article className="p-[var(--page-gutter)] md:border-r md:p-[clamp(32px,4vw,52px)]"><header className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2"><Icon symbol="inventory_2" size="md" /><span className={cn(pageType.label,"text-[#777]")}>Tracked in Git</span><strong className={cn(pageType.card,"col-span-2 mt-5")}>Durable truth</strong></header><ul className="mt-8 list-none border-t border-[var(--skopos-rule-light)] p-0">
                  {trustControlCopy.trackedTruth.map((item) => (
                    <li className="grid gap-2 border-b border-[var(--skopos-rule-light)] py-4 text-sm" key={item.path}><code>{item.path}</code><span className="text-[var(--skopos-muted)]">{item.label}</span></li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-[1.6] text-[var(--skopos-muted)]">Human-readable, reviewable in pull requests, and portable across supported agents.</p>
              </article>
              <article className="border-t border-[var(--skopos-rule-light)] p-[var(--page-gutter)] md:border-t-0 md:p-[clamp(32px,4vw,52px)]"><header className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2"><Icon symbol="memory" size="md" /><span className={cn(pageType.label,"text-[#777]")}>Kept local</span><strong className={cn(pageType.card,"col-span-2 mt-5")}>Working state</strong></header><ul className="mt-8 list-none border-t border-[var(--skopos-rule-light)] p-0">
                  {trustControlCopy.localState.map((item) => (
                    <li className="grid gap-2 border-b border-[var(--skopos-rule-light)] py-4 text-sm" key={item.path}><code>{item.path}</code><span className="text-[var(--skopos-muted)]">{item.label}</span></li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-[1.6] text-[var(--skopos-muted)]">May contain sensitive project details. Rebuildable state is not meant to be committed or shared wholesale.</p>
              </article>
            </div></PageFrame></PageSection>

        <PageSection className="bg-[var(--skopos-night)] text-white" aria-labelledby="trust-lifecycle-title"><PageFrame dark><SectionIntro number="02" id="trust-lifecycle-title" title="Know what each stage may change." description="Skopos makes the write boundary visible. Material restructuring and sensitive capabilities do not become authorized merely because an agent suggested them." dark /><div className="grid border-t border-[var(--skopos-rule-dark)] md:grid-cols-2 xl:grid-cols-4">
              {trustControlCopy.lifecycle.map((stage) => (
                <article className="flex min-h-[330px] flex-col border-b border-r border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] md:p-8 xl:border-b-0" key={stage.number}><header className="flex items-center justify-between font-mono text-xs text-[#888]"><span>{stage.number}</span><strong>{stage.label}</strong></header><h3 className={cn(pageType.card,"mt-10")}>{stage.title}</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-night-muted)]">{stage.description}</p><footer className="mt-auto flex gap-2 border-t border-[var(--skopos-rule-dark)] pt-5 text-xs text-[#aaa]"><Icon symbol="visibility" size="sm" />{stage.review}</footer>
                </article>
              ))}
            </div></PageFrame></PageSection>

        <PageSection aria-labelledby="trust-controls-title"><PageFrame><SectionIntro number="03" id="trust-controls-title" title="Instructions guide. Guards decide." description="Not every part of an agent workflow has the same strength. Skopos names the difference so guidance is never marketed as enforcement." /><div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-3">
              {trustControlCopy.controls.map((control, index) => (
                <article className="relative border-b border-r border-[var(--skopos-rule-light)] p-[var(--page-gutter)] md:border-b-0 md:p-8" key={control.label}><span className="font-mono text-xs text-[#777]">{String(index + 1).padStart(2, "0")}</span><small className={cn(pageType.label,"ml-5 text-[#777]")}>{control.kind}</small><h3 className={cn(pageType.card,"mt-10")}>{control.label}</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-muted)]">{control.description}</p>
                  {index < trustControlCopy.controls.length - 1 ? <Icon symbol="arrow_forward" size="sm" /> : null}
                </article>
              ))}
            </div></PageFrame></PageSection>

        <PageSection aria-labelledby="trust-evidence-title"><PageFrame className="grid min-[960px]:grid-cols-2"><div className="px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] md:px-[clamp(38px,5vw,68px)]"><span className="font-mono text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-light tracking-[-0.07em] text-[#b8b5ae]">04</span><h2 id="trust-evidence-title" className={cn(pageType.section,"mt-10")}>A green check expires when the work changes.</h2><p className="mt-6 leading-[1.65] text-[var(--skopos-muted)]">Evidence records the exact command, inputs, relevant source, configuration, environment, result, actor, and time. Change a declared dependency and the previous success becomes stale.</p><ul className="mt-8 grid list-none gap-3 p-0 text-sm">
                <li className="flex gap-3"><Icon symbol="check_circle" size="sm" />Fresh proof covers the Task acceptance.</li>
                <li className="flex gap-3"><Icon symbol="change_circle" size="sm" />Relevant source changes invalidate that proof.</li>
                <li className="flex gap-3"><Icon symbol="refresh" size="sm" />The focused check runs again against the new state.</li>
              </ul>
            </div><div className="flex items-center border-t border-[var(--skopos-rule-light)] p-[var(--page-gutter)] min-[960px]:border-t-0 min-[960px]:border-l min-[960px]:p-[clamp(38px,5vw,68px)]">
            <div className="trust-readiness-card" aria-label="Example explainable Readiness report">
              <header><span>Readiness</span><code>T-7f3a91c2</code></header>
              <div className="trust-readiness-result"><Icon symbol="block" size="lg" /><span>Blocked</span></div>
              <div className="trust-readiness-reason">
                <span>Why</span>
                <strong>Recovery test Evidence is stale.</strong>
                <p><code>src/checkout/recovery.ts</code> changed after the last passing run.</p>
              </div>
              <footer><span>Next safe action</span><strong>Run the focused recovery check</strong><Icon symbol="arrow_forward" size="sm" /></footer>
            </div></div></PageFrame></PageSection>

        <PageSection aria-labelledby="trust-coordination-title"><PageFrame><SectionIntro number="05" id="trust-coordination-title" title="Coordination is visible—and cooperative." description="Participating Sessions can claim bounded paths, detect overlap, record mutations, and surface unexplained changes. That is coordination, not a filesystem sandbox." /><div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-2">
              <article className="p-[var(--page-gutter)] md:border-r md:p-[clamp(32px,4vw,52px)]">
                <Icon symbol="group_work" size="lg" />
                <span className={cn(pageType.label,"mt-8 block text-[#777]")}>Inside the boundary</span><h3 className={cn(pageType.card,"mt-5")}>Skopos-aware Sessions</h3><ul className="mt-8 grid list-none gap-3 border-t border-[var(--skopos-rule-light)] pt-6 text-sm">
                  <li>One writing Task per Session</li>
                  <li>Transactional overlapping-path checks</li>
                  <li>Mutation and contamination audit</li>
                  <li>Audited stale-ownership takeover</li>
                </ul>
              </article>
              <article className="border-t border-[var(--skopos-rule-light)] p-[var(--page-gutter)] md:border-t-0 md:p-[clamp(32px,4vw,52px)]">
                <Icon symbol="warning" size="lg" />
                <span className={cn(pageType.label,"mt-8 block text-[#777]")}>Outside the boundary</span><h3 className={cn(pageType.card,"mt-5")}>Unmediated processes</h3><p className="mt-8 leading-[1.65] text-[var(--skopos-muted)]">A script, editor, agent, or person that bypasses the coordination runtime can still change files. Skopos may detect the unexplained change and reduce Readiness; it cannot claim the write was prevented.</p>
              </article>
            </div></PageFrame></PageSection>

        <PageSection className="bg-[var(--skopos-night)] text-white" aria-labelledby="trust-capabilities-title"><PageFrame dark><SectionIntro number="06" id="trust-capabilities-title" title="Capabilities are declared before execution." description="Projects decide which commands and integrations are legitimate. Skopos checks the declared boundary before an Action runs and records only the proof needed to explain the result." dark /><div className="grid border-t border-[var(--skopos-rule-dark)] md:grid-cols-3">
              {trustControlCopy.capabilities.map((capability) => (
                <article className="border-b border-r border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] md:border-b-0 md:p-[clamp(32px,4vw,52px)]" key={capability.label}>
                  <Icon symbol={capability.icon} size="lg" />
                  <h3 className={cn(pageType.card,"mt-9")}>{capability.label}</h3><p className="mt-4 leading-[1.6] text-[var(--skopos-night-muted)]">{capability.description}</p>
                </article>
              ))}
            </div></PageFrame></PageSection>

        <PageSection aria-labelledby="trust-limits-title"><PageFrame><SectionIntro number="07" id="trust-limits-title" title="Trust the explanation, not a badge alone." description="Skopos helps coding agents follow your project. It does not replace the agent, upload a second source of truth, or describe cooperative guidance as hard security." /><ol className="grid list-none border-t border-[var(--skopos-rule-light)] p-0 md:grid-cols-2">
              {trustControlCopy.limits.map((limit, index) => (
                <li className="grid grid-cols-[38px_1fr] gap-3 border-b border-r border-[var(--skopos-rule-light)] p-6 text-sm leading-[1.55]" key={limit}><span className="font-mono text-xs text-[#777]">{String(index + 1).padStart(2, "0")}</span>{limit}</li>
              ))}
            </ol>
            <div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-3">
              <a className="flex min-h-20 items-center justify-between gap-4 border-b border-r border-[var(--skopos-rule-light)] px-6 text-sm font-bold md:border-b-0" href="https://github.com/unisanetech/skopos/blob/main/docs/architecture/agent-native-operating-model.md" target="_blank" rel="noreferrer">
                Read the operating model <Icon symbol="arrow_outward" size="sm" />
              </a>
              <a className="flex min-h-20 items-center justify-between gap-4 border-b border-r border-[var(--skopos-rule-light)] px-6 text-sm font-bold md:border-b-0" href="https://github.com/unisanetech/skopos/blob/main/SECURITY.md" target="_blank" rel="noreferrer">
                Security policy <Icon symbol="arrow_outward" size="sm" />
              </a>
              <a className="flex min-h-20 items-center justify-between gap-4 px-6 text-sm font-bold" href="https://github.com/unisanetech/skopos/blob/main/LICENSE" target="_blank" rel="noreferrer">
                Apache-2.0 license <Icon symbol="arrow_outward" size="sm" />
              </a>
            </div></PageFrame></PageSection>

        <ClosingSection title="Give your agent clear authority—and clear limits." description="Start with one repository. Keep durable truth reviewable, make sensitive capabilities explicit, and require proof that still matches the source."><PageAction href="https://github.com/unisanetech/skopos/blob/main/docs/architecture/agent-native-operating-model.md" primary light>Read the operating model</PageAction><PageAction href="/docs" light>Get started</PageAction></ClosingSection>
      </article>
    </SiteShell>
  );
}
