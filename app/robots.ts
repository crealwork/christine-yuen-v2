import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ko/"],
      },
    ],
    // TODO: replace with actual production domain
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ca"}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ca",
  };
}
