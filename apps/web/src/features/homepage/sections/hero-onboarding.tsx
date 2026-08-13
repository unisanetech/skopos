"use client";

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { copyText } from "@/lib/copy-text";
import { cn } from "@/lib/utils";
import { heroOnboarding } from "../content/homepage-copy";

type OnboardingMode = "source" | "agent";
type CopyStatus = "idle" | "copying" | "copied" | "failed";

function getCopyValue(mode: OnboardingMode) {
  if (mode === "source") return heroOnboarding.source.commands.join("\n");

  return [
    heroOnboarding.agent.brief,
    "",
    "Suggested sequence:",
    ...heroOnboarding.agent.commands,
  ].join("\n");
}

export function HeroOnboarding() {
  const [mode, setMode] = useState<OnboardingMode>("agent");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRequest = useRef(0);
  const sourceTabRef = useRef<HTMLButtonElement>(null);
  const agentTabRef = useRef<HTMLButtonElement>(null);
  const copyValue = useMemo(() => getCopyValue(mode), [mode]);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const selectMode = (nextMode: OnboardingMode) => {
    copyRequest.current += 1;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setMode(nextMode);
    setCopyStatus("idle");
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentMode: OnboardingMode) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const nextMode =
      event.key === "Home"
        ? "agent"
        : event.key === "End"
          ? "source"
          : currentMode === "source"
            ? "agent"
            : "source";
    selectMode(nextMode);
    (nextMode === "source" ? sourceTabRef : agentTabRef).current?.focus();
  };

  const copyCurrentPanel = async () => {
    const request = copyRequest.current + 1;
    copyRequest.current = request;
    setCopyStatus("copying");
    const copied = await copyText(copyValue);
    if (copyRequest.current !== request) return;

    setCopyStatus(copied ? "copied" : "failed");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      if (copyRequest.current === request) setCopyStatus("idle");
    }, 1800);
  };

  const panel = mode === "source" ? heroOnboarding.source : heroOnboarding.agent;

  return (
    <div className="mt-8 border-t border-[var(--skopos-rule-light)] [overflow-anchor:none] min-[960px]:mt-6">
      <div className="grid min-h-[52px] grid-cols-[1fr_auto] border-b border-[var(--skopos-rule-light)]">
        <div className="grid grid-cols-2" role="tablist" aria-label="Choose how to start with Skopos">
          <button
            ref={agentTabRef}
            id="hero-agent-tab"
            className={cn("cursor-pointer border-0 border-r border-[var(--skopos-rule-light)] bg-transparent px-4 text-left text-xs font-bold text-[#666]", mode === "agent" && "bg-[var(--skopos-ink)] text-white")}
            type="button"
            role="tab"
            aria-selected={mode === "agent"}
            aria-controls="hero-onboarding-panel"
            tabIndex={mode === "agent" ? 0 : -1}
            onClick={() => selectMode("agent")}
            onKeyDown={(event) => onTabKeyDown(event, "agent")}
          >
            {heroOnboarding.agent.tabLabel}
          </button>
          <button
            ref={sourceTabRef}
            id="hero-source-tab"
            className={cn("cursor-pointer border-0 border-r border-[var(--skopos-rule-light)] bg-transparent px-4 text-left text-xs font-bold text-[#666]", mode === "source" && "bg-[var(--skopos-ink)] text-white")}
            type="button"
            role="tab"
            aria-selected={mode === "source"}
            aria-controls="hero-onboarding-panel"
            tabIndex={mode === "source" ? 0 : -1}
            onClick={() => selectMode("source")}
            onKeyDown={(event) => onTabKeyDown(event, "source")}
          >
            {heroOnboarding.source.tabLabel}
          </button>
        </div>
        <span className="hidden items-center px-4 font-mono text-[10px] font-bold text-[#666] sm:flex">
          {heroOnboarding.packageLabel}
        </span>
      </div>

      <div
        id="hero-onboarding-panel"
        className="h-[200px] overflow-hidden bg-[var(--skopos-night)] text-white"
        role="tabpanel"
        aria-labelledby={mode === "source" ? "hero-source-tab" : "hero-agent-tab"}
      >
        <div className="flex min-h-14 items-center justify-between border-b border-[var(--skopos-rule-dark)] pl-5">
          <span className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#888] uppercase">{panel.label}</span>
          <button
            className="flex min-h-14 min-w-28 cursor-pointer items-center justify-center gap-2 border-0 border-l border-[var(--skopos-rule-dark)] bg-[#151515] text-xs font-bold text-[#e8e8e8] hover:bg-[#222] disabled:cursor-wait disabled:opacity-70"
            type="button"
            aria-label={
              copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Copy failed"
                  : copyStatus === "copying"
                    ? "Copying"
                    : panel.copyLabel
            }
            aria-live="polite"
            disabled={copyStatus === "copying"}
            onClick={() => {
              void copyCurrentPanel();
            }}
          >
            <Icon
              symbol={
                copyStatus === "copied"
                  ? "check"
                  : copyStatus === "failed"
                    ? "error"
                    : "content_copy"
              }
              size="sm"
            />
            <span>
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Try again"
                  : copyStatus === "copying"
                    ? "Copying"
                    : "Copy"}
            </span>
          </button>
        </div>

        {mode === "source" ? (
          <ol className="grid list-none gap-2.5 p-4 font-mono text-[clamp(0.68rem,1vw,0.8rem)] text-[#d6d6d6]" aria-label="Skopos installation commands">
            {heroOnboarding.source.commands.map((command) => (
              <li className="grid grid-cols-[18px_1fr] gap-2" key={command}>
                <span className="text-[#666]" aria-hidden="true">$</span>
                <code>{command}</code>
              </li>
            ))}
          </ol>
        ) : (
          <div className="p-4">
            <p className="max-w-[660px] text-xs leading-[1.5] text-[#d6d6d6] sm:text-sm">{heroOnboarding.agent.visibleBrief}</p>
            <ol className="mt-4 grid list-none grid-cols-3 border border-[var(--skopos-rule-dark)] p-0" aria-label="Agent setup sequence">
              {heroOnboarding.agent.steps.map((step) => (
                <li className="flex min-h-12 items-center gap-2 border-r border-[var(--skopos-rule-dark)] px-2 text-[10px] font-bold last:border-r-0 sm:gap-3 sm:px-4 sm:text-xs" key={step.number}>
                  <span className="font-mono text-[#777]">{step.number}</span>
                  {step.label}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

    </div>
  );
}
