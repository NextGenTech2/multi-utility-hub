"use client";

import React, { useState, useEffect } from "react";
import { runTaxEngine } from "@/lib/engines/tax/taxEngine";
import { generateSalaryStructure } from "@/lib/engines/tax/rules";
import type { CalculatorInputs } from "@/lib/engines/tax/taxEngine";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowRight, Percent, IndianRupee, AlertCircle, Building, Receipt, HandCoins } from "lucide-react";

export default function SalaryHikeClient() {
  const [currentSalary, setCurrentSalary] = useState<string>("1200000");
  const [hikeValue, setHikeValue] = useState<string>("20"); // Default 20%
  const [hikeType, setHikeType] = useState<"percentage" | "amount" | "new_salary">("percentage");
  
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
        books: { enabled: false, declaredAmount: 0 },
        professionalMembership: { enabled: false, declaredAmount: 0 },
        giftVoucher: { enabled: false, declaredAmount: 0 },
        lta: { enabled: false, declaredAmount: 0 },
        uniform: { enabled: false, declaredAmount: 0 },
        newspaper: { enabled: false, declaredAmount: 0 },
        internetEquipment: { enabled: false, declaredAmount: 0 },
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

  if (!currentResults || !newResults) {
    return <div className="h-40 flex items-center justify-center animate-pulse">Calculating...</div>;
  }

  const cSalary = Number(currentSalary) || 0;
  let newSalary = cSalary;
  const val = Number(hikeValue) || 0;
  if (hikeType === "percentage") newSalary = cSalary * (1 + (val / 100));
  else if (hikeType === "amount") newSalary = cSalary + val;
  else newSalary = val;

  const actualHikeAmount = newSalary - cSalary;
  const actualHikePercentage = cSalary > 0 ? (actualHikeAmount / cSalary) * 100 : 0;

  // Use recommended regime for both
  const currentActiveData = currentResults.recommendedRegime === "old" ? currentResults.oldRegime : currentResults.newRegime;
  const newActiveData = newResults.recommendedRegime === "old" ? newResults.oldRegime : newResults.newRegime;

  const taxIncrease = newActiveData.totalTax - currentActiveData.totalTax;
  const takeHomeIncrease = newActiveData.takeHomeSalary - currentActiveData.takeHomeSalary;

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
                <span>Hike Input</span>
              </label>
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
        </div>
      </div>
    </div>
  );
}
