"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calculator, CheckCircle2, AlertCircle, TrendingUp, Shield, Activity, Calendar, HelpCircle, Briefcase, ChevronDown, Download, HeartPulse, ArrowLeft } from "lucide-react";
import { runEpfEngine } from "@/lib/engines/epfEngine";
import { useSalaryStore } from "@/store/salaryStore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function EpfClient() {
  const store = useSalaryStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromDashboard = searchParams.get("from") === "dashboard";

  // Inputs
  const [basicSalary, setBasicSalary] = useState<string>("50000");
  const [currentBalance, setCurrentBalance] = useState<string>("500000");
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [annualHike, setAnnualHike] = useState<number>(8);
  const [epfInterest, setEpfInterest] = useState<number>(8.25);
  
  // Advanced Toggles
  const [ignoreEpsCeiling, setIgnoreEpsCeiling] = useState<boolean>(false);
  const [employeePct, setEmployeePct] = useState<number>(12);
  const [employerPct, setEmployerPct] = useState<number>(12);

  // Load from store on mount
  useEffect(() => {
    if (store.grossSalary) {
      const basic = Math.round(store.grossSalary * (store.basicPercentage / 100) / 12);
      setBasicSalary(String(basic));
      setCurrentBalance(String(store.currentEpfBalance || 0));
      setCurrentAge(store.age || 30);
      setRetirementAge(store.retirementAge || 58);
      setEpfInterest(store.expectedEpfInterestRate || 8.25);
      setEmployeePct(store.epfEmployeeValue || 12);
      setEmployerPct(store.epfEmployerValue || 12);
      setServiceYears(store.yearsOfService || 5);
    }
  }, [store.grossSalary]);

  const handleUpdateDashboard = () => {
    store.updateField("currentEpfBalance", Number(currentBalance) || 0);
    store.updateField("age", currentAge);
    store.updateField("retirementAge", retirementAge);
    store.updateField("expectedEpfInterestRate", epfInterest);
    store.updateField("epfEmployeeValue", employeePct);
    store.updateField("epfEmployerValue", employerPct);
    store.updateField("yearsOfService", serviceYears);
    
    const newBasic = Number(basicSalary) || 0;
    if (newBasic > 0) {
      const estimatedGross = Math.round((newBasic * 12) / (store.basicPercentage / 100));
      store.updateField("grossSalary", estimatedGross);
    }

    router.push("/dashboard");
  };

  // Withdrawal States
  const [withdrawalReason, setWithdrawalReason] = useState<string>("house");
  const [serviceYears, setServiceYears] = useState<number>(6);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const numBasic = Number(basicSalary) || 0;
  const numBalance = Number(currentBalance) || 0;

  // Run the math through the engine
  const projection = useMemo(() => {
    return runEpfEngine({
      basicSalary: numBasic,
      currentBalance: numBalance,
      currentAge,
      retirementAge,
      annualHike,
      epfInterest,
      employeePct,
      employerPct,
      ignoreEpsCeiling,
      serviceYears,
      withdrawalReason: withdrawalReason as any
    });
  }, [numBasic, numBalance, currentAge, retirementAge, annualHike, epfInterest, employeePct, employerPct, ignoreEpsCeiling, serviceYears, withdrawalReason]);

  const {
    employeeEPF,
    employerTotal,
    employerEPS,
    employerEPF,
    totalMonthlyEPF,
    estimatedPension,
    maxWithdrawal,
    isWithdrawalTaxFree,
    healthScore,
    healthScoreText
  } = projection;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
      
      {isFromDashboard && (
        <div className="col-span-12 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
          <div className="text-sm">
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Dashboard</Link>
            <span className="mx-2 text-muted-foreground font-mono">&gt;</span>
            <span className="font-semibold text-foreground">EPF Calculator</span>
            <span className="ml-2.5 text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Editing Dashboard Profile</span>
          </div>
          
          <div className="flex gap-2">
             <button
               onClick={handleUpdateDashboard}
               className="text-xs flex items-center gap-1.5 bg-foreground text-background font-bold transition-all cursor-pointer py-1.5 px-4 rounded-md hover:opacity-90 min-h-[36px]"
             >
               Update Dashboard Profile
             </button>
             <button
               onClick={() => router.push("/dashboard")}
               className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
             >
               <ArrowLeft className="h-3.5 w-3.5" />
               Return
             </button>
          </div>
        </div>
      )}
      
      {/* Left Column: Inputs & Hero */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-500" /> EPF Parameters
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Monthly Basic Salary (+DA)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                <input
                  type="text"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Current EPF Balance (Optional)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                <input
                  type="text"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Expected Hike</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={annualHike}
                    onChange={(e) => setAnnualHike(Number(e.target.value))}
                    className="w-full pl-3 pr-6 py-2.5 rounded-lg border border-border bg-background"
                  />
                  <span className="absolute right-3 text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">EPF Interest</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={epfInterest}
                    onChange={(e) => setEpfInterest(Number(e.target.value))}
                    className="w-full pl-3 pr-6 py-2.5 rounded-lg border border-border bg-background"
                    step="0.01"
                  />
                  <span className="absolute right-3 text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="pt-4 border-t border-border/50">
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={ignoreEpsCeiling} 
                  onChange={(e) => setIgnoreEpsCeiling(e.target.checked)}
                  className="rounded border-border text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="group-hover:text-foreground transition-colors">Ignore ₹15,000 EPS Wage Ceiling</span>
              </label>
            </div>
          </div>
        </div>

        {/* EPF vs EPS Split Visualization */}
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-500"/> Where does the Employer 12% go?</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border font-mono">
              <span className="text-sm font-medium font-sans">Employer 12% Match</span>
              <span className="font-bold">{formatCurrency(employerTotal)}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center -my-2 text-muted-foreground">
              <ChevronDown className="w-4 h-4" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-emerald-500/30 bg-emerald-500/5 rounded-lg text-center">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">EPF Bucket</div>
                <div className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-500">{formatCurrency(employerEPF)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Earns interest</div>
              </div>
              <div className="p-3 border border-blue-500/30 bg-blue-500/5 rounded-lg text-center">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">EPS Pension</div>
                <div className="font-mono font-bold text-lg text-blue-600 dark:text-blue-500">{formatCurrency(employerEPS)}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Capped at ₹1250/mo</div>
              </div>
            </div>
            
            <p className="text-[11px] text-muted-foreground pt-2">
              The employer contributes 12%, but 8.33% (subject to the wage ceiling) is diverted to the Employees' Pension Scheme (EPS). The remainder goes to your regular EPF corpus.
            </p>
          </div>
        </div>

        {/* EPF Health Score */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-border/50 rounded-xl p-6 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-6">
            <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-full bg-background shadow-sm border border-border">
              <span className="text-2xl font-black text-foreground">{healthScore}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Score</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><HeartPulse className={`w-4 h-4 ${healthScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}/> Retirement Health</h3>
              <p className="text-sm font-medium">Your setup is <span className={healthScore >= 80 ? "text-emerald-600" : "text-amber-600"}>{healthScoreText}</span>.</p>
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                {healthScore >= 80 ? (
                  <div className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Excellent compound interest potential.</div>
                ) : (
                  <div className="flex gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-500"/> Consider increasing your basic salary structure to boost compounding.</div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Output & Dashboards */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Real Retirement Dashboard */}
        <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 border-b border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Estimated EPF Corpus at Age {retirementAge}</h3>
            <div className="text-4xl md:text-6xl font-black font-mono drop-shadow-sm mb-6 text-foreground">
              {formatCurrency(projection.projectedBalance)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Your Total Deposits</span>
                <span className="font-bold font-mono">{formatCurrency(projection.totalDeposited)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Total Interest Earned</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(projection.totalInterestEarned)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs mb-1">Total Monthly Inflow</span>
                <span className="font-bold font-mono">{formatCurrency(totalMonthlyEPF)} / mo</span>
              </div>
            </div>
          </div>

          {/* Smart Suggestions / Impact */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4"/> The Power of Compounding</h4>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-500/80">Of your final {formatCurrency(projection.projectedBalance)} corpus, a staggering <strong className="text-emerald-700 dark:text-emerald-400">{Math.round((projection.totalInterestEarned / projection.projectedBalance) * 100)}% is pure interest.</strong></p>
            </div>
          </div>
        </div>

        {/* Withdrawal & Tax Checker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500"/> Withdrawal Checker</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Reason for Withdrawal</label>
                <select 
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                >
                  <option value="house">House Purchase/Construction</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="education">Higher Education / Marriage</option>
                  <option value="unemployment">Unemployment (&gt; 1 month)</option>
                </select>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg border border-border flex justify-between items-center">
                <span className="text-xs font-medium max-w-[120px]">Max Eligible Limit:</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{formatCurrency(maxWithdrawal)}</span>
              </div>
            </div>
          </div>

          <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-500"/> Tax on Withdrawal</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Years of Continuous Service</label>
                <input
                  type="number"
                  value={serviceYears}
                  onChange={(e) => setServiceYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                />
              </div>
              
              <div className={`p-3 rounded-lg border flex justify-between items-center ${serviceYears < 5 ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'}`}>
                <span className="text-xs font-medium">Tax Status:</span>
                <span className={`font-bold ${serviceYears < 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {serviceYears < 5 ? "Taxable (TDS Applies)" : "Tax Free"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* EPS Pension Estimator */}
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500"/> EPS Pension Estimator</h4>
            <p className="text-xs text-muted-foreground">If you complete 10+ years of service, you are eligible for a monthly pension at age 58, completely independent of your EPF balance.</p>
          </div>
          
          <div className="shrink-0 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50 text-center min-w-[160px]">
            <div className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Est. Monthly Pension</div>
            <div className="font-mono font-black text-2xl text-blue-600 dark:text-blue-500">{serviceYears >= 10 ? formatCurrency(estimatedPension) : "₹0"}</div>
            {serviceYears < 10 && <div className="text-[9px] text-blue-600/80 uppercase tracking-wider font-bold mt-1">Requires 10 Yrs Service</div>}
          </div>
        </div>

        {/* Monthly Growth Chart / Timeline */}
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm overflow-hidden">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500"/> Corpus Growth Timeline</h4>
          
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3 text-right">Deposits (Yr)</th>
                  <th className="px-4 py-3 text-right">Interest (Yr)</th>
                  <th className="px-4 py-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {projection.timeline.map((row) => (
                  <tr key={row.year} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium">{row.year}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(row.contribution)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(row.interest)}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {isFromDashboard && (
        <div className="col-span-12 border border-border bg-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm no-print mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-semibold hover:underline flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
          <button
            onClick={handleUpdateDashboard}
            className="px-6 py-2.5 bg-foreground text-background font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Update Dashboard Profile
          </button>
        </div>
      )}
    </div>
  );
}
