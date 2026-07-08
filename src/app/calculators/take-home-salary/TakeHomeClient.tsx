"use client";

import React, { useState, useEffect } from "react";
import { runTaxEngine } from "@/lib/engines/tax/taxEngine";
import { generateSalaryStructure } from "@/lib/engines/tax/rules";
import type { CalculatorInputs } from "@/lib/engines/tax/taxEngine";
import { Calculator, Wallet, Check, AlertCircle, Building, User, Receipt, Percent, Printer, Calendar, TrendingUp, Lightbulb, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Link from "next/link";

const INDIAN_STATES = [
  { id: "delhi", name: "Delhi (₹0/yr)", pt: 0 },
  { id: "karnataka", name: "Karnataka (₹200/mo)", pt: 2400 },
  { id: "maharashtra", name: "Maharashtra (₹200/mo, ₹300 Feb)", pt: 2500 },
  { id: "tamil_nadu", name: "Tamil Nadu (₹208/mo)", pt: 2500 },
  { id: "telangana", name: "Telangana (₹200/mo)", pt: 2400 },
  { id: "west_bengal", name: "West Bengal (₹200/mo)", pt: 2400 },
  { id: "other_2400", name: "Other (₹200/mo)", pt: 2400 },
  { id: "other_0", name: "Other (No PT)", pt: 0 },
];

export default function TakeHomeClient() {
  const [income, setIncome] = useState<string>("1200000");
  const [selectedRegime, setSelectedRegime] = useState<"auto" | "new" | "old">("auto");
  const [selectedState, setSelectedState] = useState(INDIAN_STATES[1]); // Default Karnataka
  const [results, setResults] = useState<any>(null);
  
  // Advanced Options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customBonus, setCustomBonus] = useState<string>("0");
  const [overrideBasic, setOverrideBasic] = useState<string>("");
  const [overrideHra, setOverrideHra] = useState<string>("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const grossSalary = Number(income) || 0;
    const bonus = Number(customBonus) || 0;
    
    // Auto generate or use overrides
    const baseBreakdown = generateSalaryStructure(grossSalary);
    if (Number(overrideBasic) > 0) baseBreakdown.basic = Number(overrideBasic);
    if (Number(overrideHra) > 0) baseBreakdown.hra = Number(overrideHra);
    baseBreakdown.bonus = bonus; // Add annual bonus

    const inputs: CalculatorInputs = {
      grossSalary: grossSalary + bonus, // Total taxable
      salaryBreakdown: baseBreakdown,
      isAdvanced: true,
      flexiBenefits: {
        vehicleBenefitType: "none",
        vehicleMaintenanceAmount: 0,
        employerNps: { enabled: false, monthlyAmount: 0 },
        foodCoupon: { enabled: false, monthlyAmount: 0 },
        internet: { enabled: false, monthlyAmount: 0 },
        mobile: { enabled: false, monthlyAmount: 0 },
        telephone: { enabled: false, monthlyAmount: 0 },
        fuel: { enabled: false, monthlyAmount: 0 },
        driver: { enabled: false, monthlyAmount: 0 },
        books: { enabled: false, declaredAmount: 0 },
        professionalMembership: { enabled: false, declaredAmount: 0 },
        giftVoucher: { enabled: false, declaredAmount: 0 },
        lta: { enabled: false, declaredAmount: 0 },
        uniform: { enabled: false, declaredAmount: 0 },
        newspaper: { enabled: false, declaredAmount: 0 },
        internetEquipment: { enabled: false, declaredAmount: 0 },
      },
      deductions: {
        epf: baseBreakdown.employerPf, // Standard assumption: EE matches ER
        ppf: 0,
        elss: 0,
        lifeInsurance: 0,
        taxSaverFd: 0,
        npsSelf: 0,
        healthInsurance: 0,
        homeLoanInterest: 0,
        educationLoan: 0,
        donations: 0
      },
      rentPaid: 0,
      isMetro: true
    };

    const calculated = runTaxEngine(inputs);
    setResults(calculated);
  }, [income, customBonus, overrideBasic, overrideHra]);

  if (!results) return <div className="h-40 flex items-center justify-center animate-pulse">Calculating...</div>;

  const grossSalary = Number(income) || 0;
  const bonus = Number(customBonus) || 0;
  const totalCtc = grossSalary + bonus;

  const activeRegime = selectedRegime === "auto" ? results.recommendedRegime : selectedRegime;
  const activeRegimeData = activeRegime === "old" ? results.oldRegime : results.newRegime;
  
  // Salary Breakdown properties
  const baseBreakdown = generateSalaryStructure(grossSalary);
  if (Number(overrideBasic) > 0) baseBreakdown.basic = Number(overrideBasic);
  if (Number(overrideHra) > 0) baseBreakdown.hra = Number(overrideHra);
  baseBreakdown.bonus = bonus;

  const employerPf = baseBreakdown.employerPf || 0;
  const employeePf = baseBreakdown.employerPf || 0; // standard assumption EE = ER
  const professionalTax = selectedState.pt;
  const incomeTax = activeRegimeData.totalTax;

  // Final math
  const totalDeductionsYearly = employerPf + employeePf + professionalTax + incomeTax;
  const takeHomeYearly = totalCtc - totalDeductionsYearly;
  const takeHomeMonthly = takeHomeYearly / 12;

  // Ratios & Percentages
  const takeHomePct = totalCtc > 0 ? (takeHomeYearly / totalCtc) * 100 : 0;
  const taxPct = totalCtc > 0 ? (incomeTax / totalCtc) * 100 : 0;
  const pfPct = totalCtc > 0 ? ((employerPf + employeePf) / totalCtc) * 100 : 0;
  const ptPct = totalCtc > 0 ? (professionalTax / totalCtc) * 100 : 0;
  
  const netSalaryRatio = totalCtc > 0 ? ((takeHomeYearly + employeePf) / totalCtc) * 100 : 0; // Take home + personal PF saving

  // Smart Suggestions
  const suggestions = [];
  const taxDiff = Math.abs(results.oldRegime.totalTax - results.newRegime.totalTax);
  if (results.recommendedRegime !== activeRegime && taxDiff > 0) {
    suggestions.push(`Switch to the ${results.recommendedRegime === 'new' ? 'New' : 'Old'} Tax Regime to save ${formatCurrency(taxDiff)} instantly.`);
  } else if (taxDiff > 0) {
    suggestions.push(`You have selected the most optimal tax regime! It saves you ${formatCurrency(taxDiff)} compared to the alternative.`);
  }
  if (activeRegime === "new") {
    suggestions.push("HRA exemption is NOT applicable under the New Tax Regime. If you pay high rent, the Old Regime might be better.");
  }
  if (incomeTax > 100000) {
    suggestions.push(`Opting for Employer NPS via corporate structuring could save you up to 30% on the contributed amount.`);
  }

  // Quick Hike Preview logic
  const hikePreviews = [10, 20, 30].map(pct => {
    const newGross = totalCtc * (1 + (pct/100));
    // Super fast approximation for UI preview (not exact engine)
    const newTax = newGross > 700000 ? (newGross - 700000) * 0.2 : 0; // rough generic approx for preview
    const actualTakeHomeIncrease = (newGross - totalCtc) * 0.7; // assume ~30% goes to tax+PF
    return { pct, increase: actualTakeHomeIncrease / 12 };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 printable-area">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}} />

      {/* Left Column: Input */}
      <div className="lg:col-span-5 space-y-6 no-print">
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-500" /> CTC Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Gross Yearly CTC</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                <input
                  type="text"
                  value={income}
                  onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all"
                  placeholder="e.g. 1200000"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex gap-1 items-start">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-70" />
                <span>CTC is assumed to include employer PF and other employer-paid benefits. If your offer letter defines CTC differently, actual take-home may vary.</span>
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Preferred Tax Regime</label>
              <div className="flex bg-muted/30 p-1 rounded-lg">
                {(["auto", "new", "old"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegime(r)}
                    className={`flex-1 capitalize py-2 text-sm font-medium rounded-md transition-all ${
                      selectedRegime === r 
                        ? "bg-foreground text-background shadow" 
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {r === "auto" ? "Auto (Best)" : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-muted-foreground" /> State (Professional Tax)
              </label>
              <select 
                value={selectedState.id}
                onChange={(e) => setSelectedState(INDIAN_STATES.find(s => s.id === e.target.value) || INDIAN_STATES[0])}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 text-sm"
              >
                {INDIAN_STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            {/* Advanced Options Accordion */}
            <div className="pt-2 border-t border-border/50">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex justify-between items-center py-2 text-sm font-semibold text-foreground"
              >
                <span>Advanced Salary Components</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showAdvanced && (
                <div className="space-y-4 mt-4 bg-muted/20 p-4 rounded-lg border border-border/50">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Annual Bonus (Performance/Variable)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-muted-foreground font-mono text-sm">₹</span>
                      <input
                        type="text"
                        value={customBonus}
                        onChange={(e) => setCustomBonus(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full pl-7 pr-3 py-2 rounded-md border border-border bg-background font-mono text-sm"
                        placeholder="e.g. 200000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Override Basic</label>
                      <input
                        type="text"
                        value={overrideBasic}
                        onChange={(e) => setOverrideBasic(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm"
                        placeholder="Auto (40%)"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Override HRA</label>
                      <input
                        type="text"
                        value={overrideHra}
                        onChange={(e) => setOverrideHra(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm"
                        placeholder="Auto (50%)"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Quick Salary Hike Preview */}
        <div className="border border-border bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-5 border-l-4 border-l-emerald-500">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" /> Expecting an Appraisal?
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {hikePreviews.map((hp) => (
              <div key={hp.pct} className="bg-background/80 dark:bg-background/40 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-2 text-center">
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">{hp.pct}% HIKE</div>
                <div className="text-xs font-mono font-bold mt-1 text-foreground">+{formatCurrency(hp.increase)}<span className="text-[9px] font-sans text-muted-foreground">/mo</span></div>
              </div>
            ))}
          </div>
          <Link href="/calculators/salary-hike" className="text-xs font-semibold text-emerald-700 dark:text-emerald-500 hover:underline flex items-center justify-between w-full">
            <span>Open Full Salary Hike Calculator</span> <span>→</span>
          </Link>
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Title for Print */}
        <div className="hidden print:block mb-6 border-b pb-4">
          <h1 className="text-3xl font-black">Annual Salary Summary</h1>
          <p className="text-muted-foreground mt-1">Generated by Multi-Utility Hub.</p>
        </div>

        <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
          
          {/* Top Control Bar */}
          <div className="px-6 py-3 border-b border-border/50 flex justify-between items-center bg-muted/20">
            <div className="text-sm font-medium text-muted-foreground">
              Tax Regime Applied: <strong className="text-foreground capitalize">{activeRegime}</strong>
            </div>
            <button 
              onClick={() => window.print()}
              className="p-1.5 bg-background border rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-all no-print flex items-center gap-2 text-xs font-medium"
              title="Download Salary Slip Summary"
            >
              <Printer className="w-3.5 h-3.5" /> <span>Download Slip</span>
            </button>
          </div>

          <div className="p-6 md:p-8">
            
            {/* Core Metrics: Monthly & Annual Side-by-Side */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 border-b border-border/50 pb-8">
              <div className="text-center md:text-left border-r border-border/50 pr-4 md:pr-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600/70 mb-2">Monthly In-Hand</h3>
                <div className="text-3xl md:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                  {formatCurrency(takeHomeMonthly)}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Annual In-Hand</h3>
                <div className="text-2xl md:text-4xl font-bold font-mono text-foreground">
                  {formatCurrency(takeHomeYearly)}
                </div>
              </div>
            </div>

            {/* Smart Suggestions Advisor */}
            {suggestions.length > 0 && (
              <div className="mb-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 no-print">
                <h4 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-2 text-sm">
                  <Lightbulb className="w-4 h-4" /> AI Tax Advisor Insights
                </h4>
                <ul className="space-y-1.5 text-sm text-blue-900/80 dark:text-blue-200/70">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Distribution Visual (Stacked Bar) */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <h4 className="font-semibold text-foreground">Salary Distribution</h4>
                <div className="text-xs text-muted-foreground">CTC: {formatCurrency(totalCtc)} (100%)</div>
              </div>
              
              <div className="h-6 w-full rounded-full overflow-hidden flex bg-muted shadow-inner">
                {takeHomePct > 0 && <div className="h-full bg-emerald-500" style={{width: `${takeHomePct}%`}} title={`Take Home: ${takeHomePct.toFixed(1)}%`} />}
                {taxPct > 0 && <div className="h-full bg-rose-500" style={{width: `${taxPct}%`}} title={`Income Tax: ${taxPct.toFixed(1)}%`} />}
                {pfPct > 0 && <div className="h-full bg-amber-500" style={{width: `${pfPct}%`}} title={`PF Contributions: ${pfPct.toFixed(1)}%`} />}
                {ptPct > 0 && <div className="h-full bg-blue-500" style={{width: `${ptPct}%`}} title={`Professional Tax: ${ptPct.toFixed(1)}%`} />}
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /> Take Home ({takeHomePct.toFixed(1)}%)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-rose-500" /> Income Tax ({taxPct.toFixed(1)}%)</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500" /> PF ({pfPct.toFixed(1)}%)</div>
                {ptPct > 0 && <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /> PT ({ptPct.toFixed(1)}%)</div>}
              </div>
            </div>

            {/* Timeline / Waterfall Breakdown */}
            <h4 className="font-semibold text-foreground mb-4">Monthly Salary Timeline</h4>
            <div className="space-y-0 font-mono text-sm relative before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
              
              {/* Gross */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
                <div className="flex items-center justify-end w-full md:w-1/2 md:pr-8 md:group-odd:pl-8 md:group-odd:pr-0 md:group-odd:justify-start">
                  <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm w-full max-w-[280px]">
                    <div className="text-xs font-sans text-muted-foreground mb-1 flex items-center gap-1.5"><Building className="w-3 h-3"/> Gross Monthly</div>
                    <div className="font-bold text-foreground text-lg">{formatCurrency(totalCtc / 12)}</div>
                  </div>
                </div>
                <div className="w-10 h-10 absolute left-0 md:left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shadow-sm z-10 hidden sm:flex">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* PF Deductions */}
              {(employerPf > 0 || employeePf > 0) && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
                  <div className="flex items-center justify-end w-full md:w-1/2 md:pr-8 md:group-odd:pl-8 md:group-odd:pr-0 md:group-odd:justify-start">
                    <div className="bg-card p-3 rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 shadow-sm w-full max-w-[280px]">
                      <div className="text-xs font-sans text-amber-700 dark:text-amber-500/70 mb-1 flex items-center gap-1.5"><User className="w-3 h-3"/> PF Deductions (Er + Ee)</div>
                      <div className="font-bold text-amber-600 dark:text-amber-500 text-base">-{formatCurrency((employerPf + employeePf) / 12)}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 absolute left-0 md:left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm z-10 hidden sm:flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                </div>
              )}

              {/* PT */}
              {professionalTax > 0 && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
                  <div className="flex items-center justify-end w-full md:w-1/2 md:pr-8 md:group-odd:pl-8 md:group-odd:pr-0 md:group-odd:justify-start">
                    <div className="bg-card p-3 rounded-xl border border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/10 shadow-sm w-full max-w-[280px]">
                      <div className="text-xs font-sans text-blue-700 dark:text-blue-500/70 mb-1 flex items-center gap-1.5"><Percent className="w-3 h-3"/> Professional Tax</div>
                      <div className="font-bold text-blue-600 dark:text-blue-500 text-base">-{formatCurrency(professionalTax / 12)}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 absolute left-0 md:left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm z-10 hidden sm:flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                </div>
              )}

              {/* TDS */}
              {incomeTax > 0 && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
                  <div className="flex items-center justify-end w-full md:w-1/2 md:pr-8 md:group-odd:pl-8 md:group-odd:pr-0 md:group-odd:justify-start">
                    <div className="bg-card p-3 rounded-xl border border-rose-500/20 bg-rose-50/30 dark:bg-rose-950/10 shadow-sm w-full max-w-[280px]">
                      <div className="text-xs font-sans text-rose-700 dark:text-rose-500/70 mb-1 flex items-center gap-1.5"><Receipt className="w-3 h-3"/> Income Tax (TDS)</div>
                      <div className="font-bold text-rose-600 dark:text-rose-500 text-base">-{formatCurrency(incomeTax / 12)}</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 absolute left-0 md:left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shadow-sm z-10 hidden sm:flex">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </div>
                </div>
              )}

              {/* NET */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3 mt-4">
                <div className="flex items-center justify-end w-full md:w-1/2 md:pr-8 md:group-odd:pl-8 md:group-odd:pr-0 md:group-odd:justify-start">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 shadow-md w-full max-w-[280px]">
                    <div className="text-xs font-sans font-bold text-emerald-700 dark:text-emerald-500/70 mb-1 uppercase tracking-widest">Final Net Pay</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-2xl">{formatCurrency(takeHomeMonthly)}</div>
                  </div>
                </div>
                <div className="w-12 h-12 absolute left-0 md:left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-emerald-500 flex items-center justify-center shadow-md z-10 hidden sm:flex">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>

            </div>
            
            {/* Tax Calendar */}
            <div className="mt-12 pt-8 border-t border-border/50 no-print">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Monthly Tax Calendar</h4>
              <p className="text-xs text-muted-foreground mb-4">Assuming standard distribution, your TDS deduction schedule from April to March.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-center">
                {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((month, i) => {
                  let monthlyPt = professionalTax / 12;
                  if (selectedState.id === "maharashtra") {
                    monthlyPt = month === "Feb" ? 300 : 200;
                  }
                  const tTds = incomeTax / 12;
                  
                  return (
                    <div key={month} className="bg-muted/30 border border-border/50 rounded-lg p-2 hover:bg-muted transition-colors">
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{month}</div>
                      <div className="text-xs font-mono font-medium text-rose-500">-{formatCurrency(tTds + monthlyPt)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extra Metrics Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Effective Tax Rate</div>
                <div className="text-lg font-mono font-bold text-foreground">{taxPct.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Net Salary Ratio</div>
                <div className="text-lg font-mono font-bold text-emerald-600">{netSalaryRatio.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Employer Cost</div>
                <div className="text-lg font-mono font-bold text-foreground">{formatCurrency(totalCtc)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">You Receive</div>
                <div className="text-lg font-mono font-bold text-emerald-600">{takeHomePct.toFixed(1)}%</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
