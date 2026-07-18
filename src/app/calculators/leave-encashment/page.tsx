import React from "react";
import type { Metadata } from "next";
import LeaveEncashmentClient from "./LeaveEncashmentClient";
import Link from "next/link";
import { 
  Calculator, HelpCircle, FileText, CheckCircle2, AlertTriangle, 
  TrendingUp, Clock, Info, ShieldAlert, Award, ArrowRight
} from "lucide-react";
import { LEAVE_ENCASHMENT_FAQS } from "@/data/financeFaqs";

// Reusable SEO Schemas
import CalculatorSchema from "@/components/seo/CalculatorSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
import HowToSchema from "@/components/seo/HowToSchema";
import ArticleSchema from "@/components/seo/ArticleSchema";

export const metadata: Metadata = {
  title: "Leave Encashment Calculator India (FY 2026-27) | Tax Exemption & Formula",
  description: "Calculate your leave encashment instantly. Know tax exemption under Section 10(10AA), retirement rules, private vs government employee benefits, and taxable amount.",
  openGraph: {
    title: "Leave Encashment Calculator India (FY 2026-27) | Tax Exemption & Formula",
    description: "Calculate your leave encashment instantly. Know tax exemption under Section 10(10AA), retirement rules, private vs government employee benefits, and taxable amount.",
    url: "https://apextoolhub.com/calculators/leave-encashment/",
  },
  alternates: {
    canonical: "/calculators/leave-encashment/",
  },
};

