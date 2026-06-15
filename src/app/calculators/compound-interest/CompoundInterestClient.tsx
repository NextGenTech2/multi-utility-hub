"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useCurrency } from "@/context/CurrencyContext";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { COMPOUND_FAQS } from "@/data/financeFaqs";

export function CompoundInterestClient() {
  const { formatCurrency } = useCurrency();
  const [principal, setPrincipal] = useState<number | "">(10000);
  const [interestRate, setInterestRate] = useState<number | "">(5);
  const [timePeriod, setTimePeriod] = useState<number | "">(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState<number>(12); // 1=Annually, 2=Semi, 4=Quarterly, 12=Monthly

  // Results
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const P = Number(principal) || 0;
    const r = Number(interestRate) || 0;
    const t = Number(timePeriod) || 0;
    const n = Number(compoundingFrequency) || 12;

    if (P > 0 && r > 0 && t > 0) {
      // A = P(1 + r/n)^(nt)
      const rateDecimal = r / 100;
      const amount = P * Math.pow(1 + rateDecimal / n, n * t);
      const interest = amount - P;

      setTotalAmount(amount);
      setTotalInterest(interest);
    } else {
      setTotalAmount(0);
      setTotalInterest(0);
    }
  }, [principal, interestRate, timePeriod, compoundingFrequency]);

  const handleReset = () => {
    setPrincipal(10000);
    setInterestRate(5);
    setTimePeriod(10);
    setCompoundingFrequency(12);
  };

  // Pie chart calculation
  const total = totalAmount;
  const principalPercent = total > 0 ? (Number(principal) / total) * 100 : 50;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Compound Interest Calculator
          </h1>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ShareButton 
              title="Compound Interest Calculator | ApexToolHub" 
              text="Calculate the power of compound interest and visualize how your money grows over time." 
            />
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
              data-testid="reset-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
        <p className="text-sm text-muted">
          Calculate the future value of your investment using the power of compounding. Adjust frequency to see the difference.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Principal Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Principal Amount</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="principal-input"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={Number(principal) || 0}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="principal-slider"
              />
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Annual Interest Rate</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : "")}
                    className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="interest-rate-input"
                  />
                  <span className="text-muted text-sm ml-1">%</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={Number(interestRate) || 0}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="interest-rate-slider"
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
                    data-testid="time-period-input"
                  />
                  <span className="text-muted text-sm ml-1">Yr</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={Number(timePeriod) || 0}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="time-period-slider"
              />
            </div>

            {/* Compounding Frequency */}
            <div className="space-y-3 pt-2 border-t border-border">
              <label className="text-sm font-semibold text-foreground block mb-2">Compounding Frequency</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: "Annually", val: 1 },
                  { label: "Semi-Annually", val: 2 },
                  { label: "Quarterly", val: 4 },
                  { label: "Monthly", val: 12 },
                ].map((freq) => (
                  <button
                    key={freq.val}
                    onClick={() => setCompoundingFrequency(freq.val)}
                    data-testid={`compounding-freq-btn-${freq.val}`}
                    className={`py-2 px-3 text-xs rounded-md border transition-all ${
                      compoundingFrequency === freq.val
                        ? "bg-foreground text-background border-foreground font-semibold shadow-sm"
                        : "bg-background border-border text-muted hover:text-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Growth Summary
            </h2>
            
            <div className="flex justify-center mb-8 relative">
              <div 
                className="w-40 h-40 rounded-full shadow-inner"
                style={{
                  background: `conic-gradient(#3b82f6 ${principalPercent}%, #f59e0b ${principalPercent}% 100%)`
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-card rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted uppercase font-semibold">Total Amount</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-muted font-medium">Principal Amount</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground" data-testid="principal-output">{formatCurrency(Number(principal) || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-sm text-muted font-medium">Total Interest</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground" data-testid="total-interest-output">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Total Amount</span>
                <span className="text-xl font-bold font-mono text-foreground" data-testid="total-amount-output">{formatCurrency(totalAmount)}</span>
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
        <h2>The Power of Compound Interest</h2>
        <p>
          Unlike simple interest, which is calculated only on the principal amount, compound interest is calculated on the principal amount and the accumulated interest of previous periods. Often called the &quot;Eighth Wonder of the World&quot;, it causes wealth to grow exponentially over time.
        </p>

        <h3>How Does the Compound Interest Formula Work?</h3>
        <p>
          Our calculator uses the standard mathematical formula for compound interest:
        </p>
        <blockquote className="font-mono text-xs bg-muted/20 p-4 rounded-md border-l-4 border-foreground">
          A = P(1 + r/n)^(nt)
        </blockquote>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>A</strong> = Total Amount (Principal + Interest)</li>
          <li><strong>P</strong> = Principal Amount</li>
          <li><strong>r</strong> = Annual interest rate (in decimal form)</li>
          <li><strong>n</strong> = Number of times interest is compounded per year</li>
          <li><strong>t</strong> = Time the money is invested or borrowed for, in years</li>
        </ul>

        <h3 id="about-data">Compounding Frequency & About the Data</h3>
        <p>
          The frequency of compounding makes a significant difference. If you invest at 10% annual interest, compounding it monthly rather than annually will yield a higher return because the interest earned in January will itself earn interest in February. Try toggling between Annually and Monthly in the calculator to see the difference!
        </p>
      </div>

      <div className="border-t border-border pt-8 mt-8">
        <FAQAccordion items={COMPOUND_FAQS} idPrefix="compound-faq" renderSchema={false} />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
