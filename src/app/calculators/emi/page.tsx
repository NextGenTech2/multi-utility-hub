import { Metadata } from "next";
import Script from "next/script";
import { EMICalculatorClient } from "./EMICalculatorClient";
import { EMI_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "EMI Calculator: Calculate Home, Car & Personal Loan EMI | ApexToolHub",
  description: "Calculate your Equated Monthly Installment (EMI) instantly. Understand your total interest payable and amortization schedule.",
  keywords: "EMI calculator, home loan calculator, car loan EMI, personal loan EMI, loan interest calculator, finance tools",
  alternates: {
    canonical: "/calculators/emi/",
  },
};

export default function EMICalculatorPage() {
  // FinancialProduct Schema
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "EMI Calculator",
    "description": "Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans.",
    "provider": {
      "@type": "Organization",
      "name": "ApexToolHub",
      "url": "https://apextoolhub.com"
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": EMI_FAQS.map((faq) => ({
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
      <EMICalculatorClient />
    </>
  );
}
