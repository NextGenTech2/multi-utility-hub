"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useCurrency } from "@/context/CurrencyContext";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { MORTGAGE_FAQS, HOME_LOAN_FAQS } from "@/data/financeFaqs";

export function MortgageClient() {
  const { formatCurrency, currency } = useCurrency();
  const [homePrice, setHomePrice] = useState<number | "">(currency === "USD" ? 400000 : 10000000);
  const [downPayment, setDownPayment] = useState<number | "">(currency === "USD" ? 80000 : 2000000);
  const [interestRate, setInterestRate] = useState<number | "">(6.5);
  const [loanTerm, setLoanTerm] = useState<number | "">(30);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState<number | "">(currency === "USD" ? 4000 : 50000);
  const [homeInsuranceYearly, setHomeInsuranceYearly] = useState<number | "">(currency === "USD" ? 1200 : 10000);
  const [hoaMonthly, setHoaMonthly] = useState<number | "">(currency === "USD" ? 250 : 2000);

  // Results
  const [monthlyPrincipalInterest, setMonthlyPrincipalInterest] = useState(0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(0);
  const [monthlyHomeInsurance, setMonthlyHomeInsurance] = useState(0);
  const [monthlyPMI, setMonthlyPMI] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);

  const [showAdditionalCosts, setShowAdditionalCosts] = useState(currency !== "INR");

  // Auto-toggle additional monthly costs accordion state when currency shifts
  useEffect(() => {
    setShowAdditionalCosts(currency !== "INR");
  }, [currency]);

  useEffect(() => {
    // If currency switches drastically, we might want to scale defaults, but we'll let user input it for now
    const price = Number(homePrice) || 0;
    const dp = Number(downPayment) || 0;
    const r = Number(interestRate) || 0;
    const n = Number(loanTerm) || 0;
    
    const pTax = (Number(propertyTaxYearly) || 0) / 12;
    const hIns = (Number(homeInsuranceYearly) || 0) / 12;
    const hoa = Number(hoaMonthly) || 0;

    if (price > 0 && n > 0) {
      const loanAmount = Math.max(0, price - dp);
      
      let pi = 0;
      if (r > 0) {
        const ratePerMonth = r / 12 / 100;
        const totalMonths = n * 12;
        pi = loanAmount * ratePerMonth * (Math.pow(1 + ratePerMonth, totalMonths)) / (Math.pow(1 + ratePerMonth, totalMonths) - 1);
      } else {
        pi = loanAmount / (n * 12);
      }

      // Calculate PMI if Down Payment < 20%
      let pmi = 0;
      if (dp < price * 0.2) {
        // approx 0.5% of loan amount per year
        pmi = (loanAmount * 0.005) / 12;
      }

      setMonthlyPrincipalInterest(pi);
      setMonthlyPropertyTax(pTax);
      setMonthlyHomeInsurance(hIns);
      setMonthlyPMI(pmi);

      const baseEMI = pi;
      const extraCosts = showAdditionalCosts ? (pTax + hIns + pmi + hoa) : 0;
      setTotalMonthlyPayment(baseEMI + extraCosts);
    } else {
      setMonthlyPrincipalInterest(0);
      setMonthlyPropertyTax(0);
      setMonthlyHomeInsurance(0);
      setMonthlyPMI(0);
      setTotalMonthlyPayment(0);
    }
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTaxYearly, homeInsuranceYearly, hoaMonthly, showAdditionalCosts]);

  const handleReset = () => {
    setHomePrice(currency === "USD" ? 400000 : 10000000);
    setDownPayment(currency === "USD" ? 80000 : 2000000);
    setInterestRate(6.5);
    setLoanTerm(30);
    setPropertyTaxYearly(currency === "USD" ? 4000 : 50000);
    setHomeInsuranceYearly(currency === "USD" ? 1200 : 10000);
    setHoaMonthly(currency === "USD" ? 250 : 2000);
  };

  const total = totalMonthlyPayment;
  const piPercent = total > 0 ? (monthlyPrincipalInterest / total) * 100 : 0;
  const taxPercent = total > 0 ? (monthlyPropertyTax / total) * 100 : 0;
  const insPercent = total > 0 ? (monthlyHomeInsurance / total) * 100 : 0;
  const hoaPercent = total > 0 ? (Number(hoaMonthly) / total) * 100 : 0;
  const pmiPercent = total > 0 ? (monthlyPMI / total) * 100 : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            {currency === "INR" ? "Home Loan Calculator" : "Mortgage Calculator"}
          </h1>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ShareButton 
              title={currency === "INR" ? "Home Loan Calculator | ApexToolHub" : "Mortgage / Home Loan Calculator | ApexToolHub"} 
              text={currency === "INR" ? "Calculate your home loan EMI repayment breakdown and schedules." : "Calculate your true monthly mortgage payment including taxes, insurance, HOA, and PMI."} 
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
          {currency === "INR" 
            ? "Calculate your monthly home loan EMI payments and view principal/interest split summaries."
            : "Calculate your total monthly home ownership costs, including Principal, Interest, Taxes, Insurance, and HOA."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Home Price</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="home-price-input"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Down Payment</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value ? Number(e.target.value) : "")}
                    className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                    data-testid="down-payment-input"
                  />
                </div>
              </div>
              <p className="text-xs text-muted text-right">
                {Number(homePrice) > 0 ? ((Number(downPayment) / Number(homePrice)) * 100).toFixed(1) : 0}% of Home Price
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Interest Rate</label>
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
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Loan Term (Yr)</label>
                  <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value ? Number(e.target.value) : "")}
                      className="w-16 text-right bg-transparent text-sm font-mono focus:outline-none"
                      data-testid="loan-term-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Ownership Costs Accordion */}
            <div className="border-t border-border pt-4 mt-2">
              <button 
                type="button"
                onClick={() => setShowAdditionalCosts(!showAdditionalCosts)}
                className="w-full flex items-center justify-between text-sm font-semibold text-foreground hover:text-muted transition-colors focus:outline-none"
                data-testid="additional-costs-toggle"
              >
                <span>Additional Monthly Costs (Optional)</span>
                {showAdditionalCosts ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
              </button>
              
              {showAdditionalCosts && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Property Tax / yr</label>
                    <div className="flex items-center border border-border bg-background rounded px-2 py-1">
                      <input
                        type="number"
                        value={propertyTaxYearly}
                        onChange={(e) => setPropertyTaxYearly(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-transparent text-sm font-mono focus:outline-none"
                        data-testid="property-tax-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Insurance / yr</label>
                    <div className="flex items-center border border-border bg-background rounded px-2 py-1">
                      <input
                        type="number"
                        value={homeInsuranceYearly}
                        onChange={(e) => setHomeInsuranceYearly(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-transparent text-sm font-mono focus:outline-none"
                        data-testid="insurance-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">HOA / mo</label>
                    <div className="flex items-center border border-border bg-background rounded px-2 py-1">
                      <input
                        type="number"
                        value={hoaMonthly}
                        onChange={(e) => setHoaMonthly(e.target.value ? Number(e.target.value) : "")}
                        className="w-full bg-transparent text-sm font-mono focus:outline-none"
                        data-testid="hoa-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm flex flex-col h-full">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-6">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Monthly Payment Breakdown
            </h2>
            
            <div className="space-y-4 flex-1">
              <div className="text-center py-6 border-b border-border mb-4">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-1">Est. Monthly Payment</p>
                <p className="text-4xl font-extrabold font-mono text-foreground" data-testid="total-monthly-payment-output">{formatCurrency(totalMonthlyPayment)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-sm text-muted font-medium">Principal & Interest</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground" data-testid="principal-interest-output">{formatCurrency(monthlyPrincipalInterest)}</span>
                </div>
                
                {showAdditionalCosts && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500" />
                        <span className="text-sm text-muted font-medium">Property Taxes</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-foreground" data-testid="property-taxes-output">{formatCurrency(monthlyPropertyTax)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-rose-500" />
                        <span className="text-sm text-muted font-medium">Home Insurance</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-foreground" data-testid="home-insurance-output">{formatCurrency(monthlyHomeInsurance)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-sm text-muted font-medium">HOA Fees</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-foreground" data-testid="hoa-fees-output">{formatCurrency(Number(hoaMonthly) || 0)}</span>
                    </div>

                    {monthlyPMI > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-emerald-500" />
                          <span className="text-sm text-muted font-medium">PMI</span>
                        </div>
                        <span className="text-sm font-bold font-mono text-foreground" data-testid="pmi-output">{formatCurrency(monthlyPMI)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Stacked Bar visualization */}
              <div className="w-full flex h-3 mt-4 rounded-full overflow-hidden bg-muted/20">
                <div style={{ width: `${piPercent}%` }} className="bg-blue-500 h-full" />
                {showAdditionalCosts && (
                  <>
                    <div style={{ width: `${taxPercent}%` }} className="bg-indigo-500 h-full" />
                    <div style={{ width: `${insPercent}%` }} className="bg-rose-500 h-full" />
                    <div style={{ width: `${hoaPercent}%` }} className="bg-amber-500 h-full" />
                    {monthlyPMI > 0 && <div style={{ width: `${pmiPercent}%` }} className="bg-emerald-500 h-full" />}
                  </>
                )}
              </div>
              {showAdditionalCosts && monthlyPMI > 0 && (
                <p className="text-[10px] text-muted text-center mt-2">
                  *PMI applied because down payment is less than 20%.
                </p>
              )}
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
        <h2>How to Use This Mortgage Calculator</h2>
        <p>
          Our mortgage calculator helps you estimate your total monthly payment. A common mistake is budgeting only for the Principal and Interest (P&I) of the loan. In reality, most homeowners also pay for property taxes, home insurance, and possibly Homeowners Association (HOA) fees every month.
        </p>

        <h3>What is PMI?</h3>
        <p>
          Private Mortgage Insurance (PMI) is usually required if you put down less than 20% of the home's purchase price. This insurance protects the lender in case you default on your loan. Once you reach 20% equity in the home, you can usually request to have PMI removed. Our calculator automatically estimates PMI if your down payment is below the 20% threshold.
        </p>

        <h3 id="about-data">About the Data & Accuracy</h3>
        <p>
          The property tax and insurance amounts entered are typically divided by 12 and placed into an escrow account by your lender each month. This calculator assumes a fixed interest rate loan over the specified term. The calculations provided here are estimates. Actual rates, taxes, and insurance premiums will vary based on your location, credit score, and lender. 
        </p>
      </div>

      <div className="border-t border-border pt-8 mt-8">
        <FAQAccordion items={currency === "INR" ? HOME_LOAN_FAQS : MORTGAGE_FAQS} idPrefix="mortgage-faq" renderSchema={false} />
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
