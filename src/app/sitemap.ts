import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://multiutilityhub.com";

  // List of all active routes in the workspace
  const routes = [
    "",
    "/calculators/percentage",
    "/converters/csv-to-json",
    "/converters/docx-to-pdf",
    "/converters/json-to-csv",
    "/converters/unit",
    "/converters/unix-epoch",
    "/developers/hash-generator",
    "/developers/jwt-decoder",
    "/developers/regex-tester",
    "/developers/swagger-viewer",
    "/formatters/json",
    "/formatters/json-suite",
    "/media/youtube-metadata",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/text/case-converter",
    "/text/diff-checker",
  ];

  return routes.map((route) => {
    // Standard default configurations
    let priority = 0.8;
    let changeFrequency: "daily" | "weekly" | "monthly" = "monthly";

    // Route-specific overrides
    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (
      route === "/formatters/json-suite" ||
      route === "/formatters/json" ||
      route === "/text/diff-checker" ||
      route === "/developers/jwt-decoder"
    ) {
      priority = 0.9;
    } else if (
      route === "/converters/unit" ||
      route === "/calculators/percentage" ||
      route === "/media/youtube-metadata"
    ) {
      priority = 0.7;
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}
