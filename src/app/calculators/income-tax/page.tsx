import { Metadata } from "next";
import { IncomeTaxClient } from "./IncomeTaxClient";
import { INCOME_TAX_FAQS } from "@/data/financeFaqs";

export const metadata: Metadata = {
  title: "Income Tax Calculator FY 2025-26: Old vs New Regime | ApexToolHub",
  description: "Free income tax calculator for FY 2024-25, FY 2025-26 & FY 2026-27. Compare Old vs New Tax Regimes, calculate TDS, optimize salary via Employer NPS, Meal Cards & Flexi benefits. Instant results.",
  keywords: "income tax calculator, income tax calculator FY 2025-26, income tax calculator FY 2026-27, old vs new regime, tax calculator India, tax saving salary, 80C deductions, standard deduction, income tax slab 2025, budget 2025 tax, HRA calculator, NPS tax saving, take home salary calculator",
};

export default function IncomeTaxPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Income Tax Calculator & Salary Optimizer",
    "url": "https://apextoolhub.com/calculators/income-tax",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "description": "Calculate your income tax for FY 2024-25, FY 2025-26 & FY 2026-27 under Old and New Tax Regimes. Optimize salary structure with employer benefits like NPS, Meal Cards, Fuel and Internet reimbursements.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "provider": {
      "@type": "Organization",
      "name": "ApexToolHub",
      "url": "https://apextoolhub.com"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ApexToolHub",
    "url": "https://apextoolhub.com",
    "logo": "https://apextoolhub.com/logo.png",
    "description": "Free online calculators, converters and developer tools for India.",
    "foundingDate": "2024",
    "areaServed": "IN"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://apextoolhub.com" },
      { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://apextoolhub.com/calculators" },
      { "@type": "ListItem", "position": 3, "name": "Income Tax Calculator", "item": "https://apextoolhub.com/calculators/income-tax" }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Income Tax in India (FY 2025-26)",
    "description": "Step-by-step guide to calculate income tax liability under Old and New Tax Regimes in India.",
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Enter Gross Annual Salary", "text": "Enter your total CTC (Cost to Company) including Basic Salary, HRA, Special Allowance, Bonus, Employer PF and Gratuity." },
      { "@type": "HowToStep", "position": 2, "name": "Subtract Employer Flexi Benefits", "text": "Remove tax-exempt employer benefits: Employer NPS (Section 80CCD(2)), Meal Card (Rule 3(7)(iii)), Internet, Fuel, and Vehicle allowances." },
      { "@type": "HowToStep", "position": 3, "name": "Apply Standard Deduction", "text": "Deduct ₹75,000 under New Regime or ₹50,000 under Old Regime as standard deduction under Section 16(ia)." },
      { "@type": "HowToStep", "position": 4, "name": "Claim Chapter VI-A Deductions (Old Regime)", "text": "Subtract 80C investments (max ₹1.5L), NPS self-contribution (80CCD(1B), max ₹50K), health insurance (80D), home loan interest (24b, max ₹2L)." },
      { "@type": "HowToStep", "position": 5, "name": "Calculate Base Tax", "text": "Apply Old or New Regime slab rates to your net taxable income to arrive at the base tax amount." },
      { "@type": "HowToStep", "position": 6, "name": "Add Surcharge if Applicable", "text": "For incomes above ₹50 Lakh, add a surcharge of 10% to 37% on the base tax." },
      { "@type": "HowToStep", "position": 7, "name": "Add Health & Education Cess", "text": "Add 4% cess on (Base Tax + Surcharge) to get total annual tax payable." },
      { "@type": "HowToStep", "position": 8, "name": "Divide by 12 for Monthly TDS", "text": "Your employer deducts Total Annual Tax ÷ 12 as TDS from your monthly salary." }
    ]
  };

  const allFaqs = [
    ...INCOME_TAX_FAQS,
    { question: "Which tax regime is better — Old or New?", answer: "For most salaried employees earning above ₹12 Lakh, the New Tax Regime offers lower rates. However, employees with heavy 80C, HRA, and home loan deductions may save more under the Old Regime. Use the calculator to compare both instantly." },
    { question: "Can I claim HRA exemption in the New Tax Regime?", answer: "No. HRA exemption under Section 10(13A) is only available in the Old Tax Regime. Under New Regime, HRA is fully taxable." },
    { question: "Is meal card / food coupon tax-exempt in the New Regime?", answer: "Yes. Meal cards are exempt up to ₹200 per meal (₹1,05,600/year) in BOTH regimes under Rule 3(7)(iii)." },
    { question: "Can Employer NPS be claimed in the New Tax Regime?", answer: "Yes. Section 80CCD(2) — Employer NPS contribution up to 14% of Basic Salary — is explicitly allowed in the New Tax Regime." },
    { question: "Can I claim internet reimbursement as a tax-free benefit?", answer: "Yes. Internet and broadband reimbursements are fully tax-exempt under Rule 3(7)(ix) in both Old and New Tax Regimes based on actual bill amounts." },
    { question: "What is the income tax slab for FY 2025-26?", answer: "Under New Regime FY 2025-26: Up to ₹3L: Nil; ₹3L-7L: 5%; ₹7L-10L: 10%; ₹10L-12L: 15%; ₹12L-15L: 20%; Above ₹15L: 30%. Rebate u/s 87A provides zero tax up to ₹12L income." },
    { question: "How is Monthly TDS calculated on salary?", answer: "Employer estimates annual tax, subtracts flexi-exemptions and declared deductions, then divides by 12 for monthly TDS deduction." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map((faq) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <IncomeTaxClient />
    </>
  );
}


