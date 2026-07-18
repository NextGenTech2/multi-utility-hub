import React from "react";
import type { Metadata } from "next";
import SalaryHikeClient from "./SalaryHikeClient";
import Link from "next/link";
import { Calculator, HelpCircle, ArrowRight, Percent, IndianRupee, PieChart, Coins, Briefcase, HandCoins, Receipt, Building } from "lucide-react";

export const metadata: Metadata = {
  title: "Salary Hike Calculator India (FY 2024-25) | Calculate Increment & Take Home",
  description:
    "Calculate your new take-home salary after an appraisal or job switch. See exact tax increases, EPF deductions, and in-hand salary for the new financial year.",
  alternates: {
    canonical: "/calculators/salary-hike/",
  },
};

import Script from "next/script";

export default function SalaryHikePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Salary Hike Calculator",
        "url": "https://apextoolhub.com/calculators/salary-hike/",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "description": "Calculate your new take-home salary and tax impact after a promotion or job switch."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate a 15% salary hike?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Multiply your current salary by 1.15. For example, a ₹10,00,000 salary with a 15% hike becomes ₹11,50,000."
            }
          },
          {
            "@type": "Question",
            "name": "Does a salary hike increase income tax?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, a higher salary increases your taxable income. However, due to marginal taxation, your take-home pay will always increase even if you enter a higher tax slab. You never 'lose money' by getting a raise."
            }
          },
          {
            "@type": "Question",
            "name": "Is a bonus better than a salary hike?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A salary hike permanently increases your base pay and compounds over time (affecting future hikes and EPF), whereas a bonus is a one-time taxable event."
            }
          },
          {
            "@type": "Question",
            "name": "How much hike is good during an annual appraisal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In India, average annual appraisals range from 5% to 12%. Top performers often see 12% to 20% increases depending on the industry."
            }
          },
          {
            "@type": "Question",
            "name": "How much salary hike should I expect after a promotion?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Internal promotions usually yield a 20% to 35% hike to align you with the new role's market baseline."
            }
          },
          {
            "@type": "Question",
            "name": "Is a 30% hike realistic during a job switch?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, 30% is a standard baseline expectation for switching jobs in the Indian corporate sector, though highly specialized roles can command 50% to 70% hikes."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="salary-hike-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Salary Hike Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your new take-home salary and tax impact after a promotion or job switch.
          </p>
        </div>
        
        <SalaryHikeClient />

        <div className="prose prose-emerald dark:prose-invert max-w-4xl mx-auto pt-16">
          <h2>What is a Salary Hike Calculator?</h2>
          <p>
            A salary hike calculator is an essential tool for Indian professionals to project their future earnings. Whether you are expecting a standard <strong>percentage hike</strong> during your annual appraisal, receiving a <strong>flat amount hike</strong>, navigating a <strong>promotion</strong>, or negotiating a <strong>job switch salary increase</strong>, this tool instantly breaks down your new CTC. More importantly, it shows you how your <em>in-hand</em> salary and tax liabilities will change so you aren't surprised when the new payslip arrives.
          </p>

          <h2>How is Salary Hike Calculated?</h2>
          <p>The math behind a standard percentage hike is straightforward. You simply multiply your current salary by 1 plus the hike percentage.</p>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm my-6 border border-border">
            <strong>Formula:</strong> New Salary = Current Salary × (1 + Hike%)<br/><br/>
            <strong>Example:</strong><br/>
            Current Salary = ₹12,00,000<br/>
            Hike = 20%<br/>
            New Salary = 12,00,000 × 1.20 = ₹14,40,000
          </div>

          <h2>Salary Hike Percentage Table</h2>
          <p>Here is a quick reference guide showing standard hike trajectories for different salary brackets:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-3 border-b">Current CTC</th>
                  <th className="p-3 border-b text-emerald-600">10% Hike</th>
                  <th className="p-3 border-b text-emerald-600">20% Hike</th>
                  <th className="p-3 border-b text-emerald-600">30% Hike</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-3 border-b">₹5,00,000</td><td className="p-3 border-b">₹5,50,000</td><td className="p-3 border-b">₹6,00,000</td><td className="p-3 border-b">₹6,50,000</td></tr>
                <tr><td className="p-3 border-b">₹10,00,000</td><td className="p-3 border-b">₹11,00,000</td><td className="p-3 border-b">₹12,00,000</td><td className="p-3 border-b">₹13,00,000</td></tr>
                <tr><td className="p-3 border-b">₹15,00,000</td><td className="p-3 border-b">₹16,50,000</td><td className="p-3 border-b">₹18,00,000</td><td className="p-3 border-b">₹19,50,000</td></tr>
                <tr><td className="p-3 border-b">₹20,00,000</td><td className="p-3 border-b">₹22,00,000</td><td className="p-3 border-b">₹24,00,000</td><td className="p-3 border-b">₹26,00,000</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Does a Higher Salary Mean Higher Tax?</h2>
          <p>
            Yes, but <strong>you never lose money by taking a raise.</strong> Because India uses a <em>marginal taxation</em> system, you only pay higher tax rates on the income that exceeds the specific tax slab. If a hike pushes you from the 20% slab into the 30% slab, only the amount above ₹15L is taxed at 30%. Your net take-home salary will always increase.
          </p>

          <h2>Appraisal vs Promotion vs Job Switch</h2>
          <p>
            Understanding the context of your hike is crucial:
          </p>
          <ul>
            <li><strong>Annual Appraisal:</strong> Standard yearly increments to combat inflation and reward steady performance.</li>
            <li><strong>Promotion:</strong> A significant jump accompanied by a title change and increased responsibilities.</li>
            <li><strong>Job Switch:</strong> The most aggressive salary growth vector, where external market rates reset your baseline.</li>
          </ul>

          <h2>How Much Salary Hike Should You Ask For?</h2>
          <p>Industry benchmarks for salary negotiations typically fall into these ranges:</p>
          <ul>
            <li><strong>Annual appraisal (Average):</strong> 5–12%</li>
            <li><strong>Annual appraisal (Top Performer):</strong> 12–20%</li>
            <li><strong>Promotion:</strong> 20–35%</li>
            <li><strong>Job switch:</strong> 30–70%</li>
          </ul>

          <h2>Salary Hike and EPF</h2>
          <p>
            A higher basic salary automatically triggers higher contributions to your Employees' Provident Fund (EPF). While this reduces your immediate monthly take-home slightly more than you might expect, it results in a massively compounded retirement corpus. Higher base pay also increases your eventual Gratuity payout and NPS contributions.
          </p>

          <hr className="my-12" />

          <h2>Frequently Asked Questions</h2>
          
          <div className="space-y-6 mt-8">
            <div>
              <h4 className="font-bold text-lg">How do I calculate a 15% salary hike?</h4>
              <p className="text-muted-foreground">Multiply your current salary by 1.15. For example, a ₹10,00,000 salary with a 15% hike becomes ₹11,50,000.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">Does a salary hike increase income tax?</h4>
              <p className="text-muted-foreground">Yes, a higher salary increases your taxable income. However, due to marginal taxation, your take-home pay will always increase even if you enter a higher tax slab.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">Is a bonus better than a salary hike?</h4>
              <p className="text-muted-foreground">A salary hike permanently increases your base pay and compounds over time (affecting future hikes and EPF), whereas a bonus is a one-time taxable event.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">How much hike is good during appraisal?</h4>
              <p className="text-muted-foreground">In India, average annual appraisals range from 5% to 12%. Top performers often see 12% to 20% increases depending on the industry.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">How much salary hike should I expect after promotion?</h4>
              <p className="text-muted-foreground">Internal promotions usually yield a 20% to 35% hike to align you with the new role's market baseline.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">Is a 30% hike realistic?</h4>
              <p className="text-muted-foreground">Yes, 30% is a standard baseline expectation for switching jobs in the Indian corporate sector, though highly specialized roles can command 50% to 70% hikes.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-border/50 pt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Explore Related Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/calculators/take-home-salary/" className="flex flex-col items-center p-6 border border-border rounded-xl hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-center group">
              <HandCoins className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Take Home Salary</h3>
              <p className="text-xs text-muted-foreground">Calculate exact in-hand pay</p>
            </Link>
            <Link href="/calculators/income-tax/" className="flex flex-col items-center p-6 border border-border rounded-xl hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all text-center group">
              <Receipt className="w-8 h-8 text-rose-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Income Tax</h3>
              <p className="text-xs text-muted-foreground">Old vs New Regime planning</p>
            </Link>
            <Link href="/calculators/salary-optimizer/" className="flex flex-col items-center p-6 border border-border rounded-xl hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all text-center group">
              <PieChart className="w-8 h-8 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Salary Restructuring</h3>
              <p className="text-xs text-muted-foreground">Optimize flexi benefits</p>
            </Link>
            <Link href="/calculators/pf/" className="flex flex-col items-center p-6 border border-border rounded-xl hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all text-center group">
              <Building className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">EPF Calculator</h3>
              <p className="text-xs text-muted-foreground">Project retirement corpus</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
