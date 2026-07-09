import { Metadata } from "next";
import Script from "next/script";
import { PPFCalculatorClient } from "./PPFCalculatorClient";
import { PPF_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "PPF Calculator: Calculate Public Provident Fund Returns | ApexToolHub",
  description: "Calculate your PPF maturity value and total interest earned. Plan your long-term tax-free investments with our easy-to-use PPF calculator.",
  keywords: "PPF calculator, public provident fund, tax saving investments, section 80c, EEE tax benefit, retirement planning",
};

export default function PPFCalculatorPage() {
  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "PPF Calculator",
    "description": "Calculate maturity value and interest earned on your Public Provident Fund (PPF).",
    "provider": {
      "@type": "Organization",
      "name": "ApexToolHub",
      "url": "https://apextoolhub.com"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": PPF_FAQS.map((faq) => ({
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
      <PPFCalculatorClient />
    </>
  );
}
