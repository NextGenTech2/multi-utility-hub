"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw, AlertCircle, Briefcase, HelpCircle } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { GRATUITY_FAQS } from "@/data/financeFaqs";

export function GratuityCalculatorClient() {
  const [salary, setSalary] = useState<number | "">(100000);
  const [years, setYears] = useState<number | "">(10);
  const [months, setMonths] = useState<number | "">(0);
  const [isCovered, setIsCovered] = useState<boolean>(true);

  // Results
  const [totalGratuity, setTotalGratuity] = useState(0);
  const [taxExemptAmount, setTaxExemptAmount] = useState(0);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [effectiveTenure, setEffectiveTenure] = useState(0);

  const TAX_FREE_LIMIT = 2000000; // ₹20 Lakhs

  // Indian currency formatter
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const sal = Number(salary) || 0;
    const yrs = Number(years) || 0;
    const mths = Number(months) || 0;

    let tenure = yrs;
    if (isCovered) {
      // For covered employees, a fraction of a year equal to or exceeding 6 months is rounded up to a full year
      tenure = mths >= 6 ? yrs + 1 : yrs;
    } else {
      // For non-covered employees, only completed years of service are considered
      tenure = yrs;
    }
    setEffectiveTenure(tenure);

    if (sal > 0 && tenure > 0) {
      let calculated = 0;
      if (isCovered) {
        // Formula: (15 * salary * tenure) / 26
        calculated = (15 * sal * tenure) / 26;
      } else {
        // Formula: (15 * salary * tenure) / 30
        calculated = (15 * sal * tenure) / 30;
      }

      // Rounding to nearest integer
      const roundedGratuity = Math.round(calculated);
      setTotalGratuity(roundedGratuity);

      const exempt = Math.min(roundedGratuity, TAX_FREE_LIMIT);
      setTaxExemptAmount(exempt);
      setTaxableAmount(Math.max(0, roundedGratuity - TAX_FREE_LIMIT));
    } else {
      setTotalGratuity(0);
      setTaxExemptAmount(0);
      setTaxableAmount(0);
    }
  }, [salary, years, months, isCovered]);

  const handleReset = () => {
    setSalary(100000);
    setYears(10);
    setMonths(0);
    setIsCovered(true);
  };

  // Pie chart variables
  const totalVal = totalGratuity;
  const exemptPercent = totalVal > 0 ? (taxExemptAmount / totalVal) * 100 : 100;

  // Eligibility Warning (5 years rule)
  // Covered Act tenure uses rounded years, non-covered uses completed years.
  // Note: Technically, the law states 5 years of continuous service.
  const actualServiceYears = (Number(years) || 0) + (Number(months) || 0) / 12;
  const showEligibilityWarning = actualServiceYears > 0 && actualServiceYears < 5;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Online Gratuity Calculator India
          </h1>
          <div className="flex items-center gap-2">
            <ShareButton 
              title="Online Gratuity Calculator India | ApexToolHub" 
              text="Calculate your estimated gratuity amount, tax exemption, and taxable portion instantly." 
            />
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
        <p className="text-sm text-muted">
          Calculate your retirement gratuity benefit under the Payment of Gratuity Act, 1972, and understand the tax exemptions for Indian employees. (INR Only)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Gratuity Act Coverage Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-zinc-500" />
                Employer Gratuity Act Coverage
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsCovered(true)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isCovered
                      ? "border-foreground bg-foreground/5 text-foreground font-semibold"
                      : "border-border bg-card text-muted hover:text-foreground hover:bg-muted/5"
                  }`}
                >
                  <span className="text-sm">Covered under Act</span>
                  <span className="text-[10px] opacity-75 font-normal mt-0.5">10+ employees (15/26 formula)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCovered(false)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    !isCovered
                      ? "border-foreground bg-foreground/5 text-foreground font-semibold"
                      : "border-border bg-card text-muted hover:text-foreground hover:bg-muted/5"
                  }`}
                >
                  <span className="text-sm">Not Covered under Act</span>
                  <span className="text-[10px] opacity-75 font-normal mt-0.5">Small establishments (15/30 formula)</span>
                </button>
              </div>
            </div>

            {/* Last Drawn Salary (Basic + DA) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Last Drawn Monthly Salary (Basic + DA)</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <span className="text-muted text-sm mr-1">₹</span>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : "")}
                    className="w-28 text-right bg-transparent text-sm font-mono focus:outline-none"
                    min="0"
                  />
                </div>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="5000"
                value={Number(salary) || 0}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
              <div className="flex justify-between text-[10px] text-muted">
                <span>₹10,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Service Period Layout (Years and Months) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Years of Service */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Completed Years</label>
                  <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value ? Number(e.target.value) : "")}
                      className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                      min="0"
                      max="50"
                    />
                    <span className="text-muted text-sm ml-1">Yrs</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={Number(years) || 0}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>

              {/* Months of Service */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Additional Months</label>
                  <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                    <input
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(e.target.value ? Number(e.target.value) : "")}
                      className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                      min="0"
                      max="11"
                    />
                    <span className="text-muted text-sm ml-1">Mths</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="11"
                  step="1"
                  value={Number(months) || 0}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
              </div>

            </div>

            {/* Service Eligibility Warning Alert */}
            {showEligibilityWarning && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Continuous Service under 5 Years</p>
                  <p className="opacity-90 leading-normal">
                    Under Indian law, gratuity is typically payable only after completing **5 years of continuous service** with the same employer. It is waived only in the case of employee death or permanent disablement.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Summary/Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Gratuity Summary
            </h2>
            
            {/* Conic Gradient Pie Chart (Exempt vs Taxable) */}
            <div className="flex justify-center mb-8 relative">
              <div 
                className="w-40 h-40 rounded-full shadow-inner"
                style={{
                  background: totalVal > 0 
                    ? `conic-gradient(#10b981 ${exemptPercent}%, #ef4444 ${exemptPercent}% 100%)`
                    : "#e4e4e7"
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-card rounded-full flex flex-col items-center justify-center">
                <span className="text-[9px] text-muted uppercase font-bold tracking-wider">Total Gratuity</span>
                <span className="text-sm font-extrabold font-mono text-foreground mt-0.5 truncate max-w-[100px] text-center">
                  {totalVal > 0 ? formatINR(totalVal) : "₹0"}
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted font-semibold">Service Tenure Used</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {effectiveTenure} {effectiveTenure === 1 ? "Year" : "Years"}
                  {isCovered && Number(months) > 0 && (
                    <span className="text-[10px] text-muted font-normal block text-right mt-0.5">
                      (Rounded from {years} yr {months} mo)
                    </span>
                  )}
                  {!isCovered && Number(months) > 0 && (
                    <span className="text-[10px] text-muted font-normal block text-right mt-0.5">
                      (Completed years only)
                    </span>
                  )}
                </span>
              </div>
              
              <div className="border-t border-border/60 my-2" />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-sm text-muted font-medium">Tax-Exempt Portion</span>
                </div>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatINR(taxExemptAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-sm text-muted font-medium">Taxable Portion</span>
                </div>
                <span className="text-base font-bold font-mono text-red-650 dark:text-red-400">
                  {formatINR(taxableAmount)}
                </span>
              </div>

              <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Estimated Payable</span>
                <span className="text-xl font-extrabold font-mono text-foreground">
                  {formatINR(totalGratuity)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-right">
              <a href="#about-data" className="text-xs text-muted hover:text-foreground underline decoration-muted/50 transition-colors">
                Understanding calculations
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Structured SEO Guide Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-8 mt-8 space-y-6 text-left">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          What is Gratuity and How Does It Work in India?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Gratuity is a financial retirement benefit provided by employers in India under the **Payment of Gratuity Act, 1972**. It is a defined benefit plan where the employer rewards the employee for rendering continuous services for five years or more. Gratuity acts as a long-term saving component, similar to the Employee Provident Fund (EPF), but is funded entirely by the employer.
        </p>

        <h3 className="text-lg font-semibold tracking-tight text-foreground" id="about-data">
          How to Calculate Gratuity: Covered vs. Not Covered
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The calculation of gratuity depends on whether your organization is covered under the statutory Act or not:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-foreground">1. Covered Under the Gratuity Act</h4>
            <p className="text-xs text-muted-foreground leading-normal">
              Applies to companies with 10 or more employees. The formula assumes 26 working days in a month (excluding Sundays):
            </p>
            <div className="font-mono text-xs bg-card p-3 rounded border border-border text-center">
              Gratuity = (15 × Last Drawn Salary × Tenure) / 26
            </div>
            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
              <li>**Last Drawn Salary**: Basic Salary + Dearness Allowance (DA).</li>
              <li>**Service Period Rounded**: A service of 6 months or more in the final year is rounded up to a full year. For example, 7 years and 6 months is counted as 8 years.</li>
            </ul>
          </div>

          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-foreground">2. Not Covered Under the Gratuity Act</h4>
            <p className="text-xs text-muted-foreground leading-normal">
              For organizations not mandated under the Act (less than 10 employees) that choose to offer gratuity voluntarily:
            </p>
            <div className="font-mono text-xs bg-card p-3 rounded border border-border text-center">
              Gratuity = (15 × Last Drawn Salary × Tenure) / 30
            </div>
            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
              <li>**Last Drawn Salary**: Basic Salary + DA + Commissions (based on fixed sales percentage).</li>
              <li>**Service Period Truncated**: Only fully completed years of service are counted. Fractions are completely ignored (e.g., 9 years and 11 months is treated as 9 years).</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Tax Exemptions and Lifetime Limits on Gratuity
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Under Section 10(10) of the Indian Income Tax Act, the taxation rules for gratuity are categorized as follows:
        </p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
          <li><strong>Government Employees:</strong> Gratuity received by central, state, or local authority government employees is 100% tax-free.</li>
          <li><strong>Private-Sector Employees:</strong> Gratuity is tax-free up to a statutory limit of <strong>₹20,00,000 (₹20 Lakhs)</strong> in their lifetime. Any gratuity payment exceeding this threshold is added to your income and taxed according to your applicable income tax slabs.</li>
        </ul>
      </div>

      <div className="border-t border-border pt-8 mt-8">
        {/* Render FAQs Accordion. Sets renderSchema to false as page.tsx renders it. */}
        <FAQAccordion items={GRATUITY_FAQS} idPrefix="gratuity-faq" renderSchema={false} />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
