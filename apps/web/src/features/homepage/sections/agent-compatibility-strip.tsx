import { AgentLogo } from "../components/agent-logo";
import { agentCompatibilityCopy } from "../content/homepage-copy";
import { pageType } from "@/patterns/site/page-layout";

export function AgentCompatibilityStrip() {
  return (
    <section className="border-y border-[var(--skopos-rule-light)] px-0 md:px-[var(--page-gutter)]" aria-labelledby="agent-compatibility-title">
      <div className="mx-auto grid w-full max-w-[var(--page-max-width)] border-x-0 md:border-x md:border-[var(--skopos-rule-light)] min-[960px]:grid-cols-[330px_1fr]">
        <div className="flex flex-col justify-center border-b border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-7 min-[960px]:border-r min-[960px]:border-b-0 md:px-8">
          <p className={`${pageType.label} text-[#777]`}>{agentCompatibilityCopy.eyebrow}</p>
          <h2 className="mt-3 max-w-[260px] text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.2] font-bold tracking-[-0.025em]" id="agent-compatibility-title">{agentCompatibilityCopy.title}</h2>
        </div>
        <ul className="grid list-none grid-cols-2 p-0 md:grid-cols-4" aria-label="Coding agent support status">
          {agentCompatibilityCopy.agents.map((agent) => (
            <li className="flex min-h-28 items-center gap-3 border-r border-b border-[var(--skopos-rule-light)] px-4 nth-[2n]:border-r-0 md:min-h-32 md:border-b-0 md:nth-[2n]:border-r md:last:border-r-0" key={agent.name}>
              <AgentLogo name={agent.icon} />
              <span className="min-w-0">
                <strong className="block text-sm">{agent.name}</strong>
                <span className="mt-1.5 block text-[10px] leading-[1.35] font-medium tracking-[0.02em] text-[#777]">{agent.status}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
