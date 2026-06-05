import React from "react";

interface SchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory: "DeveloperApplication" | "UtilityApplication" | "DesignApplication" | "MultimediaApplication";
}

export function SoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory,
}: SchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": applicationCategory,
    "operatingSystem": "Windows, macOS, Linux, Android, iOS",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
