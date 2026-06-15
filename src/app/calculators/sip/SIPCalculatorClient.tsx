"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw, ChevronDown, ChevronUp, Info } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useCurrency } from "@/context/CurrencyContext";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SIP_FAQS } from "@/data/financeFaqs";
import { Tooltip } from "@/components/Tooltip";

export function SIPCalculatorClient() {
  const { formatCurrency } = useCurrency();
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(10000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number | "">(12);
  const [timePeriod, setTimePeriod] = useState<number | "">(10);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [annualIncrement, setAnnualIncrement] = useState<number | "">(0);
  const [inflationRate, setInflationRate] = useState<number | "">(0);

  // Results
  const [investedAmount, setInvestedAmount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [inflationAdjustedValue, setInflationAdjustedValue] = useState(0);

  // For Chart/Table Comparison
  const [regularTotalValue, setRegularTotalValue] = useState(0);
  const [regularInvested, setRegularInvested] = useState(0);
  const [regularInflationAdjustedValue, setRegularInflationAdjustedValue] = useState(0);

  useEffect(() => {
    const P = Number(monthlyInvestment) || 0;
    const r = Number(expectedReturnRate) || 0;
    const n = Number(timePeriod) || 0;
    const stepUp = Number(annualIncrement) || 0;
    const inf = Number(inflationRate) || 0;

    if (P > 0 && r > 0 && n > 0) {
      const monthlyRate = r / 100 / 12;
      const months = n * 12;
      
      let currentMonthly = P;
      let fv = 0;
      let totalInv = 0;

      let regFv = 0;

      for (let month = 1; month <= months; month++) {
        // Step-up occurs at the start of every new year (month 13, 25, 37, etc.)
        if (month > 1 && (month - 1) % 12 === 0) {
          currentMonthly += currentMonthly * (stepUp / 100);
        }
        
        // Compound Step-Up SIP
        fv = (fv + currentMonthly) * (1 + monthlyRate);
        totalInv += currentMonthly;

        // Compound Regular SIP (for comparison chart)
        regFv = (regFv + P) * (1 + monthlyRate);
      }

      // Inflation Adjusted (Purchasing Power)
      // PV = FV / (1 + i)^n
      const realValue = fv / Math.pow(1 + inf / 100, n);
      const regRealValue = regFv / Math.pow(1 + inf / 100, n);

      setInvestedAmount(totalInv);
      setTotalValue(fv);
      setInflationAdjustedValue(realValue);
      setRegularTotalValue(regFv);
      setRegularInvested(P * months);
      setRegularInflationAdjustedValue(regRealValue);
    } else {
      setInvestedAmount(0);
      setTotalValue(0);
      setInflationAdjustedValue(0);
      setRegularTotalValue(0);
      setRegularInvested(0);
      setRegularInflationAdjustedValue(0);
    }
  }, [monthlyInvestment, expectedReturnRate, timePeriod, annualIncrement, inflationRate]);

  const handleReset = () => {
    setMonthlyInvestment(10000);
    setExpectedReturnRate(12);
    setTimePeriod(10);
    setAnnualIncrement(0);
    setInflationRate(0);
  };

  // No bar chart needed anymore - we use a direct table comparison

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Advanced SIP Calculator
          </h1>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ShareButton 
              title="Advanced SIP Calculator | ApexToolHub" 
              text="Calculate Step-Up SIPs and Inflation Adjusted returns." 
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
          Calculate the future value of your investments, add annual step-ups, and discover the true purchasing power of your corpus adjusted for inflation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Monthly Investment Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Monthly Investment</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="monthly-investment-input"
                  />
                </div>
              </div>
              <input
                type="range"
                min="500"
                max="200000"
                step="500"
                value={Number(monthlyInvestment) || 0}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="monthly-investment-slider"
              />
            </div>

            {/* Expected Return Rate Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Expected Return Rate</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={expectedReturnRate}
                    onChange={(e) => setExpectedReturnRate(e.target.value ? Number(e.target.value) : "")}
                    className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="expected-return-rate-input"
                  />
                  <span className="text-muted text-sm ml-1">% p.a</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={Number(expectedReturnRate) || 0}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="expected-return-rate-slider"
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
                max="40"
                step="1"
                value={Number(timePeriod) || 0}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="time-period-slider"
              />
            </div>

            {/* Advanced Settings Accordion */}
            <div className="border-t border-border pt-4 mt-2">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-sm font-semibold text-foreground hover:text-muted transition-colors focus:outline-none"
                data-testid="advanced-toggle"
              >
                <span>Advanced Settings (Optional)</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
              </button>
              
              {showAdvanced && (
                <div className="space-y-6 mt-6 animate-in slide-in-from-top-2 duration-200">
                  {/* Step Up Increment */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <label className="text-sm font-semibold text-foreground">Annual Step-up Increment</label>
                      </div>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <input
                          type="number"
                          value={annualIncrement}
                          onChange={(e) => setAnnualIncrement(e.target.value ? Number(e.target.value) : "")}
                          className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                          data-testid="annual-increment-input"
                        />
                        <span className="text-muted text-sm ml-1">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={Number(annualIncrement) || 0}
                      onChange={(e) => setAnnualIncrement(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                      data-testid="annual-increment-slider"
                    />
                    <p className="text-xs text-muted">Increase your monthly SIP amount every year to match your salary growth.</p>
                  </div>

                  {/* Inflation Adjustment */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <label className="text-sm font-semibold text-foreground">Expected Inflation</label>
                        <Tooltip content="We suggest 6% for Indian market planning">
                          <Info className="h-3.5 w-3.5 text-zinc-400 cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <input
                          type="number"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(e.target.value ? Number(e.target.value) : "")}
                          className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                          data-testid="inflation-rate-input"
                        />
                        <span className="text-muted text-sm ml-1">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={Number(inflationRate) || 0}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                      data-testid="inflation-rate-slider"
                    />
                    <p className="text-xs text-muted">Adjusts the final corpus to show real purchasing power in today's value.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Wealth Projection
            </h2>
            
            {Number(annualIncrement) > 0 ? (
              // Side-by-Side Comparison View
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Regular SIP Summary Card */}
                    <div className="p-4 rounded-xl bg-zinc-500/5 border border-border flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Regular SIP Corpus</span>
                      <span className="text-lg md:text-xl font-bold font-mono text-foreground mb-1" data-testid="regular-sip-corpus-output">
                        {formatCurrency(regularTotalValue)}
                      </span>
                      <span className="text-[10px] text-muted">Fixed Investment</span>
                    </div>

                    {/* Step-up SIP Summary Card */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.07)] flex flex-col relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-background text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                        Better Choice
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Step-Up SIP Corpus</span>
                      <span className="text-lg md:text-xl font-bold font-mono text-emerald-400 mb-1" data-testid="stepup-sip-corpus-output">
                        {formatCurrency(totalValue)}
                      </span>
                      <span className="text-[10px] text-emerald-500/80 font-medium">
                        +{formatCurrency(Math.max(0, totalValue - regularTotalValue))} growth
                      </span>
                    </div>
                  </div>

                  {/* Comparative Table */}
                  <div className="border border-border rounded-lg overflow-hidden bg-background/50 mb-6">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/80 bg-muted/20 text-xs">
                          <th className="py-3 px-3 font-semibold text-muted">Metric</th>
                          <th className="py-3 px-3 font-semibold text-muted text-right">Regular SIP</th>
                          <th className="py-3 px-3 font-semibold text-emerald-400 text-right bg-emerald-500/5">Step-Up SIP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-xs md:text-sm font-mono">
                        <tr>
                          <td className="py-3 px-3 text-muted font-sans font-medium">Monthly Contribution</td>
                          <td className="py-3 px-3 text-right text-foreground">{formatCurrency(Number(monthlyInvestment) || 0)}</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-semibold bg-emerald-500/5">
                            Starts at {formatCurrency(Number(monthlyInvestment) || 0)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 text-muted font-sans font-medium">Total Invested</td>
                          <td className="py-3 px-3 text-right text-foreground">{formatCurrency(regularInvested)}</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-semibold bg-emerald-500/5">
                            {formatCurrency(investedAmount)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 text-muted font-sans font-medium">Est. Wealth Gain</td>
                          <td className="py-3 px-3 text-right text-foreground">{formatCurrency(Math.max(0, regularTotalValue - regularInvested))}</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-semibold bg-emerald-500/5">
                            {formatCurrency(Math.max(0, totalValue - investedAmount))}
                          </td>
                        </tr>
                        {Number(inflationRate) > 0 && (
                          <tr>
                            <td className="py-3 px-3 text-muted font-sans font-medium">Purchasing Power</td>
                            <td className="py-3 px-3 text-right text-muted">{formatCurrency(regularInflationAdjustedValue)}</td>
                            <td className="py-3 px-3 text-right text-emerald-400 font-semibold bg-emerald-500/5">
                              {formatCurrency(inflationAdjustedValue)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cost of Inaction / Benefit Callouts */}
                <div className="space-y-4">
                  {/* Step-Up Multiplier Insight */}
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-300 leading-relaxed shadow-sm">
                    <p className="font-bold text-blue-200 mb-1 flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-blue-400 shrink-0" />
                      Step-Up Multiplier Insight
                    </p>
                    By choosing a <span className="font-bold text-foreground">{annualIncrement}%</span> annual step-up, you generated an additional <span className="font-bold text-foreground">{formatCurrency(Math.max(0, (totalValue - investedAmount) - (regularTotalValue - regularInvested)))}</span> compared to a regular SIP.
                  </div>

                  {/* Psychological Inaction/Benefit Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5 text-xs">
                      <span className="font-bold text-emerald-400 block mb-1">🚀 Benefit of Step-up</span>
                      You build <span className="font-bold text-foreground">{formatCurrency(Math.max(0, totalValue - regularTotalValue))}</span> more final wealth.
                    </div>
                    <div className="p-3 rounded-lg border border-red-500/15 bg-red-500/5 text-xs">
                      <span className="font-bold text-red-400 block mb-1">⚠️ Cost of Inaction</span>
                      Keeping SIP flat loses you <span className="font-bold text-foreground">{formatCurrency(Math.max(0, (totalValue - investedAmount) - (regularTotalValue - regularInvested)))}</span> in extra compounding return.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Default View: show only the Regular SIP projection
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Metric Cards Side-by-Side */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">Estimated Corpus</span>
                      <span className="text-xl md:text-2xl font-bold font-mono text-blue-900 dark:text-blue-100" data-testid="estimated-corpus-output">{formatCurrency(totalValue)}</span>
                      <span className="text-[10px] text-blue-600/80 mt-1 dark:text-blue-300/80">Future Value</span>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center relative group">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">Purchasing Power</span>
                      <span className="text-xl md:text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-100" data-testid="purchasing-power-output">
                        {Number(inflationRate) > 0 ? formatCurrency(inflationAdjustedValue) : "---"}
                      </span>
                      <span className="text-[10px] text-emerald-600/80 mt-1 dark:text-emerald-300/80">
                        {Number(inflationRate) > 0 ? "Inflation Adjusted" : "Set Inflation > 0"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-sm text-muted font-medium">Total Invested Amount</span>
                      <span className="text-sm font-bold font-mono text-foreground" data-testid="total-invested-amount-output">{formatCurrency(investedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="text-sm text-muted font-medium">Est. Wealth Gain</span>
                      <span className="text-sm font-bold font-mono text-foreground" data-testid="est-wealth-gain-output">{formatCurrency(Math.max(0, totalValue - investedAmount))}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-border bg-muted/5 text-xs text-muted leading-relaxed">
                  <span className="font-semibold text-foreground block mb-1">💡 Pro-Tip: The Power of Stepping Up</span>
                  Increase your investment by just 5% or 10% every year. Click on <strong>Advanced Settings</strong> and add an Annual Step-up to compare how much more wealth you could build over time.
                </div>
              </div>
            )}
            
            <div className="mt-6 text-right">
              <a href="#about-data" className="text-xs text-muted hover:text-foreground underline decoration-muted/50 transition-colors">
                About the Data
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-8 mt-8">
        <h2>Advanced SIP Investment Strategy</h2>
        
        <h3>What is a Step-Up SIP?</h3>
        <p>
          A Step-Up SIP (also known as a Top-Up SIP) is a method where you automatically increase your monthly investment amount by a fixed percentage every year. As your salary and income grow, your investments should too. Even a small annual increment of 5% or 10% can drastically increase your final corpus through aggressive compounding over the long term. 
        </p>

        <h3>Why Inflation Adjustment Matters</h3>
        <p>
          Inflation silently eats away at the purchasing power of your money over time. If a car costs ₹10,000,000 today, an inflation rate of 6% means the same car will cost significantly more in 15 years.
        </p>
        <p>
          By adjusting your Future Value corpus for inflation using the Present Value (PV) formula, you can see the <strong>Real Value</strong> of your investments. For example, a future corpus of ₹2 Crores might only have the purchasing power of ₹60 Lakhs in today's terms. This helps you set realistic financial goals.
        </p>
        <blockquote className="font-mono text-xs bg-muted/20 p-4 rounded-md border-l-4 border-foreground">
          Present Value (PV) = Future Value (FV) / (1 + Inflation Rate)^Years
        </blockquote>

        <h3 id="about-data">About the Data</h3>
        <p>
          The calculations above assume a constant rate of return, compounding monthly. The inflation adjustment is an estimate based on the fixed rate you provide (historically around 6% for Indian markets). Mutual fund investments are subject to market risks, and historical returns are not guaranteed future indicators.
        </p>
      </div>

      {/* FAQs */}
      <div className="border-t border-border pt-8 mt-8">
        <FAQAccordion items={SIP_FAQS} idPrefix="sip-faq" renderSchema={false} />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
