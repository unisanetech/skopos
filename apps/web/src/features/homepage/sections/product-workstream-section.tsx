import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { homepageDeepLinks } from "../content/homepage-copy";
import { WorkstreamDemo } from "../workstream/workstream-demo";
import { pageType } from "@/patterns/site/page-layout";

export function ProductWorkstreamSection() {
  return (
    <section id="workflow" className="bg-[var(--skopos-night)] px-0 text-white md:px-[var(--page-gutter)]" aria-labelledby="workflow-title">
      <div className="mx-auto w-full max-w-[var(--page-max-width)] border-x-0 md:border-x md:border-[var(--skopos-rule-dark)]">
        <div className="px-[var(--page-gutter)] py-[clamp(56px,7vw,92px)] md:px-[clamp(38px,5vw,68px)]">
          <div className="flex flex-wrap justify-between gap-4 font-mono text-[10px] font-bold tracking-[0.09em] text-[#888] uppercase">
            <p>Example workflow · Checkout recovery</p>
            <p>example/atlas-commerce</p>
          </div>
          <h2 className={`${pageType.section} mt-7 max-w-[980px]`} id="workflow-title">See what happens after you ask your coding agent.</h2>
          <p className="mt-7 max-w-[760px] text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.65] text-[var(--skopos-night-muted)]">
            The agent writes the code. Skopos recovers the project context, keeps the change
            bounded, runs the project-approved checks, and shows why the Task is ready to close.
          </p>
          <Link className="mt-8 inline-flex items-center gap-3 text-sm font-bold" href={homepageDeepLinks.workflow}>
            Follow the complete request-to-proof loop
            <Icon symbol="arrow_forward" size="sm" />
          </Link>
        </div>

        <div className="grid border-t border-[var(--skopos-rule-dark)] min-[960px]:grid-cols-[1fr_360px]" aria-label="Example developer request">
          <div className="p-[var(--page-gutter)] min-[960px]:border-r min-[960px]:border-[var(--skopos-rule-dark)] min-[960px]:p-[clamp(32px,4vw,52px)]">
            <p className={`${pageType.label} text-[#888]`}>You ask</p>
            <blockquote className="mt-6 max-w-[900px] text-[clamp(1.15rem,2vw,1.7rem)] leading-[1.45] font-medium">
              Fix the checkout recovery bug. If payment succeeds but order confirmation is
              interrupted, retrying must not charge the customer or create the order twice. Keep
              the payment provider unchanged and add focused tests for the recovery path.
            </blockquote>
          </div>
          <div className="grid border-t border-[var(--skopos-rule-dark)] min-[960px]:border-t-0" aria-label="What happens next">
            <p className="grid grid-cols-[36px_1fr] items-center gap-3 border-b border-[var(--skopos-rule-dark)] p-6 text-sm">
              <span className="font-mono text-xs text-[#777]">01</span>
              <strong>Your coding agent works.</strong>
            </p>
            <p className="grid grid-cols-[36px_1fr] items-center gap-3 p-6 text-sm">
              <span className="font-mono text-xs text-[#777]">02</span>
              <strong>Skopos keeps the loop grounded in the repository.</strong>
            </p>
          </div>
        </div>
        <WorkstreamDemo />
      </div>
    </section>
  );
}
