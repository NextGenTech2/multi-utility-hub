"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useCurrency } from "@/context/CurrencyContext";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { INCOME_TAX_FAQS } from "@/data/financeFaqs";

export function IncomeTaxClient() {
  const { formatCurrency } = useCurrency();
  const [income, setIncome] = useState<number | "">(1200000);
  const [deductions, setDeductions] = useState<number | "">(150000);

  // Results
  const [oldTax, setOldTax] = useState(0);
  const [newTax, setNewTax] = useState(0);
  const [recommendation, setRecommendation] = useState({ text: "", savings: 0, regime: "" });

  const calculateOldRegime = (taxableIncome: number) => {
    let tax = 0;
    if (taxableIncome <= 250000) return 0;
    if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
      // Rebate 87A
      if (taxableIncome <= 500000) return 0; 
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.20;
    } else {
      tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
    }
    return tax * 1.04; // Add 4% cess
  };

  const calculateNewRegime = (taxableIncome: number) => {
    let tax = 0;
    if (taxableIncome <= 300000) return 0;
    
    // Rebate 87A under new regime is up to 7L
    if (taxableIncome <= 700000) return 0;

    if (taxableIncome <= 600000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 900000) {
      tax = 15000 + (taxableIncome - 600000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 15000 + 30000 + (taxableIncome - 900000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.30;
    }
    return tax * 1.04; // Add 4% cess
  };

  useEffect(() => {
    const gross = Number(income) || 0;
    const inv = Number(deductions) || 0;
    
    const standardDeduction = 50000;

    // Old Regime Taxable = Gross - Standard Deduction - Other Deductions
    const oldTaxable = Math.max(0, gross - standardDeduction - inv);
    const oldRegimeTax = calculateOldRegime(oldTaxable);

    // New Regime Taxable = Gross - Standard Deduction (Other deductions not allowed)
    const newTaxable = Math.max(0, gross - standardDeduction);
    const newRegimeTax = calculateNewRegime(newTaxable);

    setOldTax(oldRegimeTax);
    setNewTax(newRegimeTax);

    if (oldRegimeTax < newRegimeTax) {
      setRecommendation({
        text: "Old Regime is better",
        savings: newRegimeTax - oldRegimeTax,
        regime: "old"
      });
    } else if (newRegimeTax < oldRegimeTax) {
      setRecommendation({
        text: "New Regime is better",
        savings: oldRegimeTax - newRegimeTax,
        regime: "new"
      });
    } else {
      setRecommendation({
        text: "Both regimes result in the same tax",
        savings: 0,
        regime: "equal"
      });
    }
  }, [income, deductions]);

  const handleReset = () => {
    setIncome(1200000);
    setDeductions(150000);
  };

  const maxTax = Math.max(oldTax, newTax, 1);
  const oldTaxPercent = (oldTax / maxTax) * 100;
  const newTaxPercent = (newTax / maxTax) * 100;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Income Tax Calculator
          </h1>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ShareButton 
              title="Income Tax Calculator | ApexToolHub" 
              text="Compare Old vs New Tax Regimes to find your best tax saving strategy." 
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
          Compare the Old and New Tax Regimes (FY 2024-25) to determine the most tax-efficient option for your salary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Gross Annual Salary</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="5000000"
                step="50000"
                value={Number(income) || 0}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Total Deductions (80C, HRA, etc.)</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={Number(deductions) || 0}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
              <p className="text-xs text-muted mt-1">Standard deduction of ₹50k is auto-applied to both regimes.</p>
            </div>

          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Tax Comparison
            </h2>
            
            <div className="space-y-6 flex-1">
              
              {/* Old Regime Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted">Old Regime Tax</span>
                  <span className="text-xl font-bold font-mono text-foreground">{formatCurrency(oldTax)}</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${oldTaxPercent}%` }}
                  />
                </div>
              </div>

              {/* New Regime Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted">New Regime Tax</span>
                  <span className="text-xl font-bold font-mono text-foreground">{formatCurrency(newTax)}</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${newTaxPercent}%` }}
                  />
                </div>
              </div>

            </div>
            
            <div className={`mt-8 p-4 rounded-lg border flex items-start gap-3 ${
              recommendation.regime === "new" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" :
              recommendation.regime === "old" ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400" :
              "bg-muted/20 border-border text-foreground"
            }`}>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-base">{recommendation.text}</h4>
                {recommendation.savings > 0 && (
                  <p className="text-sm opacity-90">
                    You save <strong>{formatCurrency(recommendation.savings)}</strong> by opting for the {recommendation.regime} regime.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-8 mt-8">
        <h2>Old vs New Tax Regime: Which is Better?</h2>
        <p>
          The Indian Government offers two income tax regimes. The <strong>Old Tax Regime</strong> allows you to claim over 70 exemptions and deductions (like 80C, 80D, HRA, home loan interest) to lower your taxable income. The <strong>New Tax Regime</strong> offers lower tax slab rates but does not allow most of these deductions, making it simpler but potentially more costly if you have significant investments.
        </p>

        <h3>How Does the Calculator Work?</h3>
        <p>
          This calculator uses the tax slabs for <strong>FY 2024-25 (AY 2025-26)</strong>. A standard deduction of ₹50,000 is automatically subtracted from your gross income for both regimes. A 4% Health and Education Cess is added to the final calculated tax. It also accounts for Section 87A rebate (zero tax up to ₹5L in the old regime, and up to ₹7L in the new regime).
        </p>

        <h3 id="about-data">About the Data & Deductions</h3>
        <p>
          Deductions entered should include your investments under section 80C (EPF, PPF, ELSS, LIC, up to ₹1.5L), 80D (health insurance), House Rent Allowance (HRA) exemption, LTA, and interest on home loans. If your total deductions are low, the New Regime usually results in higher savings.
        </p>
      </div>

      <div className="border-t border-border pt-8 mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <FAQAccordion items={INCOME_TAX_FAQS} idPrefix="tax-faq" />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
