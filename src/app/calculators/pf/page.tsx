import React, { Suspense } from "react";
import type { Metadata } from "next";
import EpfClient from "./EpfClient";
import Link from "next/link";
import { Calculator, HelpCircle, FileText, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "EPF Calculator & Retirement Planner India (FY 2024-25)",
  description: "Calculate EPF maturity, check EPS pension estimates, verify withdrawal rules, and project your total retirement corpus.",
  alternates: {
    canonical: "/calculators/pf/",
  },
};

export default function EpfPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Hero & Calculator Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            EPF Calculator & Retirement Planner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your EPF maturity, check EPS pension estimates, verify withdrawal rules, and project your total retirement corpus.
          </p>
        </div>
        
        <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse">Loading EPF Calculator...</div>}>
          <EpfClient />
        </Suspense>
      </section>

      {/* SEO Rich Content Section */}
      <section className="prose prose-slate dark:prose-invert max-w-none space-y-12 border-t border-border pt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><HelpCircle className="w-6 h-6 text-emerald-500" /> What is EPF and EPS?</h2>
              <p>
                The <strong>Employees' Provident Fund (EPF)</strong> is a retirement benefit scheme backed by the Government of India. Both the employee and the employer contribute a portion of the basic salary every month toward the employee's retirement corpus.
              </p>
              <p>
                While the employee's entire 12% goes directly into the EPF account, the employer's 12% is legally split into two components:
              </p>
              <ul className="space-y-2 mt-4">
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>EPS (Employees' Pension Scheme):</strong> 8.33% of the employer's contribution goes here, up to a strict maximum wage ceiling of ₹15,000. This means the maximum EPS contribution is capped at ₹1,250 per month.</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>EPF (Provident Fund):</strong> The remaining amount (3.67% or more) goes into your regular EPF account, which earns compounding interest every year.</li>
              </ul>
            </article>

            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><Calculator className="w-6 h-6 text-blue-500" /> EPF vs PPF: Which is better?</h2>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-sm text-left border border-border">
                  <thead className="bg-muted/50 font-bold">
                    <tr>
                      <th className="px-4 py-3 border-b">Feature</th>
                      <th className="px-4 py-3 border-b">EPF (Employee PF)</th>
                      <th className="px-4 py-3 border-b">PPF (Public PF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 border-b font-medium">Eligibility</td>
                      <td className="px-4 py-3 border-b">Salaried employees only</td>
                      <td className="px-4 py-3 border-b">Anyone (Salaried, Self-employed)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b font-medium">Contribution</td>
                      <td className="px-4 py-3 border-b">Employee + Employer match</td>
                      <td className="px-4 py-3 border-b">Self-contribution only</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b font-medium">Interest Rate</td>
                      <td className="px-4 py-3 border-b">~8.15% to 8.25% (Subject to change)</td>
                      <td className="px-4 py-3 border-b">~7.1% (Subject to change)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b font-medium">Lock-in Period</td>
                      <td className="px-4 py-3 border-b">Until retirement / resignation</td>
                      <td className="px-4 py-3 border-b">Strict 15 years</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 border-b font-medium">Tax Benefit</td>
                      <td className="px-4 py-3 border-b">EEE (Exempt-Exempt-Exempt)</td>
                      <td className="px-4 py-3 border-b">EEE (Exempt-Exempt-Exempt)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Transferring PF is Critical</h3>
              <p className="text-sm text-muted-foreground mb-4">When you change jobs, you have a <strong>UAN (Universal Account Number)</strong> that remains the same, but a new PF Member ID is created by your new employer.</p>
              <div className="text-sm space-y-3 font-medium">
                <div className="flex gap-2 items-start"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> <span>You MUST actively transfer your old PF to your new PF using the EPFO portal.</span></div>
                <div className="flex gap-2 items-start"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> <span>If you don't transfer, your old PF stops earning interest after 3 years and your continuous service years reset, hurting your pension eligibility.</span></div>
              </div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-2">Related Calculators</h3>
              <ul className="space-y-3 text-sm mt-4">
                <li>
                  <Link href="/calculators/take-home-salary" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Take Home Salary</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/income-tax" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Detailed Income Tax Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/gratuity" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Gratuity Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/salary-hike" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Salary Hike Calculator</span> <span>→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-foreground">Is my EPF withdrawal taxable?</h4>
                <p className="text-muted-foreground mt-1 text-sm">If you withdraw your EPF balance <strong>before completing 5 continuous years of service</strong>, the withdrawal is fully taxable in your hands, and TDS will be deducted at 10% (if PAN is linked). If you withdraw after 5 years, it is 100% tax-free.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground">Can I withdraw EPS (Pension)?</h4>
                <p className="text-muted-foreground mt-1 text-sm">You can only withdraw your EPS contribution via Form 10C if your total service is less than 9.5 years. If your service exceeds 10 years, you cannot withdraw the EPS lump sum; instead, you are mandated to receive a monthly pension after age 58.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-foreground">What happens if I stay unemployed for 2 months?</h4>
                <p className="text-muted-foreground mt-1 text-sm">Under EPFO rules, if you are unemployed for more than 1 month, you can legally withdraw 75% of your total EPF corpus. If the unemployment continues for 2 months, you can withdraw the remaining 25% and close the account.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground">What is the difference between Form 19, 10C, and 10D?</h4>
                <p className="text-muted-foreground mt-1 text-sm"><strong>Form 19:</strong> Used for final settlement of your core EPF balance.<br/><strong>Form 10C:</strong> Used to withdraw your EPS balance (if service &lt; 10 years) or get a Scheme Certificate.<br/><strong>Form 10D:</strong> Used to apply for your monthly pension after retirement.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
