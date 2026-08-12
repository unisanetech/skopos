import { HeroSection } from "./sections/hero-section";
import { AgentCompatibilityStrip } from "./sections/agent-compatibility-strip";
import { ProductBoundarySection } from "./sections/product-boundary-section";
import { ProductWorkstreamSection } from "./sections/product-workstream-section";
import { PromisesSection } from "./sections/promises-section";
import { SiteShell } from "@/patterns/site/site-shell";

export function HomepageScreen() {
  return (
    <SiteShell>
      <HeroSection />
      <AgentCompatibilityStrip />
      <ProductWorkstreamSection />
      <PromisesSection />
      <ProductBoundarySection />
    </SiteShell>
  );
}
