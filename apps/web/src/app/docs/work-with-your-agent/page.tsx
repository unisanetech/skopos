import { AgentWorkScreen } from "@/features/documentation/agent-work-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({ title: "Work with your coding agent", description: "Use Skopos through ordinary coding-agent conversations while project context, boundaries, proof, and continuation remain reliable.", path: "/docs/work-with-your-agent" });
export default function WorkWithYourAgentPage() { return <AgentWorkScreen />; }
