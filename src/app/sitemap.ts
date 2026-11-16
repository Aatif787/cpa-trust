import type { MetadataRoute } from "next";
import { SITE_ROUTES } from "@/data/navigation";
import { absoluteUrl } from "@/lib/seo";

const ROUTE_PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/about": 0.9,
  "/focus-areas": 0.9,
  "/initiatives": 0.85,
  "/governance": 0.85,
  "/impact": 0.85,
  "/contact": 0.8,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITE_ROUTES.map((route) => ({
    url: absoluteUrl(route.href),
    lastModified,
    changeFrequency: route.href === "/" ? "weekly" : "monthly",
    priority: ROUTE_PRIORITY[route.href] ?? 0.7,
  }));
}
