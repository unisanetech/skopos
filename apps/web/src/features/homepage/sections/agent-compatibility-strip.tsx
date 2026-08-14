import { AgentLogo } from "../components/agent-logo";
import { agentCompatibilityCopy } from "../content/homepage-copy";
import { pageType } from "@/patterns/site/page-layout";

export function AgentCompatibilityStrip() {
  return (
    <section className="border-y border-[var(--skopos-rule-light)] px-0 md:px-[var(--page-gutter)]" aria-labelledby="agent-compatibility-title">
      <div className="mx-auto grid w-full max-w-[var(--page-max-width)] border-x-0 md:border-x md:border-[var(--skopos-rule-light)] min-[960px]:grid-cols-[330px_1fr]">
        <div className="flex flex-col justify-center border-b border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-7 min-[960px]:border-r min-[960px]:border-b-0 md:px-8">
          <p className={`${pageType.label} text-[#777]`}>{agentCompatibilityCopy.eyebrow}</p>
          <h2 className="mt-3 max-w-[240px] text-[clamp(0.9rem,1.15vw,1.05rem)] leading-[1.25] font-bold tracking-[-0.02em]" id="agent-compatibility-title">{agentCompatibilityCopy.title}</h2>
        </div>
        <ul className="grid list-none grid-cols-2 p-0 md:grid-cols-4" aria-label="Coding agent support status">
          {agentCompatibilityCopy.agents.map((agent) => (
            <li className="flex min-h-28 items-center justify-center gap-3.5 border-r border-b border-[var(--skopos-rule-light)] px-4 nth-[2n]:border-r-0 md:min-h-32 md:border-b-0 md:nth-[2n]:border-r md:last:border-r-0" key={agent.name}>
              <AgentLogo name={agent.icon} size={32} />
              <strong className="min-w-0 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.15] tracking-[-0.02em]">{agent.name}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
