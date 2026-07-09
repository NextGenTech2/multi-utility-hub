import React from "react";

interface CalculatorSchemaProps {
  name: string;
  description: string;
  url: string;
  category?: string;
}

export default function CalculatorSchema({
  name,
  description,
  url,
  category = "FinanceApplication",
}: CalculatorSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": url,
    "url": url,
    "name": name,
    "description": description,
    "applicationCategory": category,
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5/JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
