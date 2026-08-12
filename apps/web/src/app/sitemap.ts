import type { MetadataRoute } from "next";
import { publicRoutePaths, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutePaths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    changeFrequency: path === "/changelog" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/docs" ? 0.9 : 0.8,
  }));
}
