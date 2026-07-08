import React from "react";
import type { Metadata } from "next";
import GratuityClient from "./GratuityClient";
import Link from "next/link";
import { Calculator, HelpCircle, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Gratuity Calculator India | Check Eligibility & Math Breakdown",
  description: "Calculate your estimated gratuity amount, check eligibility rules, view future projections, and understand resignation scenarios.",
};

export default function GratuityPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Hero & Calculator Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Gratuity Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find out exactly how much Gratuity you've earned, check your eligibility status, and project future payouts.
          </p>
        </div>
        
        <GratuityClient />
      </section>

      {/* SEO Rich Content Section */}
      <section className="prose prose-slate dark:prose-invert max-w-none space-y-12 border-t border-border pt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><HelpCircle className="w-6 h-6 text-emerald-500" /> What is Gratuity?</h2>
              <p>
                Gratuity is a monetary benefit provided by an employer to an employee for services rendered to the organization. It is essentially a "thank you" bonus for long-term loyalty. The Payment of Gratuity Act, 1972, mandates this payment to employees who meet specific eligibility criteria.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg text-amber-800 dark:text-amber-400 text-sm my-4">
                <strong>Important Note:</strong> Gratuity is NOT deducted from your monthly salary. While some companies include it in your "CTC" breakdown (usually calculated as 4.81% of your Basic salary), it is entirely an employer contribution paid out only upon exit.
              </div>
            </article>

            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Who is Eligible for Gratuity?</h2>
              <p>To be legally eligible to receive Gratuity, an employee must satisfy the following condition:</p>
              <ul className="list-none pl-0 space-y-3 mt-4">
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">5</div>
                  <div>You must have completed <strong>5 years of continuous service</strong> with the same employer.</div>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                <em>Exceptions:</em> The 5-year rule does not apply in cases of death or disablement. In such tragic events, Gratuity is payable regardless of the tenure length.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><Calculator className="w-6 h-6 text-emerald-500" /> Difference between 15/26 and 15/30</h2>
              <p>The math changes based on whether your company is covered under the Gratuity Act:</p>
              <ul className="space-y-4 mt-4">
                <li>
                  <strong>Covered by the Act (15/26 Formula):</strong>
                  <p className="text-sm mt-1">This applies to factories, mines, ports, and most private corporate companies with 10 or more employees. You are paid for 15 days of wages for every completed year. A month is considered 26 working days (excluding 4 Sundays). <br/><em>Formula: (15 / 26) × Last Drawn Salary × Years of Service</em></p>
                </li>
                <li>
                  <strong>Not Covered by the Act (15/30 Formula):</strong>
                  <p className="text-sm mt-1">If your organization is not covered, a month is considered 30 days. <br/><em>Formula: (15 / 30) × Last Drawn Salary × Years of Service</em></p>
                </li>
              </ul>
            </article>

          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Is Gratuity Taxable?</h3>
              <p className="text-sm text-muted-foreground mb-4">The tax treatment depends on your employer type:</p>
              <ul className="text-sm space-y-3 font-medium">
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Govt Employees:</strong> 100% Tax Exempt.</span></li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Private Employees (Covered):</strong> Exempt up to a statutory limit of ₹20,00,000. Any amount above 20L is taxable as "Income from Salary".</span></li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Private Employees (Not Covered):</strong> Exempt up to ₹20,00,000 or half-month's average salary, whichever is lower.</span></li>
              </ul>
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
                    <span>Income Tax Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/salary-hike" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Salary Hike Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/pf" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>EPF Calculator</span> <span>→</span>
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
                <h4 className="font-bold text-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-500" /> Gratuity after resignation vs termination?</h4>
                <p className="text-muted-foreground mt-1 text-sm">Whether you resign voluntarily, retire, or are terminated by the company, you are entitled to your gratuity as long as you have completed 5 years of continuous service. The only exception where an employer can legally forfeit your gratuity is if you were terminated for "lawless or riotous behavior" or acts causing financial damage to the company.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground">I worked for 4 years and 8 months. Am I eligible?</h4>
                <p className="text-muted-foreground mt-1 text-sm">Under the Gratuity Act, if your company is covered, any tenure over 6 months in the final year is rounded up to a full year. Therefore, 4 years and 8 months is legally rounded up to 5 Years, making you eligible. However, some HR departments dispute this, so it is safer to complete 5 full calendar years.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-foreground">What counts as "Last Drawn Salary"?</h4>
                <p className="text-muted-foreground mt-1 text-sm">Your Last Drawn Salary for gratuity calculations includes ONLY your <strong>Basic Salary</strong> and <strong>Dearness Allowance (DA)</strong>. It specifically excludes HRA, Special Allowances, Transport Allowances, and Bonuses.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground">Can Gratuity be denied?</h4>
                <p className="text-muted-foreground mt-1 text-sm">Under Section 4(6) of the Act, gratuity can be partially or wholly forfeited if an employee is terminated for willful omission, negligence causing damage to employer property, or violent behavior. Ordinary performance-based termination does not affect gratuity.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
