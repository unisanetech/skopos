"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { copyText } from "@/lib/copy-text";
type CopyStatus = "idle" | "copying" | "copied" | "failed";
export function PromptBlock({ prompt, label }: { prompt: string; label: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle"); const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);
  const copyPrompt = async () => { setStatus("copying"); const copied = await copyText(prompt); setStatus(copied ? "copied" : "failed"); if (resetTimer.current) clearTimeout(resetTimer.current); resetTimer.current = setTimeout(() => setStatus("idle"), 1800); };
  return <div className="border border-[var(--skopos-rule-dark)] bg-[var(--skopos-night-soft)] text-white"><div className="flex min-h-16 items-center justify-between gap-4 border-b border-[var(--skopos-rule-dark)] pl-[22px]"><span className="text-[10px] font-bold tracking-[0.1em] text-[#999] uppercase">Say this to your agent</span><button className="flex min-h-16 min-w-28 cursor-pointer items-center justify-center gap-2 border-0 border-l border-[var(--skopos-rule-dark)] bg-[#151515] text-xs font-bold text-[#e8e8e8] hover:bg-[#222] disabled:cursor-wait disabled:opacity-70" type="button" aria-label={status === "copied" ? `Prompt copied for ${label}` : status === "failed" ? `Copy failed for ${label}` : `Copy prompt for ${label}`} aria-live="polite" disabled={status === "copying"} onClick={() => { void copyPrompt(); }}><Icon symbol={status === "copied" ? "check" : status === "failed" ? "error" : "content_copy"} size="sm" />{status === "copied" ? "Copied" : status === "failed" ? "Try again" : status === "copying" ? "Copying" : "Copy"}</button></div><blockquote className="m-0 min-h-[230px] p-[clamp(28px,4vw,46px)] text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.55] font-medium">“{prompt}”</blockquote></div>;
}
