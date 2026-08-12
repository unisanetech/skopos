import { useCasesCopy } from "@/features/use-cases/content";
import { UseCasesScreen } from "@/features/use-cases/use-cases-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Use cases for real agent work",
  description: useCasesCopy.description,
  path: "/use-cases",
});

export default function UseCasesPage() {
  return <UseCasesScreen />;
}
