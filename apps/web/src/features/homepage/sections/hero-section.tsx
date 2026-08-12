import { RepositoryTruthVisual } from "../components/repository-truth-visual";
import { heroCopy } from "../content/homepage-copy";
import { HeroOnboarding } from "./hero-onboarding";
import { pageType } from "@/patterns/site/page-layout";

export function HeroSection() {
  return (
    <section id="home" className="px-0 md:px-[var(--page-gutter)]" aria-labelledby="hero-title">
      <div className="mx-auto grid min-h-[560px] w-full max-w-[var(--page-max-width)] border-x-0 md:border-x md:border-[var(--skopos-rule-light)] min-[960px]:min-h-[calc(100svh-176px)] min-[960px]:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-end pt-12 min-[960px]:pt-8">
          <div className="px-[var(--page-gutter)] md:px-[clamp(38px,5vw,72px)]">
            <h1 className={pageType.hero} id="hero-title" aria-label={heroCopy.title}>
              <span className="block" aria-hidden="true">{heroCopy.titleLines[0]}</span>
              <span className="block" aria-hidden="true">{heroCopy.titleLines[1]}</span>
            </h1>
            <p className="mt-6 max-w-[660px] text-base leading-[1.6] text-[var(--skopos-muted)] lg:text-lg">{heroCopy.description}</p>
          </div>
          <HeroOnboarding />
        </div>
        <figure className="m-0 flex min-h-[440px] items-center justify-center border-t border-[var(--skopos-rule-light)] p-[clamp(12px,2.4vw,36px)] min-[960px]:min-h-0 min-[960px]:border-t-0 min-[960px]:border-l">
          <RepositoryTruthVisual />
        </figure>
      </div>
    </section>
  );
}
