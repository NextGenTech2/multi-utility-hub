"use client";

import React, { useState } from "react";
import { calculateOldRegimeTax } from "@/lib/engines/tax/oldRegime";
import { calculateNewRegimeTax } from "@/lib/engines/tax/newRegime";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowDown, Info, Calendar, PiggyBank, Briefcase, Calculator, TrendingUp } from "lucide-react";
import Link from "next/link";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BONUS_FAQS } from "@/data/financeFaqs";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";

export function BonusClient() {
  const router = useRouter();
  const [annualGrossSalary, setAnnualGrossSalary] = useState<string>("1500000");
  const [bonusAmount, setBonusAmount] = useState<string>("200000");
  const [taxRegime, setTaxRegime] = useState<"new" | "old">("new");
  
  // Advanced Override
  const [overrideTds, setOverrideTds] = useState<boolean>(false);
  const [tdsPercentage, setTdsPercentage] = useState<string>(""); // empty means auto
  
  const [bonusMonth, setBonusMonth] = useState<"march" | "april">("march");

  const grossSalary = Number(annualGrossSalary) || 0;
  const bonus = Number(bonusAmount) || 0;

  const standardDeduction = 50000;
  const baseTaxableIncome = Math.max(0, grossSalary - standardDeduction);
  
  // Tax without bonus
  const taxWithoutBonus = taxRegime === "new" 
    ? calculateNewRegimeTax(baseTaxableIncome).totalTax 
    : calculateOldRegimeTax(baseTaxableIncome).totalTax;

  // Tax with bonus
  const newTaxableIncome = baseTaxableIncome + bonus;
  const taxWithBonus = taxRegime === "new"
    ? calculateNewRegimeTax(newTaxableIncome).totalTax
    : calculateOldRegimeTax(newTaxableIncome).totalTax;

  const actualBonusTax = Math.max(0, taxWithBonus - taxWithoutBonus);
  const effectiveTaxRate = bonus > 0 ? (actualBonusTax / bonus) * 100 : 0;
  
  // Auto TDS: Employer usually estimates based on the marginal bracket or a flat 30%.
  const finalTdsPercent = overrideTds && tdsPercentage ? Number(tdsPercentage) : (effectiveTaxRate > 0 ? effectiveTaxRate : 0);
  
  const tdsDeducted = Math.round(bonus * (finalTdsPercent / 100));
  
  // Refund or Payable
  const expectedRefund = tdsDeducted - actualBonusTax;
  const bankAccount = bonus - tdsDeducted;
  const finalBonusAfterTax = bankAccount + expectedRefund;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  // Timing Advisor
  const fy25Income = bonusMonth === "march" ? grossSalary + bonus : grossSalary;
  const fy26Income = bonusMonth === "april" ? grossSalary + bonus : grossSalary; 

  const marchTotalTax = (taxRegime === "new" ? calculateNewRegimeTax(Math.max(0, grossSalary + bonus - standardDeduction)).totalTax : calculateOldRegimeTax(Math.max(0, grossSalary + bonus - standardDeduction)).totalTax) + 
                        (taxRegime === "new" ? calculateNewRegimeTax(Math.max(0, grossSalary - standardDeduction)).totalTax : calculateOldRegimeTax(Math.max(0, grossSalary - standardDeduction)).totalTax);
  const aprilTotalTax = (taxRegime === "new" ? calculateNewRegimeTax(Math.max(0, grossSalary - standardDeduction)).totalTax : calculateOldRegimeTax(Math.max(0, grossSalary - standardDeduction)).totalTax) + 
                        (taxRegime === "new" ? calculateNewRegimeTax(Math.max(0, grossSalary + bonus - standardDeduction)).totalTax : calculateOldRegimeTax(Math.max(0, grossSalary + bonus - standardDeduction)).totalTax);
  
  const taxDifference = marchTotalTax - aprilTotalTax;

  // Retirement logic (Compound Interest: A = P(1+r)^t)
  const investmentAmount = finalBonusAfterTax;
  const years = 20;
  const mfReturn = 0.12;
  const fdReturn = 0.07;
  
  const mfValue = investmentAmount * Math.pow(1 + mfReturn, years);
  const fdValue = investmentAmount * Math.pow(1 + fdReturn, years);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      
      {/* Header Inputs */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Bonus Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Annual Gross Salary (excluding bonus)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
              <input
                type="number"
                value={annualGrossSalary}
                onChange={(e) => setAnnualGrossSalary(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-lg bg-background font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Bonus Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border rounded-lg bg-background font-medium text-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tax Regime</label>
            <select
              value={taxRegime}
              onChange={(e) => setTaxRegime(e.target.value as "new" | "old")}
              className="w-full px-4 py-2 border rounded-lg bg-background font-medium"
            >
              <option value="new">New Regime (Default)</option>
              <option value="old">Old Regime</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input 
            type="checkbox" 
            id="overrideTds" 
            checked={overrideTds} 
            onChange={(e) => setOverrideTds(e.target.checked)} 
            className="rounded text-primary focus:ring-primary h-4 w-4"
          />
          <label htmlFor="overrideTds" className="text-sm text-muted-foreground cursor-pointer">
            Override Employer TDS % 
          </label>
          <div className="group relative cursor-pointer flex items-center">
            <Info className="w-4 h-4 text-muted-foreground/70" />
            <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-card border border-border text-foreground text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              Employer usually deducts between 20–30% depending on your projected annual income. Adjust this only if your payslip shows a different percentage.
            </div>
          </div>
        </div>
        {overrideTds && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              placeholder="e.g. 30"
              value={tdsPercentage}
              onChange={(e) => setTdsPercentage(e.target.value)}
              className="w-24 px-3 py-1 border rounded bg-background text-sm"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        )}
      </div>

      {/* AI Recommendation Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        expectedRefund > 0 
          ? 'bg-emerald-500/10 border-emerald-500/20' 
          : expectedRefund < 0 
            ? 'bg-red-500/10 border-red-500/20' 
            : 'bg-blue-500/10 border-blue-500/20'
      }`}>
        <div className="shrink-0 mt-0.5">
          <div className={`w-2 h-2 rounded-full mt-2 ${
            expectedRefund > 0 ? 'bg-emerald-500' : expectedRefund < 0 ? 'bg-red-500' : 'bg-blue-500'
          }`} />
        </div>
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-1">
            AI Recommendation
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {expectedRefund > 0 ? (
              <>Your employer deducted slightly more tax than necessary. Based on your salary and the {taxRegime === 'new' ? 'New' : 'Old'} Tax Regime, you are likely to receive an estimated refund of <strong className="text-emerald-600">{formatCurrency(expectedRefund)}</strong> when filing your ITR.</>
            ) : expectedRefund < 0 ? (
              <>Your employer deducted less than your actual liability. Expect to pay <strong className="text-red-600">{formatCurrency(Math.abs(expectedRefund))}</strong> during ITR.</>
            ) : (
              <>Your employer deducted the correct amount. You should not expect a significant refund related to this bonus.</>
            )}
          </p>
        </div>
      </div>

      {/* Your Bonus Journey */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-foreground text-center">Your Bonus Journey</h2>
        <div className="flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
          
          <div className="w-full text-center p-4 bg-primary/10 rounded-xl border border-primary/20 relative">
            <p className="text-sm text-muted-foreground mb-1">Bonus Declared</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(bonus)}</p>
          </div>
          
          <ArrowDown className="text-muted-foreground w-6 h-6" />

          <div className="w-full text-center p-4 bg-muted/50 rounded-xl border">
            <p className="text-sm text-muted-foreground mb-1">Bank Account (After TDS)</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(bankAccount)}</p>
          </div>

          <ArrowDown className="text-muted-foreground w-6 h-6" />

          <div className={`w-full text-center p-4 rounded-xl border ${expectedRefund >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <p className="text-sm text-muted-foreground mb-1">{expectedRefund >= 0 ? 'ITR Refund' : 'Tax Due at ITR'}</p>
            <p className={`text-2xl font-bold ${expectedRefund >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {expectedRefund >= 0 ? '+' : '-'}{formatCurrency(Math.abs(expectedRefund))}
            </p>
          </div>

          <ArrowDown className="text-muted-foreground w-6 h-6" />

          <div className="w-full text-center p-5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl shadow-lg">
            <p className="text-emerald-100 text-sm mb-1 font-medium">Final Bonus After Tax</p>
            <p className="text-3xl font-bold">{formatCurrency(finalBonusAfterTax)}</p>
          </div>

        </div>
      </div>

      {/* Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Effective Tax Rate */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Effective Tax Rate
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Bonus Amount</span>
              <span className="font-semibold">{formatCurrency(bonus)}</span>
            </div>
            <div className="flex justify-between items-center text-rose-600">
              <span>Actual Tax</span>
              <span className="font-semibold">-{formatCurrency(actualBonusTax)}</span>
            </div>
            <div className="pt-3 border-t flex justify-between items-center">
              <span className="font-bold text-foreground">Effective Tax Rate</span>
              <span className="text-xl font-bold text-primary">{effectiveTaxRate.toFixed(1)}%</span>
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg text-sm mt-4 space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Employer Deducted ({finalTdsPercent.toFixed(1)}%)</span>
                <span>{formatCurrency(tdsDeducted)}</span>
              </div>
              <div className="flex justify-between text-foreground font-medium">
                <span>Difference Refunded Later</span>
                <span className={expectedRefund >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatCurrency(expectedRefund)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Breakdown SEO Block */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Bonus Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Salary</span>
              <span>{formatCurrency(grossSalary)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Bonus</span>
              <span>{formatCurrency(bonus)}</span>
            </div>
            <div className="pt-2 border-t flex justify-between font-semibold text-foreground">
              <span>Total Income</span>
              <span>{formatCurrency(grossSalary + bonus)}</span>
            </div>

            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Tax Without Bonus</span>
                <span>{formatCurrency(taxWithoutBonus)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax With Bonus</span>
                <span>{formatCurrency(taxWithBonus)}</span>
              </div>
              <div className="pt-2 flex justify-between font-bold text-foreground bg-primary/5 p-2 rounded">
                <span>Additional Tax Due to Bonus</span>
                <span className="text-primary">{formatCurrency(actualBonusTax)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bonus Timing Advisor */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500/10 p-2 rounded-full">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Bonus Timing Advisor</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          What if your bonus is paid in April (Next Financial Year) instead of March (Current Financial Year)? 
          Delaying your bonus might save you money if it pushes you into a lower tax slab.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-xl border transition-all ${bonusMonth === "march" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 cursor-pointer"}`} onClick={() => setBonusMonth("march")}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Paid in March (FY25)</h3>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${bonusMonth === "march" ? "border-primary" : "border-muted-foreground"}`}>
                {bonusMonth === "march" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">FY25 Taxable Income</span>
                <span className="font-medium">{formatCurrency(Math.max(0, grossSalary + bonus - standardDeduction))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">FY26 Taxable Income</span>
                <span className="font-medium">{formatCurrency(Math.max(0, grossSalary - standardDeduction))}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-base">
                <span>Total Tax (2 Years)</span>
                <span>{formatCurrency(marchTotalTax)}</span>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl border transition-all ${bonusMonth === "april" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 cursor-pointer"}`} onClick={() => setBonusMonth("april")}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Paid in April (FY26)</h3>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${bonusMonth === "april" ? "border-primary" : "border-muted-foreground"}`}>
                {bonusMonth === "april" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">FY25 Taxable Income</span>
                <span className="font-medium">{formatCurrency(Math.max(0, grossSalary - standardDeduction))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">FY26 Taxable Income</span>
                <span className="font-medium">{formatCurrency(Math.max(0, grossSalary + bonus - standardDeduction))}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-base">
                <span>Total Tax (2 Years)</span>
                <span>{formatCurrency(aprilTotalTax)}</span>
              </div>
            </div>
          </div>
        </div>

        {taxDifference !== 0 && (
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-blue-700 dark:text-blue-400">
            {taxDifference > 0 ? (
              <p>Receiving your bonus in <strong>April</strong> saves you <strong>{formatCurrency(taxDifference)}</strong> in taxes over 2 years!</p>
            ) : (
              <p>Receiving your bonus in <strong>March</strong> saves you <strong>{formatCurrency(Math.abs(taxDifference))}</strong> in taxes over 2 years!</p>
            )}
          </div>
        )}
      </div>

      {/* Bonus Impact on Retirement */}
      <div className="bg-card border rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="bg-primary/10 p-2 rounded-full">
            <PiggyBank className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Bonus Impact on Retirement</h2>
            <p className="text-sm text-muted-foreground">If you invest your final net bonus of {formatCurrency(finalBonusAfterTax)} today for 20 years...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mt-8">
          <div className="bg-background rounded-xl p-5 border text-center hover:border-primary/50 transition-colors">
            <h3 className="font-bold text-lg mb-1">Mutual Fund</h3>
            <p className="text-xs text-muted-foreground mb-4">Assumed 12% p.a.</p>
            <p className="text-3xl font-extrabold text-primary">{formatCurrency(mfValue)}</p>
            <p className="text-xs text-muted-foreground mt-2">After 20 years</p>
          </div>
          
          <div className="bg-background rounded-xl p-5 border text-center hover:border-primary/50 transition-colors">
            <h3 className="font-bold text-lg mb-1">Fixed Deposit</h3>
            <p className="text-xs text-muted-foreground mb-4">Assumed 7% p.a.</p>
            <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(fdValue)}</p>
            <p className="text-xs text-muted-foreground mt-2">After 20 years</p>
          </div>

          <div className="bg-muted/30 rounded-xl p-5 border border-dashed text-center">
            <h3 className="font-bold text-lg mb-1 text-muted-foreground">Spend It</h3>
            <p className="text-xs text-muted-foreground mb-4">Instant Gratification</p>
            <p className="text-2xl font-bold text-muted-foreground mt-1">₹0</p>
            <p className="text-xs text-muted-foreground mt-2">Future value</p>
          </div>
        </div>
      </div>

      {/* SEO Articles Section */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm mt-8 space-y-6 text-left no-print">
        <h2 className="text-2xl font-bold text-foreground border-b pb-4">Understanding Bonus Tax in India</h2>
        
        <section>
          <h3 className="text-lg font-bold text-foreground mb-2">Is Bonus Taxable in India?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Yes, any bonus received from your employer is fully taxable in India. Under Section 17(1) of the Income Tax Act, 1961, bonuses are considered a part of your salary ("Profit in lieu of salary"). Whether it is a performance bonus, joining bonus, or a festival bonus like Diwali bonus, it gets added to your gross annual income and is taxed according to your applicable slab rate under the Old or New Tax Regime.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-2">How Bonus Tax is Calculated</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Tax on a bonus isn't calculated at a special flat rate, despite what the TDS deduction might look like on your payslip. The calculation works like this:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Your HR department projects your total annual salary.</li>
            <li>The bonus amount is added on top of this projected salary.</li>
            <li>The total tax liability is calculated on this new, higher gross salary.</li>
            <li>The difference between your original tax liability and the new tax liability is the actual tax on your bonus.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-2">Can I Reduce Tax on My Bonus?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You cannot avoid tax on a bonus, but you can optimize it. If you are in the Old Tax Regime, you can invest the bonus amount in tax-saving instruments like PPF, ELSS, or NPS to claim deductions under Section 80C (up to ₹1.5 Lakh) and Section 80CCD(1B) (additional ₹50,000). Alternatively, if you know a large bonus will push you into a 30% slab, you might ask your employer if the payout can be deferred to the next financial year, assuming your income will be lower then.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-2">Bonus vs Salary: Which Is Better?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            From an income tax standpoint, fixed salary and variable bonuses are taxed identically. However, fixed salary offers better monthly cash flow and allows for tax-exempt flexi-benefits (like meal cards or internet reimbursements) which cannot be applied to lump-sum bonuses. Additionally, fixed salary is what banks look at when approving home or personal loans, whereas variable bonuses are heavily discounted in loan eligibility calculations.
          </p>
        </section>
      </div>

      {/* FAQs */}
      <div className="border-t border-border pt-8 mt-8 no-print text-left">
        <h3 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions (FAQs)</h3>
        <FAQAccordion 
          items={BONUS_FAQS} 
          idPrefix="bonus-tax-faq" 
          renderSchema={false} 
        />
      </div>

      {/* Related Calculators Links */}
      <div className="border-t border-border pt-8 mt-8 text-left no-print">
        <h3 className="text-base font-bold tracking-tight text-foreground mb-6">Explore More Financial Calculators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Salary & Tax</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/calculators/income-tax/" className="text-foreground hover:text-emerald-600 transition-colors">Income Tax Calculator</Link>
              <Link href="/calculators/take-home-salary/" className="text-foreground hover:text-emerald-600 transition-colors">Take Home Salary Calculator</Link>
              <Link href="/calculators/salary-hike/" className="text-foreground hover:text-emerald-600 transition-colors">Salary Hike Calculator</Link>
              <Link href="/calculators/hra/" className="text-foreground hover:text-emerald-600 transition-colors">HRA Calculator</Link>
              <Link href="/dashboard/" className="text-foreground hover:text-emerald-600 transition-colors">Ultimate Salary Dashboard</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Employee Benefits</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/calculators/gratuity/" className="text-foreground hover:text-emerald-600 transition-colors">Gratuity Calculator</Link>
              <Link href="/calculators/leave-encashment/" className="text-foreground hover:text-emerald-600 transition-colors">Leave Encashment Calculator</Link>
              <Link href="/calculators/pf/" className="text-foreground hover:text-emerald-600 transition-colors">PF Calculator</Link>
              <Link href="/calculators/bonus/" className="text-emerald-600 dark:text-emerald-500 hover:underline">Bonus Calculator</Link>
            </div>
          </div>
        </div>
      </div>

      <FinancialDisclaimer />
    </div>
  );
}
