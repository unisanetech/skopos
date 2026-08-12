import { FeatureWorkflowScreen } from "@/features/documentation/feature-workflow-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Plan and finish a feature with Skopos",
  description: "Follow one coding-agent feature from discussion and Project Memory through bounded work, Evidence, Readiness, and continuation.",
  path: "/docs/workflows/plan-and-finish-feature",
});

export default function PlanAndFinishFeaturePage() {
  return <FeatureWorkflowScreen />;
}
