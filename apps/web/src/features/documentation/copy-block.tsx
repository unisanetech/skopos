"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { copyText } from "@/lib/copy-text";
import { cn } from "@/lib/utils";

type CopyStatus = "idle" | "copying" | "copied" | "failed";

export function DocumentationCopyBlock({
  label,
  value,
  kind,
}: {
  label: string;
  value: string | readonly string[];
  kind: "prompt" | "commands";
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = typeof value === "string" ? value : value.join("\n");

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    setStatus("copying");
    const copied = await copyText(text);
    setStatus(copied ? "copied" : "failed");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  const buttonLabel = status === "copied" ? "Copied" : status === "failed" ? "Try again" : status === "copying" ? "Copying" : "Copy";
  const accessibleLabel = status === "copied" ? `${label} copied` : status === "failed" ? `Copy ${label} failed` : `Copy ${label}`;

  return (
    <div className="docs-copy-block min-w-0 border border-[var(--skopos-rule-dark)] bg-[var(--skopos-night-soft)] text-[#f5f5f5]">
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[var(--skopos-rule-dark)] pl-[22px]">
        <span className="text-[11px] font-bold tracking-[0.11em] text-[#a3a3a3] uppercase">{label}</span>
        <button className="flex min-h-16 min-w-28 cursor-pointer items-center justify-center gap-[9px] border-0 border-l border-[var(--skopos-rule-dark)] bg-[#151515] text-xs font-bold text-[#e8e8e8] hover:bg-[#222] hover:text-white focus-visible:bg-[#222] focus-visible:text-white disabled:cursor-wait disabled:opacity-70" type="button" disabled={status === "copying"} aria-label={accessibleLabel} aria-live="polite" onClick={() => { void copy(); }}>
          <Icon symbol={status === "copied" ? "check" : status === "failed" ? "error" : "content_copy"} size="sm" />
          {buttonLabel}
        </button>
      </header>
      {kind === "prompt" ? (
        <blockquote className="m-0 flex min-h-[270px] items-center p-[clamp(28px,4vw,48px)] text-[clamp(1.12rem,1.8vw,1.48rem)] leading-[1.52] font-medium tracking-[-0.025em]">“{text}”</blockquote>
      ) : (
        <ol className="m-0 flex min-h-[190px] list-none flex-col justify-center gap-4 p-6">
          {(value as readonly string[]).map((command) => (
            <li className="grid min-w-0 grid-cols-[18px_minmax(0,1fr)] gap-2 text-[#bdbdbd]" key={command}><span className="font-mono text-[#6e6e6e]" aria-hidden="true">$</span><code className="[overflow-wrap:anywhere] text-xs leading-[1.65] text-[#eee]">{command}</code></li>
          ))}
        </ol>
      )}
    </div>
  );
}
