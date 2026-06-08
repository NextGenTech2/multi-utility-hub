import { Metadata } from "next";
import { IncomeTaxClient } from "./IncomeTaxClient";
import { INCOME_TAX_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "Income Tax Calculator (FY 2024-25): Old vs New Regime | ApexToolHub",
  description: "Compare your income tax liability under the Old vs New Tax Regimes for FY 2024-25 (AY 2025-26). Find out which tax slab saves you the most money.",
  keywords: "income tax calculator, old vs new regime, tax calculator FY 2024-25, tax saving, 80C deductions, standard deduction, income tax slab",
};

export default function IncomeTaxPage() {
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Income Tax Calculator",
    "description": "Compare Old vs New Tax Regimes to find your best tax saving strategy.",
    "provider": {
      "@type": "Organization",
      "name": "ApexToolHub",
      "url": "https://apextoolhub.com"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": INCOME_TAX_FAQS.map((faq) => ({
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
      <IncomeTaxClient />
    </>
  );
}
