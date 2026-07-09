"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSalaryStore } from "@/store/salaryStore";
import { runLeaveEncashmentEngine, LeaveEncashmentInputs } from "@/lib/engines/leaveEncashmentEngine";
import { runGratuityEngine } from "@/lib/engines/gratuityEngine";
import { runEpfEngine } from "@/lib/engines/epfEngine";
import { estimateEpsPension } from "@/lib/engines/epfEngine";
import { runInsightsEngine } from "@/lib/engines/insightsEngine";
import { useDebounce, canGenerateRetirementSummary } from "@/lib/engines/engineUtils";
import { formatCurrency } from "@/lib/utils";
import ResultActions from "@/components/ResultActions";
import RelatedBenefits, { RelatedBenefitItem } from "@/components/RelatedBenefits";
import { 
  Calculator, Receipt, FileText, CheckCircle2, AlertCircle, 
  TrendingUp, Shield, Wallet, PiggyBank, Briefcase, HelpCircle, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function LeaveEncashmentClient() {
  const store = useSalaryStore();

  // 1. Local States (initialized from global store where possible)
  const [employmentType, setEmploymentType] = useState<"government" | "psu" | "private">("private");
  const [reason, setReason] = useState<"retirement" | "resignation" | "during_service">("retirement");
  
  const initialBasic = Math.round((store.grossSalary * (store.basicPercentage / 100)) / 12);
  const [monthlyBasic, setMonthlyBasic] = useState<string>(String(initialBasic || 80000));
  const [dearnessAllowance, setDearnessAllowance] = useState<string>("0");
  
  const [earnedLeaveBalance, setEarnedLeaveBalance] = useState<string>("120");
  const [leaveAvailed, setLeaveAvailed] = useState<string>("30");
  const [leavesToEncash, setLeavesToEncash] = useState<string>("90");
  const [employerLeavePolicy, setEmployerLeavePolicy] = useState<number>(30);
  
  const [yearsOfService, setYearsOfService] = useState<string>(String(store.yearsOfService || 10));
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("new");
  const [otherIncome, setOtherIncome] = useState<string>(String(store.grossSalary || 1500000));

  // Sync with store on mount
  useEffect(() => {
    if (store.yearsOfService > 0) {
      setYearsOfService(String(store.yearsOfService));
    }
  }, [store.yearsOfService]);

  // Synchronize changes to global store to keep the ecosystem aligned
  const handleYearsChange = (val: string) => {
    setYearsOfService(val);
    const num = Number(val) || 0;
    store.updateField("yearsOfService", num);
  };

  const handleSalaryChange = (val: string) => {
    setMonthlyBasic(val);
    const num = Number(val) || 0;
    // Estimate new gross salary based on basic percentage
    if (num > 0) {
      const estimatedGross = Math.round((num * 12) / (store.basicPercentage / 100));
      store.updateField("grossSalary", estimatedGross);
    }
  };

  // 2. Debouncing inputs to avoid heavy re-computations on every keystroke
  const debouncedInputs = useDebounce<LeaveEncashmentInputs>({
    employmentType,
    reason,
    monthlyBasic: Number(monthlyBasic) || 0,
    dearnessAllowance: Number(dearnessAllowance) || 0,
    earnedLeaveBalance: Number(earnedLeaveBalance) || 0,
    leaveAvailed: Number(leaveAvailed) || 0,
    leavesToEncash: Number(leavesToEncash) || 0,
    employerLeavePolicy,
    yearsOfService: Number(yearsOfService) || 0,
    taxRegime,
    otherIncome: Number(otherIncome) || 0,
  }, 250);

  // Auto-calculate leaves to encash when balance or availed changes
  useEffect(() => {
    const bal = Number(earnedLeaveBalance) || 0;
    const av = Number(leaveAvailed) || 0;
    const diff = Math.max(0, bal - av);
    setLeavesToEncash(String(diff));
  }, [earnedLeaveBalance, leaveAvailed]);

  // 3. Calculation Logic via Pure Engines
  const result = useMemo(() => {
    return runLeaveEncashmentEngine(debouncedInputs);
  }, [debouncedInputs]);

  // Combined intelligence insights
  const insights = useMemo(() => {
    return runInsightsEngine({
      leaveEncashment: result,
      salary: { grossSalary: store.grossSalary, basicPercentage: store.basicPercentage }
    });
  }, [result, store.grossSalary, store.basicPercentage]);

  // Secondary engines calculations for the Retirement Payout summary card
  const retirementSummary = useMemo(() => {
    const salary = Number(monthlyBasic) || 0;
    const da = Number(dearnessAllowance) || 0;
    const totalBasicDA = salary + da;
    const years = Number(yearsOfService) || 0;

    if (!canGenerateRetirementSummary({ salary: totalBasicDA, age: store.age, yearsOfService: years })) {
      return null;
    }

    // A. Gratuity Payout
    const gratuity = runGratuityEngine({
      basicSalary: totalBasicDA,
      years,
      months: 0,
      isCovered: true,
      hikePct: 8,
      yearsToRetire: Math.max(0, store.retirementAge - store.age)
    });

    // B. EPF Payout (using lightweight mode)
    const epf = runEpfEngine({
      basicSalary: totalBasicDA,
      currentBalance: store.currentEpfBalance,
      currentAge: store.age,
      retirementAge: store.retirementAge,
      annualHike: 8,
      epfInterest: store.expectedEpfInterestRate,
      employeePct: store.epfEmployeeValue,
      employerPct: store.epfEmployerValue,
      ignoreEpsCeiling: false,
      serviceYears: years,
      withdrawalReason: "house",
      skipProjection: true
    });

    // C. EPS Pension
    const eps = estimateEpsPension({
      monthlyBasic: totalBasicDA,
      yearsOfService: years
    });

    const totalLumpSum = result.netAmount + gratuity.gratuityAmount + epf.projectedBalance;

    return {
      gratuityAmount: gratuity.gratuityAmount,
      epfCorpus: epf.projectedBalance,
      epsPension: eps.monthlyPension,
      totalLumpSum,
    };
  }, [monthlyBasic, dearnessAllowance, yearsOfService, result.netAmount, store.age, store.retirementAge, store.currentEpfBalance, store.expectedEpfInterestRate, store.epfEmployeeValue, store.epfEmployerValue]);

  // Report structure for data-driven PDF
  const reportData = {
    title: "Leave Encashment Calculator Report",
    inputs: [
      { label: "Employment Type", value: employmentType.toUpperCase() },
      { label: "Encashment Reason", value: reason.replace("_", " ").toUpperCase() },
      { label: "Monthly Basic Salary", value: formatCurrency(Number(monthlyBasic) || 0) },
      { label: "Dearness Allowance (DA)", value: formatCurrency(Number(dearnessAllowance) || 0) },
      { label: "Earned Leave Balance", value: `${earnedLeaveBalance} Days` },
      { label: "Leave Availed", value: `${leaveAvailed} Days` },
      { label: "Leave Being Encashed", value: `${leavesToEncash} Days` },
      { label: "Employer Policy Cap", value: `${employerLeavePolicy} Days/yr` },
      { label: "Years of Service", value: `${yearsOfService} Years` },
      { label: "Tax Regime Selected", value: taxRegime.toUpperCase() },
    ],
    results: [
      { label: "Gross Leave Encashment", value: formatCurrency(result.grossEncashment) },
      { label: "Tax Exempt Amount", value: formatCurrency(result.taxExemptAmount) },
      { label: "Taxable Amount", value: formatCurrency(result.taxableAmount) },
      { label: "Estimated Income Tax", value: formatCurrency(result.estimatedTax) },
      { label: "Net Payout Received", value: formatCurrency(result.netAmount), highlight: true },
    ],
    breakdown: result.calculationSteps.map((step) => ({
      label: step.label,
      value: step.formattedValue,
      formula: step.formula,
    })),
    notes: [
      `Section 10(10AA) Exemption Reason applied: ${result.exemptionBreakdown.exemptReason}`,
      "Note: The statutory limit under Section 10(10AA) for private/non-government employees is capped at ₹25,00,000 effective from April 1, 2023.",
    ],
    engineVersion: "v2026.1",
  };

  const relatedBenefitList: RelatedBenefitItem[] = [
    {
      name: "Gratuity Calculator",
      href: "/calculators/gratuity",
      icon: Briefcase,
      description: "Estimate your tax-free gratuity benefits.",
    },
    {
      name: "EPF Calculator",
      href: "/calculators/pf",
      icon: PiggyBank,
      description: "Project your provident fund retirement accumulations.",
    },
    {
      name: "Income Tax Calculator",
      href: "/calculators/income-tax",
      icon: Receipt,
      description: "Compare tax liability under old and new regimes.",
    },
    {
      name: "Salary Dashboard",
      href: "/dashboard",
      icon: Wallet,
      description: "See a unified 360° overview of your financial portfolio.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Input Forms */}
      <div className="lg:col-span-5 space-y-6">
        <div className="border border-border bg-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-500" /> Input Parameters
          </h2>
          
          <div className="space-y-5">
            {/* Employment Type */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Employment Type</label>
              <div className="grid grid-cols-3 gap-2 bg-muted/30 p-1 rounded-lg">
                {(["government", "psu", "private"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setEmploymentType(type)}
                    className={`py-1.5 text-xs font-semibold rounded-md uppercase transition-all ${
                      employmentType === type ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Encashment Trigger</label>
              <div className="grid grid-cols-3 gap-2 bg-muted/30 p-1 rounded-lg">
                {(["retirement", "resignation", "during_service"] as const).map((trig) => (
                  <button
                    key={trig}
                    onClick={() => setReason(trig)}
                    className={`py-1.5 text-[10px] font-semibold rounded-md uppercase transition-all ${
                      reason === trig ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {trig.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Basic & DA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Monthly Basic</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground font-mono text-xs">₹</span>
                  <input
                    type="text"
                    value={monthlyBasic}
                    onChange={(e) => handleSalaryChange(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                    placeholder="80000"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Dearness Allowance (DA)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground font-mono text-xs">₹</span>
                  <input
                    type="text"
                    value={dearnessAllowance}
                    onChange={(e) => setDearnessAllowance(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Leave Details */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Leave Balance</label>
                <input
                  type="text"
                  value={earnedLeaveBalance}
                  onChange={(e) => setEarnedLeaveBalance(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Leaves Availed</label>
                <input
                  type="text"
                  value={leaveAvailed}
                  onChange={(e) => setLeaveAvailed(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Leaves Encashed</label>
                <input
                  type="text"
                  value={leavesToEncash}
                  onChange={(e) => setLeavesToEncash(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono bg-muted/30"
                  placeholder="90"
                />
              </div>
            </div>

            {/* Policy Cap & Service Years */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block font-sans">Employer Policy Cap</label>
                <select
                  value={employerLeavePolicy}
                  onChange={(e) => setEmployerLeavePolicy(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20"
                >
                  <option value={30}>30 Days / Year</option>
                  <option value={45}>45 Days / Year</option>
                  <option value={60}>60 Days / Year</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Years of Service</label>
                <input
                  type="text"
                  value={yearsOfService}
                  onChange={(e) => handleYearsChange(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Regime and Annual Income */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block font-sans">Tax Regime</label>
                <div className="grid grid-cols-2 gap-1 bg-muted/30 p-1 rounded-lg">
                  {(["old", "new"] as const).map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setTaxRegime(reg)}
                      className={`py-1 text-xs font-semibold rounded uppercase transition-all ${
                        taxRegime === reg ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1 block">Other Income (Annual)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground font-mono text-xs">₹</span>
                  <input
                    type="text"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                    placeholder="1500000"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column: Calculations & Outputs */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Results Overview */}
        <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" /> Leave Encashment Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Gross Payout", val: result.grossEncashment, color: "text-blue-500 bg-blue-500/5" },
              { label: "Tax Exempt", val: result.taxExemptAmount, color: "text-emerald-500 bg-emerald-500/5" },
              { label: "Taxable Portion", val: result.taxableAmount, color: "text-rose-500 bg-rose-500/5" },
              { label: "Estimated Tax", val: result.estimatedTax, color: "text-amber-500 bg-amber-500/5" },
              { label: "Net Payout", val: result.netAmount, color: "text-emerald-600 bg-emerald-600/10 font-bold border border-emerald-500/20 col-span-2 md:col-span-1" },
            ].map((card, i) => (
              <div key={i} className={`p-3.5 rounded-xl flex flex-col justify-center ${card.color}`}>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1 block leading-none">{card.label}</span>
                <span className="text-sm md:text-base font-black font-mono leading-none">{formatCurrency(card.val)}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <ResultActions reportData={reportData} shareParams={{
            employmentType,
            reason,
            monthlyBasic,
            dearnessAllowance,
            earnedLeaveBalance,
            leaveAvailed,
            leavesToEncash,
            employerLeavePolicy,
            yearsOfService,
            taxRegime,
            otherIncome,
          }} />
        </div>

        {/* Calculation Steps table */}
        <div className="border border-border bg-card rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Calculation Steps
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-bold uppercase">
                  <th className="pb-3">Metric</th>
                  <th className="pb-3 text-right">Value</th>
                  <th className="pb-3 hidden md:table-cell pl-4">Methodology</th>
                </tr>
              </thead>
              <tbody>
                {result.calculationSteps.map((step, i) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                    <td className="py-3 font-medium text-foreground">{step.label}</td>
                    <td className="py-3 text-right font-bold font-mono text-zinc-900 dark:text-zinc-100">{step.formattedValue}</td>
                    <td className="py-3 hidden md:table-cell text-xs text-muted-foreground pl-4">{step.formula || "User Input"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 10(10AA) Visual 4-Way Breakdown */}
        {reason !== "during_service" && employmentType !== "government" && (
          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" /> Section 10(10AA) Exemption Limits
            </h3>
            <p className="text-xs text-muted-foreground">
              For private and PSU employees, the exemption is calculated as the <strong>least</strong> of the following four limits:
            </p>

            <div className="space-y-3 font-mono text-sm">
              {[
                { label: "1. Actual Leave Encashment Received", val: result.exemptionBreakdown.actualEncashment },
                { label: "2. Cash Equivalent of Unavailed Leaves (Capped at 30 days/yr)", val: result.exemptionBreakdown.cashEquivalent },
                { label: "3. 10 Months' Average Salary", val: result.exemptionBreakdown.tenMonthsAvgSalary },
                { label: "4. Statutory Government Limit", val: result.exemptionBreakdown.governmentLimit, bold: true },
              ].map((item, idx) => {
                const isSelected = result.exemptionBreakdown.exemptReason.includes(item.label.split(".")[1].trim());
                return (
                  <div 
                    key={idx} 
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all ${
                      isSelected 
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-bold" 
                        : "border-border bg-muted/10 text-muted-foreground"
                    }`}
                  >
                    <span className="font-sans text-xs">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span>{formatCurrency(item.val)}</span>
                      {isSelected && <span className="text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">Least (Applied)</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic AI Insights Feed */}
        {insights.length > 0 && (
          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Intelligent Optimization Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div 
                  key={insight.id} 
                  className={`p-4 rounded-xl border flex gap-3 items-start text-xs ${
                    insight.type === "negative" ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 text-rose-900 dark:text-rose-200" :
                    insight.type === "warning" ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-200" :
                    "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{insight.text}</p>
                    {insight.actionUrl && (
                      <Link href={insight.actionUrl} className="mt-1.5 inline-flex items-center gap-1 font-bold underline hover:opacity-80">
                        Optimize Now <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scenario Comparisons */}
        <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" /> Scenario Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="pb-3">Exit Scenario</th>
                  <th className="pb-3 text-right">Exempt</th>
                  <th className="pb-3 text-right">Taxable</th>
                  <th className="pb-3 text-right">Tax</th>
                  <th className="pb-3 text-right font-bold">Net Payout</th>
                </tr>
              </thead>
              <tbody>
                {result.scenarioComparison.map((scen, i) => (
                  <tr 
                    key={i} 
                    className={`border-b border-border/40 hover:bg-muted/5 transition-all ${
                      scen.isCurrent ? "bg-indigo-500/5 font-semibold text-indigo-600 dark:text-indigo-400 border-l-2 border-l-indigo-500 pl-2" : ""
                    }`}
                  >
                    <td className="py-3 text-foreground font-medium flex items-center gap-1.5">
                      {scen.scenario}
                      {scen.isCurrent && <span className="bg-indigo-500 text-white text-[8px] px-1 py-0.5 rounded uppercase leading-none scale-90">Current</span>}
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-500 font-medium">{formatCurrency(scen.taxExempt)}</td>
                    <td className="py-3 text-right font-mono text-rose-500">{formatCurrency(scen.taxable)}</td>
                    <td className="py-3 text-right font-mono text-amber-500">{formatCurrency(scen.tax)}</td>
                    <td className="py-3 text-right font-mono font-bold text-foreground">{formatCurrency(scen.netAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Note */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p>
            <strong>Note:</strong> The leave encashment exemption limit for non-government employees was increased from ₹3,00,000 to ₹25,00,000, effective from 1 April 2023. The calculator uses the current limit.
          </p>
        </div>

        {/* Killer Feature: Retirement Benefits Summary */}
        {retirementSummary && (
          <div className="border border-border bg-gradient-to-br from-indigo-500/5 via-card to-emerald-500/5 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-indigo-500" /> Estimated Retirement Benefits
            </h3>
            <p className="text-xs text-muted-foreground">
              Based on your monthly salary and years of service, here is a combined summary of all payouts you are projected to receive at retirement:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 border border-border bg-background p-4 rounded-xl">
                <div className="flex justify-between text-xs py-1 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-zinc-500" /> Leave Encashment</span>
                  <span className="font-bold font-mono text-foreground">{formatCurrency(result.netAmount)}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-zinc-500" /> Gratuity</span>
                  <span className="font-bold font-mono text-foreground">{formatCurrency(retirementSummary.gratuityAmount)}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-muted-foreground flex items-center gap-1"><PiggyBank className="w-3.5 h-3.5 text-zinc-500" /> EPF Corpus</span>
                  <span className="font-bold font-mono text-foreground">{formatCurrency(retirementSummary.epfCorpus)}</span>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-border bg-background p-4 rounded-xl">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">EPS Pension Estimate</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                    {formatCurrency(retirementSummary.epsPension)} <span className="text-xs font-normal text-muted-foreground">/ month</span>
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
                    *EPS pension is an estimate based on current EPS rules and assumptions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-foreground/5 rounded-xl gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Total Lump Sum Payout (Leave + Gratuity + EPF)</span>
                <div className="text-2xl font-black font-mono text-foreground">{formatCurrency(retirementSummary.totalLumpSum)}</div>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                Open Ultimate Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Related Benefits panel */}
        <RelatedBenefits currentPage="/calculators/leave-encashment" items={relatedBenefitList} />

      </div>

    </div>
  );
}
