import React from "react";
import type { Metadata } from "next";
import TakeHomeClient from "./TakeHomeClient";
import Link from "next/link";
import { Calculator, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Take Home Salary Calculator India (FY 2024-25)",
  description:
    "Calculate your exact in-hand take home salary after Income Tax, EPF, and Professional Tax deductions. Compare monthly and annual net pay.",
};

export default function TakeHomeSalaryPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Hero & Calculator Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Take Home Salary Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find out exactly how much money hits your bank account every month after Tax, PF, and Professional Tax deductions.
          </p>
        </div>
        
        <TakeHomeClient />
      </section>

      {/* SEO Rich Content Section */}
      <section className="prose prose-slate dark:prose-invert max-w-none space-y-12 border-t border-border pt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><HelpCircle className="w-6 h-6 text-emerald-500" /> CTC vs In-Hand Salary: What's the difference?</h2>
              <p>
                <strong>Cost to Company (CTC)</strong> is the total amount an employer spends on an employee in a year. However, this is rarely the amount you see in your bank account. 
              </p>
              <p>
                Your <strong>Take Home (In-Hand) Salary</strong> is derived after subtracting mandatory deductions from your CTC. These deductions primarily include:
              </p>
              <ul className="space-y-2 mt-4">
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>Income Tax (TDS):</strong> Deducted monthly based on your chosen tax regime and slab.</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>Employee Provident Fund (EPF):</strong> Usually 12% of your Basic salary, put into a retirement fund.</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>Employer Provident Fund:</strong> Often, the employer's matching 12% contribution is included in the CTC figure but is deducted before calculating your gross payout.</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>Professional Tax:</strong> A small state-level tax ranging from ₹0 to ₹200 per month.</li>
              </ul>
            </article>

            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><Calculator className="w-6 h-6 text-emerald-500" /> How is Professional Tax Calculated?</h2>
              <p>Professional tax (PT) is a tax levied by state governments on salaried individuals. It varies heavily depending on where your company is registered.</p>
              <ul className="list-none pl-0 space-y-3 mt-4">
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">MH</div>
                  <div><strong>Maharashtra:</strong> ₹200 every month, except February which is ₹300 (Total ₹2,500/year).</div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">KA</div>
                  <div><strong>Karnataka:</strong> Flat ₹200 every month for salaries above ₹25,000.</div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">DL</div>
                  <div><strong>Delhi & Haryana:</strong> ₹0. These states do not levy any Professional Tax.</div>
                </li>
              </ul>
            </article>

          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Old vs New Tax Regime</h3>
              <p className="text-sm text-muted-foreground mb-4">Your take-home salary can change significantly based on the tax regime you choose at the start of the year.</p>
              <ul className="text-sm space-y-2 font-medium">
                <li>🎯 <strong>New Regime:</strong> Lower tax rates, but NO deductions (HRA, 80C, etc).</li>
                <li>🎯 <strong>Old Regime:</strong> Higher tax rates, but allows heavy deductions to lower your taxable income.</li>
              </ul>
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                <em>* Note: Our calculator automatically recommends the regime that yields the highest take-home salary.</em>
              </div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-2">Related Calculators</h3>
              <ul className="space-y-3 text-sm mt-4">
                <li>
                  <Link href="/calculators/income-tax" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Detailed Income Tax Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/salary-hike" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Salary Hike / Appraisal Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/hra" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>HRA Exemption Calculator</span> <span>→</span>
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
        <div className="pt-8">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-foreground">Why is my actual take-home different from the calculator?</h4>
              <p className="text-muted-foreground mt-1">This calculator assumes a standard corporate salary structure (where CTC includes Employer PF). If your offer letter defines CTC without Employer PF, or if you have specific deductions like meal coupons (Sodexo), health insurance premiums, or company transport, your actual in-hand will be slightly different.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground">Does a bonus affect my monthly TDS?</h4>
              <p className="text-muted-foreground mt-1">Yes! When a bonus is declared, the income tax on that bonus is usually deducted in the specific month the bonus is paid, which can result in a much lower take-home salary for that specific month. You can simulate this using the "Advanced Options" in our calculator.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground">Is Gratuity deducted from my monthly salary?</h4>
              <p className="text-muted-foreground mt-1">Some employers include Gratuity in the CTC calculation (usually 4.81% of Basic). However, Gratuity is NOT deducted from your monthly salary. It is a deferred benefit paid out only when you leave the company after completing 5 years of continuous service.</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
