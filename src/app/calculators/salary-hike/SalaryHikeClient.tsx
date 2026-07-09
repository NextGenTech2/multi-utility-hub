"use client";

import React, { useState, useEffect, useMemo } from "react";
import { runTaxEngine } from "@/lib/engines/tax/taxEngine";
import { generateSalaryStructure } from "@/lib/engines/tax/rules";
import type { CalculatorInputs } from "@/lib/engines/tax/taxEngine";
import { runEpfEngine } from "@/lib/engines/epfEngine";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowRight, Percent, IndianRupee, AlertCircle, Building, Receipt, HandCoins, PiggyBank, CalendarDays, LineChart, Briefcase } from "lucide-react";

export default function SalaryHikeClient() {
  const [currentSalary, setCurrentSalary] = useState<string>("1200000");
  const [hikeValue, setHikeValue] = useState<string>("20"); // Default 20%
  const [hikeType, setHikeType] = useState<"percentage" | "amount" | "new_salary">("percentage");
  
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("58");
  const [expectedHike, setExpectedHike] = useState<string>("10");
  
  const [currentResults, setCurrentResults] = useState<any>(null);
  const [newResults, setNewResults] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInputsPayload = (grossSalary: number): CalculatorInputs => {
    const salaryBreakdown = generateSalaryStructure(grossSalary);
    return {
      grossSalary,
      salaryBreakdown,
      isAdvanced: false,
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
        books: { enabled: false, monthlyAmount: 0 },
        professionalMembership: { enabled: false, monthlyAmount: 0 },
        giftVoucher: { enabled: false, monthlyAmount: 0 },
        lta: { enabled: false, monthlyAmount: 0 },
        uniform: { enabled: false, monthlyAmount: 0 },
        newspaper: { enabled: false, monthlyAmount: 0 },
        internetEquipment: { enabled: false, monthlyAmount: 0 },
      },
      deductions: {
        epf: salaryBreakdown.employerPf,
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
  };

  useEffect(() => {
    const cSalary = Number(currentSalary) || 0;
    
    let newSalary = cSalary;
    const val = Number(hikeValue) || 0;
    
    if (hikeType === "percentage") {
      newSalary = cSalary * (1 + (val / 100));
    } else if (hikeType === "amount") {
      newSalary = cSalary + val;
    } else {
      newSalary = val;
    }

    if (cSalary > 0) {
      setCurrentResults(runTaxEngine(getInputsPayload(cSalary)));
    }
    if (newSalary > 0) {
      setNewResults(runTaxEngine(getInputsPayload(newSalary)));
    }
  }, [currentSalary, hikeValue, hikeType]);

  const cSalary = Number(currentSalary) || 0;
  let newSalary = cSalary;
  const val = Number(hikeValue) || 0;
  if (hikeType === "percentage") newSalary = cSalary * (1 + (val / 100));
  else if (hikeType === "amount") newSalary = cSalary + val;
  else newSalary = val;

  const cAge = Number(currentAge) || 30;
  const rAge = Number(retirementAge) || 58;
  const eHike = Number(expectedHike) || 10;
  
  const currentEpfResult = useMemo(() => {
    return runEpfEngine({
      basicSalary: generateSalaryStructure(cSalary).basic,
      currentBalance: 0,
      currentAge: cAge,
      retirementAge: rAge,
      annualHike: eHike,
      epfInterest: 8.25,
      employeePct: 12,
      employerPct: 12,
      ignoreEpsCeiling: false,
      serviceYears: 0,
      withdrawalReason: "education"
    });
  }, [cSalary, cAge, rAge, eHike]);

  const newEpfResult = useMemo(() => {
    return runEpfEngine({
      basicSalary: generateSalaryStructure(newSalary).basic,
      currentBalance: 0,
      currentAge: cAge,
      retirementAge: rAge,
      annualHike: eHike,
      epfInterest: 8.25,
      employeePct: 12,
      employerPct: 12,
      ignoreEpsCeiling: false,
      serviceYears: 0,
      withdrawalReason: "education"
    });
  }, [newSalary, cAge, rAge, eHike]);

  const projectionTable = useMemo(() => {
    const table = [];
    let projectedGross = newSalary;
    for (let i = 0; i <= 5; i++) {
      if (i > 0) {
        projectedGross = projectedGross * (1 + (eHike / 100));
      }
      
      const taxResult = runTaxEngine(getInputsPayload(projectedGross));
      const activeData = taxResult.recommendedRegime === "old" ? taxResult.oldRegime : taxResult.newRegime;
      
      let balance = 0;
      if (newEpfResult && newEpfResult.timeline && newEpfResult.timeline[i]) {
        balance = newEpfResult.timeline[i].balance;
      }
      
      table.push({
        year: i === 0 ? "Today" : `Year ${i}`,
        ctc: projectedGross,
        inHand: activeData.takeHomeSalary / 12,
        annualTax: activeData.totalTax,
        epfBalance: balance
      });
    }
    return table;
  }, [newSalary, eHike, cAge, rAge, newEpfResult]);

  if (!currentResults || !newResults) {
    return <div className="h-40 flex items-center justify-center animate-pulse">Calculating...</div>;
  }

  const actualHikeAmount = newSalary - cSalary;
  const actualHikePercentage = cSalary > 0 ? (actualHikeAmount / cSalary) * 100 : 0;

  // Use recommended regime for both
  const currentActiveData = currentResults.recommendedRegime === "old" ? currentResults.oldRegime : currentResults.newRegime;
  const newActiveData = newResults.recommendedRegime === "old" ? newResults.oldRegime : newResults.newRegime;

  const taxIncrease = newActiveData.totalTax - currentActiveData.totalTax;
  const takeHomeIncrease = newActiveData.takeHomeSalary - currentActiveData.takeHomeSalary;

  const formatLakhs = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return formatCurrency(val);
  };

  const yearsToRetirement = Math.max(0, rAge - cAge);
  const extraLifetimeEarnings = eHike === 0 
    ? (newActiveData.takeHomeSalary - currentActiveData.takeHomeSalary) * yearsToRetirement 
    : (newActiveData.takeHomeSalary - currentActiveData.takeHomeSalary) * 
      ((Math.pow(1 + (eHike / 100), yearsToRetirement) - 1) / (eHike / 100));

  const stay5Years = currentActiveData.takeHomeSalary * Math.pow(1 + (eHike / 100), 5);
  const switch5Years = newActiveData.takeHomeSalary * Math.pow(1 + (eHike / 100), 5);
  const diff5Years = switch5Years - stay5Years;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
      {/* Left Column: Input */}
      <div className="lg:col-span-5 space-y-6">
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" /> Hike Parameters
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Current Gross CTC</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                <input
                  type="text"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all"
                  placeholder="1200000"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 flex justify-between items-center">
                <span>Hike Scenarios</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "⭐ Average", val: 6 },
                  { label: "⭐⭐ Good", val: 10 },
                  { label: "⭐⭐⭐ Excellent", val: 15 },
                  { label: "⭐⭐⭐⭐ Promotion", val: 25 },
                  { label: "⭐⭐⭐⭐⭐ Switch", val: 40 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => {
                      setHikeType("percentage");
                      setHikeValue(preset.val.toString());
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${hikeType === 'percentage' && hikeValue === preset.val.toString() ? 'bg-emerald-500 text-white shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                  >
                    {preset.label} <span className="opacity-60 ml-1">({preset.val}%)</span>
                  </button>
                ))}
              </div>
              <div className="flex bg-muted/30 p-1 rounded-lg mb-3">
                <button
                  onClick={() => setHikeType("percentage")}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
                    hikeType === "percentage" ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" /> % Hike
                </button>
                <button
                  onClick={() => setHikeType("amount")}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
                    hikeType === "amount" ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Flat Amount
                </button>
                <button
                  onClick={() => setHikeType("new_salary")}
                  className={`flex-1 flex justify-center items-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
                    hikeType === "new_salary" ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <IndianRupee className="w-3.5 h-3.5" /> New CTC
                </button>
              </div>

              <div className="relative flex items-center">
                {hikeType !== "percentage" && <span className="absolute left-4 text-muted-foreground font-mono">₹</span>}
                <input
                  type="text"
                  value={hikeValue}
                  onChange={(e) => setHikeValue(e.target.value.replace(/[^0-9.]/g, ""))}
                  className={`w-full pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all ${hikeType === "percentage" ? "pl-4" : "pl-8"}`}
                  placeholder={hikeType === "percentage" ? "20" : "1500000"}
                />
                {hikeType === "percentage" && <span className="absolute right-4 text-muted-foreground font-mono">%</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-500" /> Career Projections
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Current Age</label>
                <input
                  type="text"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Retirement Age</label>
                <input
                  type="text"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 flex justify-between items-center">
                <span>Expected Annual Hike (%)</span>
              </label>
              <input
                type="text"
                value={expectedHike}
                onChange={(e) => setExpectedHike(e.target.value.replace(/[^0-9.]/g, ""))}
                className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex gap-2 mt-2">
                {[5, 8, 10, 15, 20].map((val) => (
                  <button
                    key={val}
                    onClick={() => setExpectedHike(val.toString())}
                    className="text-[10px] px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors"
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border bg-muted/10 rounded-xl p-5 text-sm text-muted-foreground">
          <p className="flex gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <span>
              Taxes are calculated automatically using the optimal (lowest tax) regime for both your old and new salaries. Standard standard deduction and standard PF applies.
            </span>
          </p>
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7 space-y-6">
        <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 border-b border-border/50">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Salary</h3>
                <div className="text-2xl font-bold font-mono text-foreground">{formatCurrency(cSalary)}</div>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600/70 mb-1">New Salary</h3>
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(newSalary)}</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gross Hike</div>
                <div className="text-xl font-bold font-mono text-emerald-500">+{formatCurrency(actualHikeAmount)}</div>
                <div className="text-xs font-medium text-emerald-500/70 bg-emerald-500/10 inline-block px-1.5 py-0.5 rounded">{actualHikePercentage.toFixed(1)}% Increase</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tax Increase</div>
                <div className="text-xl font-bold font-mono text-rose-500">~{formatCurrency(taxIncrease)}</div>
                <div className="text-xs text-muted-foreground mt-1">Both Old & New Tax</div>
              </div>
              <div className="space-y-1 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500">Take Home Hike (Monthly)</div>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">+{formatCurrency(takeHomeIncrease / 12)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-border bg-background rounded-xl p-4">
                 <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex justify-between items-center">
                   <span>Industry Benchmarks</span>
                   {actualHikePercentage >= 12 && <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">Above Average ✓</span>}
                 </div>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between items-center"><span className="text-muted-foreground">IT Services</span><span className="font-mono">8%</span></div>
                   <div className="flex justify-between items-center"><span className="text-muted-foreground">Product Companies</span><span className="font-mono">12%</span></div>
                   <div className="flex justify-between items-center"><span className="text-muted-foreground">Startup</span><span className="font-mono">15%</span></div>
                   <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center font-bold">
                     <span>Your Hike</span>
                     <span className="font-mono text-emerald-500">{actualHikePercentage.toFixed(1)}%</span>
                   </div>
                 </div>
              </div>

              <div className="border border-border bg-background rounded-xl p-4 flex flex-col justify-between">
                 <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Inflation Reality Check</div>
                 <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-muted-foreground">Hike Percentage</span>
                     <span className="font-mono">{actualHikePercentage.toFixed(1)}%</span>
                   </div>
                   <div className="flex justify-between items-center text-sm text-rose-500">
                     <span>Current Inflation</span>
                     <span className="font-mono">-5.0%</span>
                   </div>
                   <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-center font-bold">
                     <span>Real Salary Growth</span>
                     <span className={`font-mono ${(actualHikePercentage - 5) > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                       {(actualHikePercentage - 5).toFixed(1)}%
                     </span>
                   </div>
                 </div>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-4 border-b border-border/30 pb-2">Monthly In-Hand Comparison</h4>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <HandCoins className="w-4 h-4 text-emerald-500" />
                  <span className="font-sans text-muted-foreground">Gross Monthly</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground w-24 text-right">{formatCurrency(cSalary / 12)}</span>
                  <ArrowRight className="w-3 h-3 text-border" />
                  <span className="font-bold w-24 text-right">{formatCurrency(newSalary / 12)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-500" />
                  <span className="font-sans text-muted-foreground">PF Deductions (Er + Ee)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground w-24 text-right">-{formatCurrency((generateSalaryStructure(cSalary).employerPf * 2) / 12)}</span>
                  <ArrowRight className="w-3 h-3 text-border" />
                  <span className="text-amber-500 w-24 text-right">-{formatCurrency((generateSalaryStructure(newSalary).employerPf * 2) / 12)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-rose-500" />
                  <span className="font-sans text-muted-foreground">Income Tax (TDS)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground w-24 text-right">-{formatCurrency(currentActiveData.totalTax / 12)}</span>
                  <ArrowRight className="w-3 h-3 text-border" />
                  <span className="text-rose-500 w-24 text-right">-{formatCurrency(newActiveData.totalTax / 12)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-foreground">Final In-Hand Salary</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-muted-foreground w-24 text-right text-base">{formatCurrency(currentActiveData.takeHomeSalary / 12)}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 w-24 text-right text-lg">{formatCurrency(newActiveData.takeHomeSalary / 12)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Retirement Impact Widget */}
          <div className="p-6 md:p-8 border-t border-border/50 bg-indigo-50/30 dark:bg-indigo-950/10">
             <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
               <PiggyBank className="h-5 w-5 text-indigo-500" /> Retirement Impact (at Age {rAge})
             </h4>
             <p className="text-sm text-muted-foreground mb-6">
               A higher salary doesn't just mean more cash today—it massively impacts your final EPF corpus due to compounding.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <div className="border border-border bg-background rounded-xl p-4">
                   <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Without Hike</div>
                   <div className="text-2xl font-black font-mono text-foreground">{formatLakhs(currentEpfResult.projectedBalance)}</div>
                </div>
                <div className="border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4">
                   <div className="text-xs text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-widest mb-1">With Hike</div>
                   <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">{formatLakhs(newEpfResult.projectedBalance)}</div>
                </div>
                <div className="border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 flex flex-col justify-center">
                   <div className="text-[10px] text-emerald-700 dark:text-emerald-500 uppercase font-bold tracking-widest mb-1">Wealth Created</div>
                   <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">+{formatLakhs(newEpfResult.projectedBalance - currentEpfResult.projectedBalance)}</div>
                </div>
             </div>
          </div>
          {/* Lifetime Earnings Impact */}
          <div className="p-6 md:p-8 border-t border-border/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-amber-500" /> Lifetime Earnings Impact
             </h4>
             <p className="text-sm text-muted-foreground mb-4">
               People underestimate compounding. If your future hikes continue from this higher base, here is your extra lifetime earnings by age {rAge}:
             </p>
             <div className="text-4xl md:text-5xl font-black font-mono text-amber-600 dark:text-amber-500">
               +{formatLakhs(extraLifetimeEarnings)}
             </div>
          </div>
          
          {/* 5-Year Projection Table */}
          <div className="p-6 md:p-8 border-t border-border/50">
             <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
               <LineChart className="h-5 w-5 text-emerald-500" /> Your Next 5 Years
             </h4>
             <p className="text-sm text-muted-foreground mb-6">
               Projected financial journey assuming a {eHike}% annual increment each year.
             </p>
             
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                   <tr>
                     <th className="px-4 py-3 rounded-l-lg">Timeline</th>
                     <th className="px-4 py-3">CTC</th>
                     <th className="px-4 py-3">Monthly In-Hand</th>
                     <th className="px-4 py-3">Annual Tax</th>
                     <th className="px-4 py-3 rounded-r-lg">EPF Balance</th>
                   </tr>
                 </thead>
                 <tbody className="font-mono">
                   {projectionTable.map((row, idx) => (
                     <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                       <td className="px-4 py-3 font-sans font-semibold text-foreground">{row.year}</td>
                       <td className="px-4 py-3">{formatLakhs(row.ctc)}</td>
                       <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">{formatLakhs(row.inHand)}</td>
                       <td className="px-4 py-3 text-rose-500">{formatLakhs(row.annualTax)}</td>
                       <td className="px-4 py-3 text-indigo-500">{formatLakhs(row.epfBalance)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
              </div>
          </div>
          
          {/* Promotion vs Job Switch */}
          <div className="p-6 md:p-8 border-t border-border/50 bg-blue-50/50 dark:bg-blue-950/20">
             <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
               <Briefcase className="h-5 w-5 text-blue-500" /> Stay vs. Switch (5 Year Impact)
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="border border-border bg-background rounded-xl p-4">
                   <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Stay (Current Base)</div>
                   <div className="text-xl font-bold font-mono text-foreground mb-1">{formatLakhs(stay5Years)}</div>
                   <div className="text-xs text-muted-foreground">Salary after 5 years</div>
                </div>
                <div className="border border-blue-500/30 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                   <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold tracking-widest mb-1">Switch (New Base)</div>
                   <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mb-1">{formatLakhs(switch5Years)}</div>
                   <div className="text-xs text-muted-foreground">Salary after 5 years</div>
                </div>
             </div>
             <div className="bg-background rounded-lg p-3 text-center border border-border">
                <span className="text-muted-foreground text-sm">Wealth Difference: </span>
                <span className="font-bold font-mono text-blue-500 text-lg">+{formatLakhs(diff5Years)}/year</span>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
