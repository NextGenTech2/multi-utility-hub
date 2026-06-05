import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apextoolhub.com";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",            // Prevents indexing of any future backend API routes
        "/formatters/json$", // Disallows the redirect-only wrapper page (crawlers should index /formatters/json-suite directly)
        "/*?*",             // Prevents indexing of URLs with query parameters (prevents duplicate page crawling)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
