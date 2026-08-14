import Link from "next/link";
import { releaseStatusCopy } from "@/features/homepage/content/homepage-copy";
import { publicLinks } from "@/features/homepage/content/public-links";
import { cn } from "@/lib/utils";

const brandLetters = "SKOPOS".split("");

export function SiteFooter() {
  return <footer id="site-footer" className="min-w-0 border-t border-[var(--skopos-rule-dark)] bg-[var(--skopos-night)] px-0 text-xs text-[#9d9d9d] md:px-[var(--page-gutter)]"><div className="mx-auto grid w-full max-w-[var(--page-max-width)] grid-cols-6 border-x-0 border-[var(--skopos-rule-dark)] md:border-x" role="img" aria-label="Skopos">{brandLetters.map((letter, index) => <span key={`${letter}-${index}`} aria-hidden="true" className={cn("flex min-h-[96px] min-w-0 items-center justify-center border-r border-[var(--skopos-rule-dark)] text-[clamp(2.6rem,10.5vw,9.25rem)] leading-[0.72] font-[760] tracking-[-0.08em] text-[#f4f4f2] md:min-h-[clamp(120px,15vw,220px)]", index === brandLetters.length - 1 && "border-r-0")}>{letter}</span>)}</div><div className="mx-auto grid min-h-[102px] w-full max-w-[var(--page-max-width)] grid-cols-2 items-center gap-x-[18px] gap-y-3 border-x-0 border-t border-[var(--skopos-rule-dark)] px-[var(--page-gutter)] py-[18px] md:min-h-[42px] md:grid-cols-[1fr_auto_1fr] md:gap-6 md:border-x md:px-[clamp(24px,3vw,42px)]"><a className="flex items-center gap-[9px] text-[#ddd] hover:text-white" href={publicLinks.npm}><span className="size-[9px] rounded-full bg-[var(--skopos-signal)]" aria-hidden="true" />{releaseStatusCopy}</a><p className="m-0">© {new Date().getFullYear()} Skopos Project</p><p className="m-0 hidden justify-self-end md:block"><Link className="hover:text-white" href="/docs">Docs</Link><span aria-hidden="true"> · </span><Link className="hover:text-white" href="/changelog">Changelog</Link><span aria-hidden="true"> · </span><a className="hover:text-white" href={publicLinks.source}>Source</a></p></div></footer>;
}
