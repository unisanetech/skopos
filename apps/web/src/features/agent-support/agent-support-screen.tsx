import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { AgentLogo } from "@/features/homepage/components/agent-logo";
import { cn } from "@/lib/utils";
import { ClosingSection, PageAction, PageFrame, PageHero, PageSection, SectionIntro, SummaryStrip, pageType } from "@/patterns/site/page-layout";
import { SiteShell } from "@/patterns/site/site-shell";
import {
  agentCapabilities,
  agentSupportCopy,
  supportedHosts,
  supportStateDescriptions,
  type SupportState,
} from "./content";

function StateBadge({ state }: { state: SupportState }) {
  return <span className={cn("inline-flex min-h-7 items-center border px-2.5 font-mono text-[10px] font-bold tracking-[0.04em] uppercase", state === "Verified" && "border-[#267a42] bg-[#e6f5eb] text-[#17602f]", state === "Beta" && "border-[#83732d] bg-[#f7f2d8] text-[#685b21]", state === "Manual workflow" && "border-[#888] bg-[#eee] text-[#555]", state === "Not supported" && "border-[#bda5a5] bg-[#f6eaea] text-[#855]")}>{state}</span>;
}

export function AgentSupportScreen() {
  return (
    <SiteShell>
      <article className="bg-[var(--skopos-paper)]">
        <header><PageHero visual={<div className="w-full border border-[var(--skopos-rule-light)]" aria-label="Current agent support overview">
              {supportedHosts.map((host) => <article key={host.id} className="flex min-h-20 items-center justify-between gap-4 border-b border-[var(--skopos-rule-light)] px-5 last:border-b-0"><div className="flex items-center gap-3"><AgentLogo name={host.id} /><strong>{host.shortName}</strong></div><StateBadge state={host.headlineState} /></article>)}
              <p className="m-0 flex gap-3 border-t border-[var(--skopos-rule-light)] p-5 text-xs leading-[1.5] text-[var(--skopos-muted)]"><Icon symbol="info" size="sm" />Support labels describe integration depth—not which agent is best for writing code.</p>
            </div>}><h1 className={pageType.hero}>{agentSupportCopy.title}</h1><p className="mt-8 max-w-[680px] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.65] text-[var(--skopos-muted)]">{agentSupportCopy.description}</p><div className="mt-9"><a className="inline-flex min-h-[52px] items-center gap-7 border border-[var(--skopos-ink)] bg-[var(--skopos-ink)] px-[18px] text-[13px] font-bold text-white" href="#support-matrix">
                Compare support
                <Icon symbol="arrow_downward" size="sm" />
              </a></div></PageHero></header>
        <SummaryStrip items={agentSupportCopy.summary} />

        <PageSection aria-labelledby="agent-support-shared-title"><PageFrame className="grid min-[900px]:grid-cols-2"><SectionIntro number="01" id="agent-support-shared-title" title="The project stays the same. The automation changes." />
            <div className="border-t border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.65] text-[var(--skopos-muted)] min-[900px]:border-t-0 min-[900px]:border-l min-[900px]:px-[clamp(38px,5vw,68px)]">
              <p>
                Memory, Tasks, project rules, Actions, Evidence, and Readiness belong to Skopos and the repository—not to one chat product.
              </p>
              <p>
                A host integration decides whether context delivery, handoff, compaction, and completion happen automatically or through an explicit command.
              </p>
            </div></PageFrame></PageSection>

        <PageSection id="support-matrix" aria-labelledby="agent-support-matrix-title"><PageFrame><SectionIntro number="02" id="agent-support-matrix-title" title="What works in each host today." description="Every label inherits the proof date and limitation link shown for its host below." />
            <p className="flex items-center gap-2 border-t border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-3 text-xs text-[#777] md:hidden">
              Swipe to compare hosts
              <Icon symbol="arrow_forward" size="sm" />
            </p>
            <div className="overflow-x-auto border-t border-[var(--skopos-rule-light)]" tabIndex={0} aria-label="Scrollable agent support comparison">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm [&_td]:border-r [&_td]:border-b [&_td]:border-[var(--skopos-rule-light)] [&_td]:p-5 [&_th]:border-r [&_th]:border-b [&_th]:border-[var(--skopos-rule-light)] [&_th]:p-5 [&_tr>*:last-child]:border-r-0">
                <thead>
                  <tr>
                    <th scope="col">Capability</th>
                    {supportedHosts.map((host) => (
                      <th key={host.id} scope="col">
                        <span className="flex items-center gap-2"><AgentLogo name={host.id} />{host.shortName}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agentCapabilities.map((capability) => (
                    <tr key={capability.id}>
                      <th scope="row">
                        <strong className="block">{capability.label}</strong>
                        <span className="mt-2 block max-w-[260px] text-xs leading-[1.45] text-[#777]">{capability.description}</span>
                      </th>
                      {supportedHosts.map((host) => {
                        const support = capability.support[host.id];
                        return (
                          <td key={host.id}>
                            <StateBadge state={support.state} />
                            <span className="mt-3 block text-xs leading-[1.45] text-[#666]">{support.detail}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></PageFrame></PageSection>

        <PageSection aria-labelledby="agent-support-legend-title"><PageFrame><SectionIntro number="03" id="agent-support-legend-title" title="Read the labels literally." /><div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-2">
              {(Object.entries(supportStateDescriptions) as [SupportState, string][]).map(([state, description]) => (
                <article key={state} className="border-b border-[var(--skopos-rule-light)] p-[var(--page-gutter)] last:border-b-0 md:border-r md:p-8 md:nth-[n+3]:border-b-0 md:nth-[2n]:border-r-0">
                  <StateBadge state={state} />
                  <p className="mt-5 leading-[1.6] text-[var(--skopos-muted)]">{description}</p>
                </article>
              ))}
            </div></PageFrame></PageSection>

        <PageSection aria-labelledby="agent-support-hosts-title"><PageFrame><SectionIntro number="04" id="agent-support-hosts-title" title="Choose the integration that fits your host." /><div className="grid border-t border-[var(--skopos-rule-light)] md:grid-cols-2">
              {supportedHosts.map((host) => (
                <article key={host.id} className="flex min-h-[310px] flex-col border-b border-[var(--skopos-rule-light)] p-[var(--page-gutter)] last:border-b-0 md:border-r md:p-8 md:nth-[n+3]:border-b-0 md:nth-[2n]:border-r-0">
                  <header className="flex items-start justify-between gap-5">
                    <span className="flex items-center gap-3 font-bold"><AgentLogo name={host.id} />{host.name}</span>
                    <StateBadge state={host.headlineState} />
                  </header>
                  <p className="mt-8 leading-[1.6] text-[var(--skopos-muted)]">{host.summary}</p>
                  <footer className="mt-auto border-t border-[var(--skopos-rule-light)] pt-6 text-xs"><span className="text-[#777]">Proof reviewed {host.proofDate}</span><div className="mt-4 flex flex-wrap gap-5 font-bold">
                      <Link className="inline-flex items-center gap-2" href={host.setupHref}>Setup <Icon symbol="arrow_forward" size="sm" /></Link>
                      <a className="inline-flex items-center gap-2" href={host.proofHref} target="_blank" rel="noreferrer">
                        {host.proofLabel} <Icon symbol="arrow_outward" size="sm" />
                      </a>
                    </div></footer>
                </article>
              ))}
            </div></PageFrame></PageSection>

        <ClosingSection title="Change agents without changing the project truth." description="Use the strongest available integration. When automation stops, the same reviewed Skopos workflow continues manually."><PageAction href="/docs" primary light>Set up a supported agent</PageAction><PageAction href="/trust" light>See trust boundaries</PageAction></ClosingSection>
      </article>
    </SiteShell>
  );
}
