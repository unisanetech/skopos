import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomizeGuideScreen } from "@/features/documentation/customize-guide-screen";
import { customizeGuideBySlug, customizeGuides, type CustomizeGuideSlug } from "@/features/documentation/customize-content";
import { createPageMetadata, type PublicRoutePath } from "@/lib/site";

function isCustomizeGuideSlug(value: string): value is CustomizeGuideSlug {
  return Object.hasOwn(customizeGuideBySlug, value);
}

export function generateStaticParams() {
  return customizeGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isCustomizeGuideSlug(slug)) return {};
  const guide = customizeGuideBySlug[slug];
  return createPageMetadata({
    title: `${guide.label} — Skopos documentation`,
    description: guide.description,
    path: `/docs/customize/${slug}` as PublicRoutePath,
  });
}

export default async function CustomizeGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isCustomizeGuideSlug(slug)) notFound();
  return <CustomizeGuideScreen guide={customizeGuideBySlug[slug]} />;
}
