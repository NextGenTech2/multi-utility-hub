import { Metadata } from "next";
import React, { Suspense } from "react";
import Script from "next/script";
import SalaryOptimizerClient from "./SalaryOptimizerClient";

export const metadata: Metadata = {
  title: "Salary Restructuring & Optimization Calculator | ApexToolHub",
  description: "Free Salary Restructuring and CTC Optimization Calculator. Act as your own HR Compensation Advisor to optimize your CTC, maximize flexi benefits, and increase take-home salary.",
  keywords: "salary restructuring calculator, salary optimization calculator, flexible benefits calculator, CTC optimization calculator, employer NPS tax benefit, meal card tax benefit, flexi basket calculator",
};

export default function SalaryOptimizerPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Salary Restructuring Optimizer",
    "url": "https://apextoolhub.com/calculators/salary-optimizer",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": "Restructure your CTC and maximize flexible benefits like Employer NPS, Meal Cards, and Fuel reimbursements to increase your take-home salary.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://apextoolhub.com" },
      { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://apextoolhub.com/calculators" },
      { "@type": "ListItem", "position": 3, "name": "Salary Restructuring Optimizer", "item": "https://apextoolhub.com/calculators/salary-optimizer" }
    ]
  };

  return (
    <>
      <Script
        id="webapp-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Salary Restructuring Optimizer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Be your own HR Compensation Advisor. Shift your taxable allowances into tax-free flexible benefits and instantly increase your take-home salary.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center bg-card rounded-xl shadow-sm border border-border"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>}>
          <SalaryOptimizerClient />
        </Suspense>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-emerald dark:prose-invert print:hidden">
        <h2>What is Salary Restructuring?</h2>
        <p>Most employees focus entirely on their <strong>Gross Salary (CTC)</strong>, but the way that CTC is broken down (the "salary breakup") has a massive impact on the amount of income tax you pay. By optimizing your structure and allocating funds towards tax-exempt <em>Flexible Benefits</em>, you can legally reduce your taxable income. This makes the <strong>salary restructuring calculator</strong> an essential tool for maximizing your take-home pay.</p>
        
        <h3>The Power of Flexi Benefits</h3>
        <p>Many modern employers in India offer a "Flexi Basket" or "FBP" (Flexible Benefit Plan) as part of the CTC. Instead of receiving a highly taxable "Special Allowance", you can opt to receive tax-free reimbursements for expenses you already incur. Using a <strong>flexi benefits calculator</strong> helps you pinpoint exactly how much you can save.</p>
        
        <ul>
          <li><strong>Employer NPS (National Pension System):</strong> Corporate NPS contributions (up to 10% of Basic) are completely tax-free under Section 80CCD(2), over and above the standard 80C and 80CCD(1B) limits. Our <strong>employer NPS calculator</strong> automatically factors this in.</li>
          <li><strong>Food & Meal Cards:</strong> Often provided via Sodexo or Pluxee, meal cards offer up to ₹2,200 per month (₹26,400 annually) in tax-free allowances. The <strong>meal card tax benefit</strong> alone can save you thousands in taxes.</li>
          <li><strong>Internet & Telephone:</strong> Reimbursements for broadband and mobile bills are generally fully tax-exempt when supported by actual bills.</li>
          <li><strong>Fuel & Car Maintenance:</strong> If you own a car, opting for fuel and maintenance reimbursements can result in significant tax savings compared to a standard taxable allowance.</li>
        </ul>

        <h3>How to Increase Take Home Salary</h3>
        <p>If you've recently received a hike and are wondering <strong>how to increase take home salary</strong>, or if you're planning a <strong>salary restructuring after appraisal</strong>, you must evaluate your tax bracket. High earners in the 30% tax bracket get the maximum absolute benefit from salary optimization. For example, moving ₹1,00,000 from Special Allowance to Employer NPS instantly saves ₹30,000 in income tax.</p>

        <p>Use this <strong>salary optimization calculator</strong> as your personal HR advisor. Discuss the <em>Salary Restructuring Proposal</em> generated above with your payroll or HR department during your next appraisal cycle to ensure your structure is optimized for tax efficiency.</p>
      </div>
    </>
  );
}
