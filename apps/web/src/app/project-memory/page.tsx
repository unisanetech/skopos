import { projectMemoryCopy } from "@/features/project-memory/content";
import { ProjectMemoryScreen } from "@/features/project-memory/project-memory-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Project memory for coding agents",
  description: projectMemoryCopy.description,
  path: "/project-memory",
});

export default function ProjectMemoryPage() {
  return <ProjectMemoryScreen />;
}
