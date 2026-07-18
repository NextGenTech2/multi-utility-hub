import { Metadata } from "next";
import Script from "next/script";
import { CompoundInterestClient } from "./CompoundInterestClient";
import { COMPOUND_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "Compound Interest Calculator: Grow Your Wealth | ApexToolHub",
  description: "Calculate how your money can grow over time with the power of compound interest. Adjust compounding frequencies and see the future value of your investments.",
  keywords: "compound interest calculator, interest calculator, future value calculator, APY calculator, rule of 72, investment growth",
  alternates: {
    canonical: "/calculators/compound-interest/",
  },
};

export default function CompoundInterestPage() {
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Compound Interest Calculator",
    "description": "Calculate compound interest for investments or loans with varying compounding frequencies.",
    "provider": {
      "@type": "Organization",
      "name": "ApexToolHub",
      "url": "https://apextoolhub.com"
    }
  };


  return (
    <>
      <Script id="ld-json-1"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
      />

      <CompoundInterestClient />
    </>
  );
}
