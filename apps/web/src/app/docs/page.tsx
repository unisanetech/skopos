import { docsLandingCopy } from "@/features/documentation/content";
import { DocsLandingScreen } from "@/features/documentation/docs-landing-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Documentation and prompting guides",
  description: docsLandingCopy.description,
  path: "/docs",
});

export default function DocsPage() {
  return <DocsLandingScreen />;
}
