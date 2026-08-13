"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { resolveFragmentId, revealFragmentTarget } from "@/lib/fragment-navigation";
import { DocumentationCopyBlock } from "./copy-block";
import { featureWorkflowStages, type FeatureWorkflowStageId } from "./feature-workflow-content";
import { cn } from "@/lib/utils";
import { documentationType } from "./documentation-layout";

const featureWorkflowStageIds = featureWorkflowStages.map((stage) => stage.id);

export function FeatureWorkflowNavigator() {
  const [stageId, setStageId] = useState<FeatureWorkflowStageId>("discuss");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = featureWorkflowStages.find((item) => item.id === stageId) ?? featureWorkflowStages[0];

  useEffect(() => {
    const selectFromHash = () => {
      const fragmentId = resolveFragmentId(window.location.hash, featureWorkflowStageIds);
      if (!fragmentId) return;
      setStageId(fragmentId);
      window.requestAnimationFrame(() => revealFragmentTarget(fragmentId));
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);

  const select = (next: FeatureWorkflowStageId) => {
    setStageId(next);
    window.history.replaceState(null, "", `#${next}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const last = featureWorkflowStages.length - 1;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? last : event.key === "ArrowRight" ? (index + 1) % featureWorkflowStages.length : (index - 1 + featureWorkflowStages.length) % featureWorkflowStages.length;
    const next = featureWorkflowStages[nextIndex];
    select(next.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="border-y border-[var(--skopos-rule-light)]">
      <div className="grid grid-cols-2 border-b border-[var(--skopos-rule-light)] min-[768px]:grid-cols-4 min-[1001px]:grid-cols-7" role="tablist" aria-label="Feature workflow stages">
        {featureWorkflowStages.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => { tabRefs.current[index] = node; }}
            id={item.id}
            type="button"
            role="tab"
            aria-selected={stageId === item.id}
            aria-controls="feature-workflow-panel"
            tabIndex={stageId === item.id ? 0 : -1}
            className={cn("flex min-h-[70px] items-center gap-3 border-r border-b border-[var(--skopos-rule-light)] bg-transparent px-3.5 py-4 text-left text-xs font-bold text-[#606060] [font-family:var(--font-sans)] even:border-r-0 min-[768px]:min-h-[82px] min-[768px]:even:border-r min-[768px]:[&:nth-child(4n)]:border-r-0 min-[1001px]:border-b-0 min-[1001px]:[&:nth-child(4n)]:border-r min-[1001px]:last:border-r-0", index >= 4 && "min-[768px]:border-b-0", index >= featureWorkflowStages.length - 1 && "border-b-0", stageId === item.id && "bg-[var(--skopos-ink)] text-white")}
            onClick={() => select(item.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className={cn("font-mono text-[9px] text-[#7a7a7a]", stageId === item.id && "text-[#a9a9a9]")}>{item.number}</span>
            {item.verb}
          </button>
        ))}
      </div>

      <section id="feature-workflow-panel" role="tabpanel" aria-labelledby={stage.id}>
        <header className="grid min-h-[300px] items-end gap-[30px] border-b border-[var(--skopos-rule-light)] px-[var(--page-gutter)] py-[clamp(44px,5vw,66px)] min-[901px]:grid-cols-[1.12fr_0.88fr] min-[901px]:gap-[60px] md:px-[clamp(38px,5vw,68px)]">
          <div><span className="font-mono text-[10px] tracking-[0.08em] text-[#707070] uppercase">{stage.number} · {stage.verb}</span><h2 className={cn(documentationType.section, "mt-[26px] max-w-[720px]")}>{stage.title}</h2></div>
          <p className="m-0 max-w-[550px] text-base leading-[1.65] text-[var(--skopos-muted)]">{stage.description}</p>
        </header>

        <div className="grid bg-[var(--skopos-night)] min-[901px]:grid-cols-2 [&>div]:border-0 [&>div]:border-b [&>div]:border-[var(--skopos-rule-dark)] [&>div:last-child]:border-b-0 min-[901px]:[&>div]:border-r min-[901px]:[&>div]:border-b-0 min-[901px]:[&>div:last-child]:border-r-0 [&_blockquote]:min-h-[360px] [&_ol]:min-h-[360px] max-[560px]:[&_blockquote]:min-h-[280px] max-[560px]:[&_ol]:min-h-[280px]">
          <DocumentationCopyBlock label="Say this to your agent" value={stage.prompt} kind="prompt" />
          <DocumentationCopyBlock label="Exact command path" value={stage.commands} kind="commands" />
        </div>

        <div className="grid md:grid-cols-2">
          <Responsibility title="What Skopos handles" icon="settings" items={stage.handles} />
          <Responsibility title="What you review" icon="visibility" items={stage.review} last />
        </div>

        <footer className="grid min-h-[110px] grid-cols-1 items-center gap-2 bg-[var(--skopos-ink)] px-[var(--page-gutter)] py-6 text-white md:grid-cols-[150px_1fr] md:gap-6 md:px-[clamp(36px,4vw,52px)]"><span className="font-mono text-[10px] tracking-[0.09em] text-[#969696] uppercase">Result</span><strong className="max-w-[900px] text-base leading-[1.55]">{stage.result}</strong></footer>
      </section>
    </div>
  );
}

function Responsibility({ title, icon, items, last = false }: { title: string; icon: string; items: readonly string[]; last?: boolean }) {
  return <article className={cn("border-b border-[var(--skopos-rule-light)] p-[clamp(36px,4vw,52px)] md:border-r md:border-b-0", last && "border-b-0 md:border-r-0")}><h3 className="text-[clamp(1.65rem,2.4vw,2.2rem)] tracking-[-0.04em]">{title}</h3><ul className="mt-7 list-none border-t border-[var(--skopos-rule-light)] p-0">{items.map((item) => <li key={item} className="grid min-h-[76px] grid-cols-[28px_1fr] items-center gap-3.5 border-b border-[var(--skopos-rule-light)] py-3.5 text-[13px] leading-[1.5] text-[var(--skopos-muted)]"><Icon symbol={icon} size="sm" />{item}</li>)}</ul></article>;
}