export default function LeaveEncashmentPage() {
  const pageUrl = "https://apextoolhub.com/calculators/leave-encashment/";

  const breadcrumbs = [
    { name: "Home", url: "https://apextoolhub.com/" },
    { name: "Calculators", url: "https://apextoolhub.com/calculators/income-tax/" },
    { name: "Leave Encashment", url: pageUrl }
  ];

  const howToSteps = [
    {
      name: "Determine Monthly Wages",
      text: "Calculate your last drawn monthly salary, which consists only of Basic Salary + Dearness Allowance (DA). Exclude all other allowances like HRA, LTA, or bonuses."
    },
    {
      name: "Find Daily Wages Rate",
      text: "Divide your monthly wages (Basic + DA) by 30 to determine your daily rate of salary."
    },
    {
      name: "Assess Eligible Earned Leaves",
      text: "Look up your unavailed earned leave balance. Ensure it does not exceed the statutory limit of 30 days of leave for each completed year of service."
    },
    {
      name: "Apply Exemption Rules",
      text: "For government employees, the amount is 100% tax-free. For private/PSU employees, apply Section 10(10AA) to find the tax-free portion (capped at ₹25 Lakhs)."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* 1. Schemas */}
      <CalculatorSchema 
        name="Leave Encashment Calculator India (FY 2026-27)"
        description="Calculate your gross leave encashment, tax exemption under Section 10(10AA), taxable portion, and estimated income tax."
        url={pageUrl}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={LEAVE_ENCASHMENT_FAQS} />
      <HowToSchema 
        name="How to Calculate Leave Encashment and Tax Exemptions"
        description="Follow this simple step-by-step guide to compute your gross leave encashment and determine Section 10(10AA) tax exemptions."
        steps={howToSteps}
      />
      <ArticleSchema 
        headline="Leave Encashment Calculator India (FY 2026-27) | Tax Exemption & Formula"
        description="A complete guide to understanding leave encashment calculations, formulas, tax rules under Section 10(10AA), and slab rates in India."
        datePublished="2026-01-01T00:00:00Z"
        dateModified="2026-07-09T00:00:00Z"
        author="ApexToolHub Editorial Team"
        url={pageUrl}
      />

      {/* 2. Hero & Header */}
      <section className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Leave Encashment Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Calculate your leave encashment payout, tax exemptions under Section 10(10AA), and net received amount instantly.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {[
              "Government Employees",
              "Private Employees",
              "Retirement Payouts",
              "Resignation / Exits",
              "Section 10(10AA) Exemption"
            ].map((badge, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-muted/40 border border-border text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {badge}
              </span>
            ))}
          </div>
        </div>
        
        {/* Interactive Client Component */}
        <LeaveEncashmentClient />
      </section>

      {/* 3. Educational Content (SEO focus) */}
      <section className="prose prose-slate dark:prose-invert max-w-none space-y-12 border-t border-border pt-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-8">
            
            {/* Section A: What is Leave Encashment */}
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                <HelpCircle className="w-6 h-6 text-indigo-500" /> What is Leave Encashment?
              </h2>
              <p className="mt-4">
                Leave encashment refers to the process by which an employee receives financial compensation in exchange for their accumulated, unused earned leaves (also called privilege leaves) from their employer.
              </p>
              <p>
                In most corporate and government organizations, employees are allocated a certain number of paid leaves every year. If these leaves are not taken, they can either carry forward to the next year or be encashed. The rules governing the accumulation and payment of these leaves depend heavily on company HR policies and the Indian labor laws.
              </p>
              
              <div className="bg-muted/30 border border-border p-4 rounded-xl text-sm my-4 flex gap-3 items-start">
                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Only Earned Leaves can be Encashed:</strong> In India, you can only encash Earned Leaves (EL) or Privilege Leaves (PL). Casual Leaves (CL) and Sick Leaves (SL) cannot be carried forward or encashed and will lapse at the end of every calendar year.
                </div>
              </div>
            </article>

            {/* Section B: Formulas */}
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                <Calculator className="w-6 h-6 text-indigo-500" /> Leave Encashment Formula
              </h2>
              <p className="mt-4">
                The standard formula to calculate gross leave encashment in India is based on daily salary wages:
              </p>
              <div className="bg-muted/50 p-5 rounded-xl border border-border font-mono text-sm space-y-2 text-center my-4">
                <div className="text-xs text-muted-foreground">Standard Formula</div>
                <div className="text-base md:text-lg font-black text-foreground">
                  Leave Encashment = (Monthly Basic + DA) / 30 × Leaves Encashed
                </div>
              </div>
              <p>
                Where:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Monthly Basic:</strong> The basic salary component of your wages.</li>
                <li><strong>Dearness Allowance (DA):</strong> Cost-of-living adjustment allowance, standard in government and PSU sectors.</li>
                <li><strong>Leaves Encashed:</strong> The number of unavailed earned leaves being encashed at exit.</li>
              </ul>
            </article>

            {/* Section C: How is it Calculated */}
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                <FileText className="w-6 h-6 text-indigo-500" /> How is Leave Encashment Calculated? (Worked Example)
              </h2>
              <p className="mt-4">
                Let's understand this with a concrete, real-world example:
              </p>
              <p>
                Suppose an employee working in a private firm resigns after 10 years of service. Their details are:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-4">
                <li>Monthly Basic Salary: <strong>₹80,000</strong></li>
                <li>Dearness Allowance (DA): <strong>₹0</strong></li>
                <li>Earned Leave Balance: <strong>120 Days</strong></li>
                <li>Leave Availed over career: <strong>30 Days</strong></li>
                <li>Employer Policy cap: <strong>30 Days / Year</strong></li>
              </ul>
              
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-sm border-collapse text-left">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border font-bold">
                      <th className="p-3">Step Description</th>
                      <th className="p-3 text-right">Calculation</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/40">
                      <td className="p-3 font-medium">1. Calculate Monthly Wages</td>
                      <td className="p-3 text-right">₹80,000 + ₹0</td>
                      <td className="p-3 text-right font-mono font-semibold">₹80,000</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="p-3 font-medium">2. Calculate Daily Wage Rate</td>
                      <td className="p-3 text-right">₹80,000 / 30</td>
                      <td className="p-3 text-right font-mono font-semibold">₹2,667 / day</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="p-3 font-medium">3. Calculate Gross Encashment</td>
                      <td className="p-3 text-right">₹2,667 × 120 Days</td>
                      <td className="p-3 text-right font-mono font-bold text-indigo-500">₹3,20,040</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* Section D: Section 10(10AA) Exemption */}
            <article>
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                <Award className="w-6 h-6 text-indigo-500" /> Section 10(10AA) Tax Exemption Explained
              </h2>
              <p className="mt-4">
                Under Section 10(10AA) of the Income Tax Act, leave encashment received at the time of retirement or resignation is partially exempt from tax for non-government employees.
              </p>
              <p>
                The tax exemption is limited to the <strong>least</strong> of the following four amounts:
              </p>
              <ol className="list-decimal pl-5 space-y-3">
                <li><strong>Actual Leave Encashment Received:</strong> The gross payout calculated based on your balance.</li>
                <li><strong>Cash Equivalent:</strong> Capped at 30 days of leaves for every year of completed service minus leaves already availed.</li>
                <li><strong>10 Months' Average Salary:</strong> 10 multiplied by the average basic + DA drawn over the last 10 months.</li>
                <li><strong>Statutory Government Limit:</strong> Capped at <strong>₹25,00,000</strong> (increased from ₹3,00,000 effective 1 April 2023).</li>
              </ol>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-sm mt-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  <strong>Active Service Encashment:</strong> If you encash your leaves during active service (i.e., while continuing your job), the entire amount is fully taxable under your marginal slab rate for all employee types, including government officials.
                </p>
              </div>
            </article>

            {/* Section E: Visual Timeline */}
            <article className="hidden md:block">
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
                <Clock className="w-6 h-6 text-indigo-500" /> Leave Encashment Lifecycle Timeline
              </h2>
              
              <div className="relative border-l border-border mt-8 ml-4 space-y-6">
                {[
                  { title: "Join Organization", desc: "Start earning leaves (e.g. 1.5 - 2.5 leaves per month) as per company HR guidelines." },
                  { title: "Accumulate Balance", desc: "Leaves carry forward over years. Unused leaves accumulate up to organization caps." },
                  { title: "Resignation or Retirement", desc: "At exit, HR computes your eligible accrued leave days for payout." },
                  { title: "Apply Section 10(10AA)", desc: "Exemption calculation applied. Least of actual, 10 months avg, cash equivalent, or ₹25L." },
                  { title: "Payout Disbursal", desc: "Tax-free portion is exempted. Taxable portion is subject to TDS based on tax regime." }
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500" />
                    <h4 className="font-bold text-foreground leading-none mb-1 text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </article>

          </div>

          {/* Right Column Sidebar Content */}
          <div className="space-y-6">
            
            {/* Exemption Comparison Summary */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-foreground mb-4">Taxability Matrix</h3>
              <div className="overflow-hidden border border-border/60 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60 font-bold">
                      <th className="p-3">Scenario</th>
                      <th className="p-3">Tax Treatment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/40">
                      <td className="p-3 font-semibold">Retirement (Govt)</td>
                      <td className="p-3 text-emerald-500 font-medium">100% Tax Free</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="p-3 font-semibold">Retirement (Private)</td>
                      <td className="p-3 text-amber-500 font-medium">Exempt up to ₹25L</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="p-3 font-semibold">Resignation</td>
                      <td className="p-3 text-amber-500 font-medium">Exempt up to ₹25L</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">During Service</td>
                      <td className="p-3 text-rose-500 font-medium">Fully Taxable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Exemption Tips */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">Key Takeaways</h3>
              <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4 leading-relaxed">
                <li>Non-government employee exemption is capped at <strong>₹25 Lakhs</strong> across your lifetime.</li>
                <li>Deductions can be claimed under both <strong>Old and New Tax Regimes</strong>.</li>
                <li>Accumulation of leaves is legally restricted to a maximum of 30 days per completed service year.</li>
                <li>Tax is deducted at source (TDS) as 'Income from Salary' for the taxable amount.</li>
              </ul>
            </div>

            {/* Platform Cross-Links */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground">Retirement Utilities</h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: "Gratuity Calculator", href: "/calculators/gratuity" },
                  { name: "EPF Retirement Calculator", href: "/calculators/pf" },
                  { name: "Income Tax Calculator", href: "/calculators/income-tax" },
                  { name: "Take Home Salary", href: "/calculators/take-home-salary" },
                  { name: "Salary Dashboard", href: "/dashboard" },
                ].map((link, idx) => (
                  <Link 
                    key={idx} 
                    href={link.href} 
                    className="flex justify-between items-center p-2 rounded-lg bg-background hover:bg-muted/10 border border-border/50 text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 4. Collapsible FAQs Accordion */}
        <div className="pt-8 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {LEAVE_ENCASHMENT_FAQS.slice(0, 7).map((faq, idx) => (
                <div key={idx} className="border-b border-border/40 pb-4">
                  <h4 className="font-bold text-foreground text-sm flex gap-2"><HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" /> {faq.question}</h4>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {LEAVE_ENCASHMENT_FAQS.slice(7).map((faq, idx) => (
                <div key={idx} className="border-b border-border/40 pb-4">
                  <h4 className="font-bold text-foreground text-sm flex gap-2"><HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" /> {faq.question}</h4>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[10px] text-muted-foreground/60 border-t border-border pt-4 text-center leading-relaxed">
          Disclaimer: This calculator is built based on provisions of the Income Tax Act, 1961 and amendments introduced in Budget 2023. Calculations are for illustrative purposes only. For legal tax filings, please consult a certified tax professional.
        </div>

      </section>

    </div>
  );
}
