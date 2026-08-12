import { AgentSupportScreen } from "@/features/agent-support/agent-support-screen";
import { agentSupportCopy } from "@/features/agent-support/content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Supported coding agents",
  description: agentSupportCopy.description,
  path: "/agents",
});

export default function AgentsPage() {
  return <AgentSupportScreen />;
}
