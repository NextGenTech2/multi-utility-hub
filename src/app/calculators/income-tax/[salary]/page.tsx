import { Metadata } from "next";
import React, { Suspense } from "react";
import Script from "next/script";
import { IncomeTaxClient } from "../IncomeTaxClient";

interface Props {
  params: Promise<{ salary: string }>;
}

export async function generateStaticParams() {
  const popularSalaries = [
    "5-lakh", "7-lakh", "10-lakh", "12-lakh", "15-lakh", 
    "18-lakh", "20-lakh", "25-lakh", "30-lakh", "40-lakh", 
    "50-lakh", "75-lakh", "1-crore", "1-cr"
  ];
  return popularSalaries.map((salary) => ({ salary }));
}

function parseSalaryParam(salaryParam: string) {
  const decoded = decodeURIComponent(salaryParam).toLowerCase();
  
  let numericValue = 1200000;
  let displayString = "";

  if (decoded.includes("lakh")) {
    const numPart = parseFloat(decoded.replace(/[^0-9.]/g, ""));
    if (!isNaN(numPart)) {
      numericValue = numPart * 100000;
      displayString = `${numPart} Lakh`;
    }
  } else if (decoded.includes("crore") || decoded.includes("cr")) {
    const numPart = parseFloat(decoded.replace(/[^0-9.]/g, ""));
    if (!isNaN(numPart)) {
      numericValue = numPart * 10000000;
      displayString = `${numPart} Crore`;
    }
  } else {
    const rawNum = parseInt(decoded.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(rawNum)) {
      numericValue = rawNum;
      displayString = new Intl.NumberFormat('en-IN').format(rawNum);
    }
  }

  return { numericValue, displayString };
}

function generateScenarioContent(numericValue: number, displayString: string) {
  const isHighIncome = numericValue >= 3000000;
  const isTaxFree = numericValue <= 700000;
  
  let intro = `Wondering how much tax you'll pay on a ₹${displayString} salary? Use our pre-filled calculator to instantly compare your tax liability under the Old and New tax regimes for FY 2025-26.`;
  
  if (isHighIncome) {
    intro = `Tax planning becomes critical when your salary reaches ₹${displayString}. At this income bracket, optimizing your salary structure and utilizing employer benefits can save you lakhs in taxes. Use our pre-filled ₹${displayString} tax calculator to compare the Old vs New regime and find the most tax-efficient structure.`;
  } else if (isTaxFree) {
    intro = `Great news! A salary of ₹${displayString} can be completely tax-free under the New Tax Regime due to the Section 87A rebate. Use our pre-filled ₹${displayString} calculator to verify your zero-tax liability for FY 2025-26.`;
  }

  const faqs = [
    {
      question: `How much tax will I pay on a ₹${displayString} salary?`,
      answer: `The exact tax on a ₹${displayString} salary depends on your chosen tax regime. Under the New Tax Regime (FY 2025-26), you can check the pre-calculated breakdown above. ${isTaxFree ? 'For this bracket, your tax liability is generally zero due to rebates.' : 'Typically, the New Regime offers lower taxes for this bracket unless you have significant deductions like HRA and Home Loan interest.'}`
    },
    {
      question: `What is the monthly take-home salary for ₹${displayString}?`,
      answer: `To calculate the in-hand salary for ₹${displayString}, the calculator subtracts the applicable income tax, EPF contributions, and professional tax from your gross amount and divides the remainder by 12. You can see your exact monthly take-home in the results panel.`
    },
    {
      question: `Should I choose the Old or New tax regime for ₹${displayString} CTC?`,
      answer: `For a CTC of ₹${displayString}, ${isTaxFree ? 'both regimes might result in zero tax, but the New Regime requires zero paperwork.' : 'the New Regime is generally the default choice due to lower slab rates. However, if you claim maximum 80C deductions, health insurance, and a substantial HRA or Home Loan interest, the Old Regime might still save you more.'} The calculator above instantly compares both side-by-side.`
    },
    {
      question: `Can I save tax on ₹${displayString} salary using Employer NPS?`,
      answer: `Yes! Employer NPS (Section 80CCD(2)) is one of the few deductions available in BOTH the Old and New tax regimes. By routing up to 14% of your basic salary through your employer to NPS, you can significantly reduce the taxable portion of your ₹${displayString} income.`
    }
  ];

  return { intro, faqs };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salary } = await params;
  const { displayString } = parseSalaryParam(salary);
  
  return {
    title: `Income Tax Calculator for ₹${displayString} Salary (FY 2025-26)`,
    description: `Calculate exactly how much income tax you will pay on a ₹${displayString} salary in India. Compare Old vs New Tax Regimes instantly to maximize your take-home pay.`,
    keywords: `income tax on ${displayString}, tax on ${displayString} salary, ${displayString} tax calculation, new regime tax on ${displayString}, old regime tax on ${displayString}, monthly take home for ${displayString}`,
  };
}

export default async function IncomeTaxScenarioPage({ params }: Props) {
  const { salary } = await params;
  const { numericValue, displayString } = parseSalaryParam(salary);
  const { intro, faqs } = generateScenarioContent(numericValue, displayString);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `Income Tax Calculator for ₹${displayString} Salary`,
    "url": `https://apextoolhub.com/calculators/income-tax/${salary}`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": `Calculate your income tax for a ₹${displayString} salary under Old and New Tax Regimes.`,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://apextoolhub.com" },
      { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://apextoolhub.com/calculators" },
      { "@type": "ListItem", "position": 3, "name": "Income Tax", "item": "https://apextoolhub.com/calculators/income-tax" },
      { "@type": "ListItem", "position": 4, "name": `₹${displayString} Salary`, "item": `https://apextoolhub.com/calculators/income-tax/${salary}` }
    ]
  };

  return (
    <>
      <Script id={`ld-json-webapp-${salary}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <Script id={`ld-json-breadcrumb-${salary}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse">Loading Income Tax Scenario...</div>}>
        <IncomeTaxClient 
          initialSalary={numericValue}
          scenarioTitle={`Income Tax on ₹${displayString} Salary`}
          scenarioDescription={intro}
          customFaqs={faqs}
        />
      </Suspense>
    </>
  );
}
