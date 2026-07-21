import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apextoolhub.com";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",            // Prevents indexing of any future backend API routes
        "/cdn-cgi/",        // Prevents crawlers from attempting Cloudflare email protection links
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
