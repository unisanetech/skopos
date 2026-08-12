import { trustControlCopy } from "@/features/trust-control/content";
import { TrustControlScreen } from "@/features/trust-control/trust-control-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Trust, scope, and evidence",
  description: trustControlCopy.description,
  path: "/trust",
});

export default function TrustPage() {
  return <TrustControlScreen />;
}
