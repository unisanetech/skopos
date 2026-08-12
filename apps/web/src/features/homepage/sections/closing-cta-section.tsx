import { homepageDeepLinks } from "../content/homepage-copy";
import { PageAction } from "@/patterns/site/page-layout";

export function ClosingCtaSection() {
  return (
    <div className="flex flex-col justify-center gap-3 border-t border-[var(--skopos-rule-dark)] p-[var(--page-gutter)] min-[960px]:border-t-0 min-[960px]:p-8">
      <PageAction href={homepageDeepLinks.workflow} primary light>Explore how Skopos works</PageAction>
      <PageAction href={homepageDeepLinks.projectMemory} light>Understand Project Memory</PageAction>
    </div>
  );
}
