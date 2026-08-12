import { changelogPage } from "@/features/public-pages/public-page-content";
import { PublicPageScreen } from "@/features/public-pages/public-page-screen";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Changelog and release readiness",
  description: changelogPage.description,
  path: "/changelog",
});

export default function ChangelogPage() {
  return <PublicPageScreen content={changelogPage} />;
}
