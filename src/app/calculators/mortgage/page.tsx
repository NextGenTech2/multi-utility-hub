import Script from "next/script";
import { Metadata } from "next";
import { MortgageClient } from "./MortgageClient";
import { MORTGAGE_FAQS, HOME_LOAN_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "Mortgage & Home Loan Calculator | ApexToolHub",
  description: "Calculate your true monthly mortgage payment including taxes, insurance, HOA fees, and PMI. A complete home affordability calculator.",
  keywords: "mortgage calculator, home loan calculator, PMI calculator, mortgage payoff, real estate calculator, amortization",
  alternates: {
    canonical: "/calculators/mortgage/",
  },
};

export default function MortgagePage() {
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Mortgage & Home Loan Calculator",
    "description": "Calculate monthly mortgage and home loan EMI payments including property tax, PMI, and home insurance.",
    "provider": {
      "@type": "Organization",
      "name": "ApexToolHub",
      "url": "https://apextoolhub.com/"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...MORTGAGE_FAQS, ...HOME_LOAN_FAQS].map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Script id="ld-json-1"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
      />
      <Script id="ld-json-2"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MortgageClient />
    </>
  );
}
