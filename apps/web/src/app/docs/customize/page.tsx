import { CustomizeOverviewScreen } from "@/features/documentation/customize-overview-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Customize Skopos for your project",
  description: "Connect the tools, rules, expertise, coding agents, and external services your project already uses.",
  path: "/docs/customize",
});

export default function CustomizePage() {
  return <CustomizeOverviewScreen />;
}
