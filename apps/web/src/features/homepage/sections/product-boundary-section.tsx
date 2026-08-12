import { Icon } from "@/components/ui/icon";
import { boundaryCopy } from "../content/homepage-copy";
import { ClosingCtaSection } from "./closing-cta-section";
import { pageType } from "@/patterns/site/page-layout";

export function ProductBoundarySection() {
  return (
    <section id="boundary" className="bg-[var(--skopos-night)] px-0 text-white md:px-[var(--page-gutter)]" aria-labelledby="boundary-title">
      <div className="mx-auto w-full max-w-[var(--page-max-width)] border-x-0 md:border-x md:border-[var(--skopos-rule-dark)]">
        <div className="grid min-h-[320px] items-center gap-8 px-[var(--page-gutter)] py-14 md:px-[clamp(38px,5vw,68px)] min-[960px]:grid-cols-[160px_1.3fr_1fr_100px]">
          <div className="font-mono text-[clamp(4rem,8vw,7rem)] leading-none font-light tracking-[-0.08em] text-[#333]" aria-hidden="true">
            {boundaryCopy.number}
          </div>
          <div>
            <p className={`${pageType.label} text-[#888]`}>{boundaryCopy.eyebrow}</p>
            <h2 className={`${pageType.section} mt-5`} id="boundary-title">{boundaryCopy.title}</h2>
          </div><p className="leading-[1.65] text-[var(--skopos-night-muted)]">{boundaryCopy.description}</p>
          <Icon className="justify-self-start min-[960px]:justify-self-end" symbol="account_tree" size={64} aria-hidden="true" />
        </div>
        <div className="grid border-t border-[var(--skopos-rule-dark)] min-[960px]:grid-cols-[1fr_1fr_360px]">
          <div className="p-[var(--page-gutter)] min-[960px]:border-r min-[960px]:border-[var(--skopos-rule-dark)] min-[960px]:p-[clamp(32px,4vw,52px)]">
            <h3 className={`${pageType.label} text-[#888]`}>Skopos is</h3>
            <ul className="mt-7 grid list-none gap-4 p-0">
              {boundaryCopy.is.map((item) => (
                <li className="flex gap-3 text-sm text-[#d0d0d0]" key={item}>
                  <Icon symbol="check_circle" filled size="sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] min-[960px]:border-t-0 min-[960px]:border-r min-[960px]:p-[clamp(32px,4vw,52px)]">
            <h3 className={`${pageType.label} text-[#888]`}>Skopos is not</h3>
            <ul className="mt-7 grid list-none gap-4 p-0">
              {boundaryCopy.isNot.map((item) => (
                <li className="flex gap-3 text-sm text-[#d0d0d0]" key={item}>
                  <Icon symbol="close" size="sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ClosingCtaSection />
        </div>
      </div>
    </section>
  );
}
