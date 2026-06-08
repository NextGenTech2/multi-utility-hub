import { Metadata } from "next";
import { SIPCalculatorClient } from "./SIPCalculatorClient";
import { SIP_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "SIP Calculator: Calculate Mutual Fund Returns Online | ApexToolHub",
  description: "Calculate your Systematic Investment Plan (SIP) returns dynamically. See how much wealth you can build over time with our free SIP calculator.",
  keywords: "SIP calculator, mutual fund calculator, investment returns, rupee cost averaging, systematic investment plan, finance tools",
};

export default function SIPCalculatorPage() {
  // FinancialProduct Schema
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "SIP Calculator",
    "description": "Calculate returns on your Systematic Investment Plan (SIP) mutual funds.",
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
    "mainEntity": SIP_FAQS.map((faq) => ({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SIPCalculatorClient />
    </>
  );
}
