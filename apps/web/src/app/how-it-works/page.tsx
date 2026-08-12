import { productWorkflowCopy } from "@/features/product-workflow/content";
import { ProductWorkflowScreen } from "@/features/product-workflow/product-workflow-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "How Skopos works",
  description: productWorkflowCopy.description,
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return <ProductWorkflowScreen />;
}
