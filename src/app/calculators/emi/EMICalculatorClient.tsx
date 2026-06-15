"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useCurrency } from "@/context/CurrencyContext";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { EMI_FAQS } from "@/data/financeFaqs";

export function EMICalculatorClient() {
  const { formatCurrency } = useCurrency();
  const [loanAmount, setLoanAmount] = useState<number | "">(1000000);
  const [interestRate, setInterestRate] = useState<number | "">(9.5);
  const [loanTenure, setLoanTenure] = useState<number | "">(10);

  // Results
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const P = Number(loanAmount) || 0;
    const r = Number(interestRate) || 0;
    const n = Number(loanTenure) || 0;

    if (P > 0 && r > 0 && n > 0) {
      const ratePerMonth = r / 12 / 100;
      const totalMonths = n * 12;
      
      // EMI = P x R x (1+R)^N / [(1+R)^N-1]
      const emi = P * ratePerMonth * (Math.pow(1 + ratePerMonth, totalMonths)) / (Math.pow(1 + ratePerMonth, totalMonths) - 1);
      
      const totalAmount = emi * totalMonths;
      const interest = totalAmount - P;

      setMonthlyEMI(emi);
      setTotalInterest(interest);
      setTotalPayment(totalAmount);
    } else {
      setMonthlyEMI(0);
      setTotalInterest(0);
      setTotalPayment(0);
    }
  }, [loanAmount, interestRate, loanTenure]);

  const handleReset = () => {
    setLoanAmount(1000000);
    setInterestRate(9.5);
    setLoanTenure(10);
  };

  // Pie chart calculation
  const total = totalPayment;
  const principalPercent = total > 0 ? (Number(loanAmount) / total) * 100 : 50;
  const interestPercent = total > 0 ? (totalInterest / total) * 100 : 50;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            EMI Calculator
          </h1>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ShareButton 
              title="EMI Calculator | ApexToolHub" 
              text="Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans instantly." 
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
          Calculate your monthly loan EMI, total interest payable, and total payment instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Loan Amount Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Loan Amount</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="loan-amount-input"
                  />
                </div>
              </div>
              <input
                type="range"
                min="10000"
                max="50000000"
                step="10000"
                value={Number(loanAmount) || 0}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="loan-amount-slider"
              />
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Interest Rate (p.a)</label>
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

            {/* Loan Tenure Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Loan Tenure</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value ? Number(e.target.value) : "")}
                    className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="loan-tenure-input"
                  />
                  <span className="text-muted text-sm ml-1">Yr</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={Number(loanTenure) || 0}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                data-testid="loan-tenure-slider"
              />
            </div>

          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Loan Summary
            </h2>
            
            {/* Pure CSS Pie Chart */}
            <div className="flex justify-center mb-8 relative">
              <div 
                className="w-40 h-40 rounded-full shadow-inner"
                style={{
                  background: `conic-gradient(#3b82f6 ${principalPercent}%, #f43f5e ${principalPercent}% 100%)`
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-card rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] text-muted uppercase font-semibold">Total Payment</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-border/50">
                <span className="text-sm font-semibold text-foreground">Monthly EMI</span>
                <span className="text-xl font-bold font-mono text-foreground" data-testid="monthly-emi-output">{formatCurrency(monthlyEMI)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-sm text-muted font-medium">Principal Amount</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground" data-testid="principal-output">{formatCurrency(Number(loanAmount) || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-rose-500" />
                  <span className="text-sm text-muted font-medium">Total Interest</span>
                </div>
                <span className="text-base font-bold font-mono text-foreground" data-testid="total-interest-output">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Total Payment</span>
                <span className="text-lg font-bold font-mono text-foreground" data-testid="total-payment-output">{formatCurrency(totalPayment)}</span>
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

      {/* Educational Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-8 mt-8">
        <h2>What is an EMI?</h2>
        <p>
          Equated Monthly Installment (EMI) is a fixed payment made by a borrower to a lender on a specified date each month. It is used to pay off both the principal and the interest on a loan over a set number of years until it is fully paid off.
        </p>

        <h3>How Does the EMI Formula Work?</h3>
        <p>
          Our calculator uses the standard mathematical formula for calculating EMIs:
        </p>
        <blockquote className="font-mono text-xs bg-muted/20 p-4 rounded-md border-l-4 border-foreground">
          EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
        </blockquote>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>P</strong> = Principal loan amount</li>
          <li><strong>R</strong> = Rate of interest calculated per month (Annual Rate / 12 / 100)</li>
          <li><strong>N</strong> = Number of monthly installments (Tenure in Years × 12)</li>
        </ul>

        <h3 id="about-data">Benefits & About the Data</h3>
        <p>
          Using an EMI calculator before taking a loan helps you understand your monthly cash outflows, allowing you to budget better. It also shows you the total interest you will pay over the lifetime of the loan. The calculations provided assume a fixed interest rate throughout the loan tenure. In reality, floating rate loans may fluctuate based on the lender's benchmark rates.
        </p>
      </div>

      {/* FAQs */}
      <div className="border-t border-border pt-8 mt-8">
        <FAQAccordion items={EMI_FAQS} idPrefix="emi-faq" renderSchema={false} />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
