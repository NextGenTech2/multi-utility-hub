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
        <p>Most employees focus entirely on their <strong>Gross Salary (CTC)</strong>, but the way that CTC is broken down (the "salary structure") has a massive impact on the amount of income tax you pay. By optimizing your structure and allocating funds towards tax-exempt <em>Flexible Benefits</em>, you can legally reduce your taxable income.</p>
        
        <h3>Why shift out of Special Allowance?</h3>
        <p>Special Allowance is fully taxable. It is simply a balancing bucket that HR uses to round off your CTC. By requesting HR to move some of this money into tax-exempt benefits like <strong>Employer NPS</strong> or <strong>Meal Cards</strong>, you keep more of your own money.</p>
      </div>
    </>
  );
}
