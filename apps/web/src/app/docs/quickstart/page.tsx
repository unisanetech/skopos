import { QuickstartScreen } from "@/features/documentation/quickstart-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Quickstart",
  description: "Install Skopos, set up an existing or new repository, review project truth, and verify the first coding-agent Session.",
  path: "/docs/quickstart",
});

export default function QuickstartPage() {
  return <QuickstartScreen />;
}
