import React, { Suspense } from "react";
import Script from "next/script";
import { BonusClient } from "./BonusClient";
import { BONUS_FAQS } from "@/data/financeFaqs";

export const metadata = { 
  title: "Bonus Tax Calculator India: Simulator & Timing Advisor",
  description: "Calculate your net bonus in India. Understand why TDS on your bonus is high, calculate expected refunds, and compare tax impact of March vs April payouts.",
  keywords: "bonus tax calculator india, how is bonus taxed, tds on bonus, calculate tax on bonus, is joining bonus taxable, performance bonus tax, bonus timing advisor"
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": BONUS_FAQS.map((faq) => ({
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
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Bonus Tax Simulator</h1>
          <p className="text-muted-foreground">Calculate net bonus, expected refund, and best payout timing.</p>
        </div>
        
        <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse">Loading Bonus Optimizer...</div>}>
          <BonusClient />
        </Suspense>
      </div>
    </>
  );
}
