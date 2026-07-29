import React from "react";
import type { Metadata } from "next";
import HraClient from "./HraClient";
import Link from "next/link";
import { Calculator, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { 
  title: "HRA Exemption Calculator | Tax Saving on Rent Paid",
  description: "Calculate your House Rent Allowance (HRA) exemption and find out exactly how much tax you save based on your rent paid, basic salary, and city type.",
  alternates: {
    canonical: "/calculators/hra/",
  },
};

export default function HraPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Hero & Calculator Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            HRA Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your exact House Rent Allowance (HRA) exemption and see which rule limits your tax savings.
          </p>
        </div>
        
        <HraClient />
      </section>

      {/* SEO Rich Content Section */}
      <section className="prose prose-slate dark:prose-invert max-w-none space-y-12 border-t border-border pt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><HelpCircle className="w-6 h-6 text-emerald-500" /> What is HRA?</h2>
              <p>
                House Rent Allowance (HRA) is a salary component paid by employers to employees to meet accommodation expenses. Under Section 10(13A) of the Income Tax Act, 1961, salaried individuals can claim an exemption on HRA if they live in rented accommodation. 
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg text-amber-800 dark:text-amber-400 text-sm my-4">
                <strong>Crucial Note:</strong> HRA exemption is <strong>ONLY</strong> available if you opt for the Old Tax Regime. Under the New Tax Regime, HRA exemption is completely disallowed, regardless of how much rent you pay.
              </div>
            </article>

            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><Calculator className="w-6 h-6 text-emerald-500" /> The HRA Exemption Formula</h2>
              <p>The tax-exempt portion of your HRA is calculated as the <strong>minimum of the following three conditions</strong>:</p>
              <ul className="list-none pl-0 space-y-3 mt-4">
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                  <div><strong>Actual HRA Received</strong> from your employer.</div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                  <div><strong>Rent Paid minus 10% of Basic Salary</strong> (including DA if applicable).</div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="bg-foreground text-background w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <div><strong>50% of Basic Salary</strong> (if you live in a Metro city) OR <strong>40% of Basic Salary</strong> (if you live in a Non-Metro city).</div>
                </li>
              </ul>
            </article>

            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2"><FileText className="w-6 h-6 text-emerald-500" /> Required Documents for HRA</h2>
              <p>To claim your HRA exemption during your investment declaration or ITR filing, you need:</p>
              <ul className="space-y-2 mt-4">
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> Valid Rent Agreement between you and the landlord.</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> Monthly Rent Receipts (at least for the first and last month).</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> <strong>Landlord's PAN Card:</strong> Mandatory if your annual rent exceeds ₹1,00,000 (i.e., more than ₹8,333 per month).</li>
                <li><CheckCircle2 className="inline w-4 h-4 text-emerald-500 mr-2" /> Proof of payment (bank transfers are preferred over cash to avoid scrutiny).</li>
              </ul>
            </article>

          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Metro vs Non-Metro Rules</h3>
              <p className="text-sm text-muted-foreground mb-4">For Income Tax purposes, ONLY the following 4 cities are considered "Metro" (eligible for 50% Basic):</p>
              <ul className="text-sm space-y-2 font-medium">
                <li>🏢 New Delhi</li>
                <li>🏢 Mumbai (Bombay)</li>
                <li>🏢 Kolkata (Calcutta)</li>
                <li>🏢 Chennai (Madras)</li>
              </ul>
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                <em>* Note: Major IT hubs like Bangalore, Pune, and Hyderabad are classified as <strong>Non-Metro</strong> (40% rule) for HRA calculations.</em>
              </div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-2">Related Calculators</h3>
              <ul className="space-y-3 text-sm mt-4">
                <li>
                  <Link href="/calculators/income-tax/" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Income Tax Calculator</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/take-home-salary/" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Take Home Salary</span> <span>→</span>
                  </Link>
                </li>
                <li>
                  <Link href="/calculators/salary-hike/" className="text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between">
                    <span>Salary Hike Calculator</span> <span>→</span>
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
              <h4 className="font-bold text-foreground">Can I pay rent to my wife and claim HRA?</h4>
              <p className="text-muted-foreground mt-1">Legally, husband and wife are considered a single unit for tax purposes. Paying rent to a spouse to claim HRA is heavily scrutinized by the Income Tax Department and often rejected. It is generally not advised.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground">Can I claim HRA for rent paid to my parents?</h4>
              <p className="text-muted-foreground mt-1">Yes! You can claim HRA by paying rent to your parents, provided the property is owned by them. You must transfer the rent to their bank account and they must declare this rental income in their own ITR. This is a highly effective way to save tax if your parents fall in a lower tax slab than you.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground">I own a home in another city, but live on rent. Can I claim HRA?</h4>
              <p className="text-muted-foreground mt-1">Yes. If you own a house in City A (and are paying a home loan EMI) but work and live on rent in City B, you can claim both HRA exemption and Home Loan interest deduction (Section 24) simultaneously.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground">Can my HRA exemption exceed my rent paid?</h4>
              <p className="text-muted-foreground mt-1">No. The formula mathematically caps your exemption. Under Rule 2, the exemption is calculated as (Rent Paid - 10% of Basic). Because of the subtraction, your exemption will always be strictly less than the actual rent you paid.</p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
