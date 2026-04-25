import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: replace with actual production domain (set NEXT_PUBLIC_SITE_URL env var)
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ca";
  const lastModified = new Date();
  const routes = ["", "/about", "/presales", "/value", "/contact"];
  return routes.map((route) => ({
    url: `${base}/en${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
