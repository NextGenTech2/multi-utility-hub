"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PPF_FAQS } from "@/data/financeFaqs";

export function PPFCalculatorClient() {
  const [yearlyInvestment, setYearlyInvestment] = useState<number | "">(150000);
  const [timePeriod, setTimePeriod] = useState<number | "">(15);
  const [interestRate, setInterestRate] = useState<number | "">(7.1);

  // Results
  const [investedAmount, setInvestedAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);

  // Hardcoded INR formatter since PPF is an Indian scheme
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const P = Number(yearlyInvestment) || 0;
    const r = Number(interestRate) || 0;
    const n = Number(timePeriod) || 0;

    if (P > 0 && r > 0 && n > 0) {
      let maturity = 0;
      for (let i = 0; i < n; i++) {
        maturity = (maturity + P) * (1 + r / 100);
      }
      const invested = P * n;
      const interest = maturity - invested;

      setInvestedAmount(invested);
      setTotalInterest(interest);
      setMaturityValue(maturity);
    } else {
      setInvestedAmount(0);
      setTotalInterest(0);
      setMaturityValue(0);
    }
  }, [yearlyInvestment, timePeriod, interestRate]);

  const handleReset = () => {
    setYearlyInvestment(150000);
    setTimePeriod(15);
    setInterestRate(7.1);
  };

  // Pie chart calculation
  const total = maturityValue;
  const investedPercent = total > 0 ? (investedAmount / total) * 100 : 50;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            PPF Calculator
          </h1>
          <div className="flex items-center gap-2">
            <ShareButton 
              title="PPF Calculator | ApexToolHub" 
              text="Calculate your Public Provident Fund (PPF) maturity value and interest earned instantly." 
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
          Calculate the maturity amount and interest earned on your Public Provident Fund (PPF) investments over time. (INR Only)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Yearly Investment Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Yearly Investment</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <span className="text-muted text-sm mr-1">₹</span>
                  <input
                    type="number"
                    value={yearlyInvestment}
                    onChange={(e) => setYearlyInvestment(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="500"
                max="150000"
                step="500"
                value={Number(yearlyInvestment) || 0}
                onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            {/* Time Period Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Time Period</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value ? Number(e.target.value) : "")}
                    className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                  />
                  <span className="text-muted text-sm ml-1">Yr</span>
                </div>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                step="5"
                value={Number(timePeriod) || 0}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Interest Rate</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : "")}
                    className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                  />
                  <span className="text-muted text-sm ml-1">%</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.1"
                value={Number(interestRate) || 0}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
            </div>

          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Maturity Summary
            </h2>
            
            <div className="flex justify-center mb-8 relative">
              <div 
                className="w-40 h-40 rounded-full shadow-inner"
                style={{
                  background: `conic-gradient(#3b82f6 ${investedPercent}%, #8b5cf6 ${investedPercent}% 100%)`
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-card rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted uppercase font-semibold">Total Value</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-muted font-medium">Invested Amount</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground">{formatINR(investedAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-violet-500" />
                  <span className="text-sm text-muted font-medium">Total Interest</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground">{formatINR(totalInterest)}</span>
              </div>
              <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Maturity Value</span>
                <span className="text-xl font-bold font-mono text-foreground">{formatINR(maturityValue)}</span>
              </div>
            </div>
            
            <div className="mt-6 text-right">
              <a href="#about-data" className="text-xs text-muted hover:text-foreground underline decoration-muted/50 transition-colors">
                About the Data
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-8 mt-8">
        <h2>What is a Public Provident Fund (PPF)?</h2>
        <p>
          PPF is a savings-cum-tax-saving instrument in India, introduced by the National Savings Institute of the Ministry of Finance. It serves as an excellent long-term investment option for individuals looking to build a retirement corpus while enjoying high safety and tax benefits.
        </p>

        <h3>How Does the PPF Formula Work?</h3>
        <p>
          PPF interest is compounded annually. If you make a lump-sum yearly investment, the maturity amount is calculated using the compound interest formula iteratively over the years:
        </p>
        <blockquote className="font-mono text-xs bg-muted/20 p-4 rounded-md border-l-4 border-foreground">
          F = P × [((1+i)^n - 1) / i]
        </blockquote>
        <p>
          Where <strong>F</strong> is the Maturity Value, <strong>P</strong> is the Annual Installment, <strong>i</strong> is the Rate of Interest, and <strong>n</strong> is the number of years.
        </p>

        <h3 id="about-data">Tax Benefits & About the Data</h3>
        <p>
          The PPF scheme falls under the <strong>EEE (Exempt-Exempt-Exempt)</strong> tax category. This means the invested amount (up to ₹1.5 Lakhs), the interest earned, and the maturity amount are all completely exempt from Income Tax. The standard minimum lock-in period is 15 years, though it can be extended in blocks of 5 years.
        </p>
      </div>

      <div className="border-t border-border pt-8 mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <FAQAccordion items={PPF_FAQS} idPrefix="ppf-faq" />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
