import { FreshSessionScreen } from "@/features/documentation/fresh-session-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({ title: "Continue work in a fresh coding-agent Session", description: "Create, verify, deliver, and accept a Task-scoped handoff without confusing host resume, generated prompts, and real delivery.", path: "/docs/workflows/continue-fresh-session" });
export default function ContinueFreshSessionPage() { return <FreshSessionScreen />; }
