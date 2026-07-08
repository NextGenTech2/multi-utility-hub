"use client";

import React, { useEffect, useState } from "react";
import { useSalaryStore } from "@/store/salaryStore";
import { runDashboardEngine } from "@/lib/engines/dashboardEngine";
import { formatCurrency } from "@/lib/utils";
import { 
  Briefcase, TrendingUp, AlertCircle, CheckCircle2, FileText, 
  Wallet, Receipt, Calculator, PiggyBank, HeartPulse, ChevronRight,
  Shield, Download, ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function DashboardClient() {
  const store = useSalaryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-8 text-center animate-pulse">Loading Intelligence Dashboard...</div>;

  // Run the massive dashboard engine
  const { tax, epf, gratuity, optimization } = runDashboardEngine(store);

  // Derive top level numbers based on the recommended regime
  const activeTax = optimization.recommendedRegime === "old" ? tax.oldRegime : tax.newRegime;
  
  // Overall Health Score Badge
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* 1. Hero Section: Executive Summary */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 opacity-50"></div>
        
        <div className="relative p-8 lg:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Ultimate Salary Dashboard</h1>
              <p className="text-muted-foreground">A 360° view of your income, taxes, and retirement wealth.</p>
            </div>
            
            <Link href="/calculators/take-home-salary" className="shrink-0 px-4 py-2 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              Edit Inputs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm font-semibold">
                <Briefcase className="w-4 h-4"/> Gross CTC
              </div>
              <div className="text-3xl font-black font-mono tracking-tight">{formatCurrency(store.grossSalary)}</div>
            </div>
            
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.02)]">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3 text-sm font-semibold">
                <Wallet className="w-4 h-4"/> In-Hand Salary
              </div>
              <div className="text-3xl font-black font-mono tracking-tight text-emerald-700 dark:text-emerald-300">{formatCurrency(activeTax.takeHomeSalary)}</div>
              <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1 font-medium">{formatCurrency(activeTax.takeHomeSalary / 12)} / month</div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-3 text-sm font-semibold">
                <Receipt className="w-4 h-4"/> Total Tax
              </div>
              <div className="text-3xl font-black font-mono tracking-tight text-rose-700 dark:text-rose-300">{formatCurrency(activeTax.totalTax)}</div>
              <div className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1 font-medium">Effective Rate: {activeTax.effectiveTaxRate}%</div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3 text-sm font-semibold">
                <PiggyBank className="w-4 h-4"/> EPF Addition
              </div>
              <div className="text-3xl font-black font-mono tracking-tight text-blue-700 dark:text-blue-300">{formatCurrency(epf.totalMonthlyEPF * 12)}</div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 font-medium">Both Employee + Employer</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Intelligence & Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* The Health Score Card */}
        <div className="lg:col-span-1 border border-border bg-card rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-muted-foreground mb-6 uppercase tracking-widest text-xs">Optimization Score</h3>
          
          <div className="relative mb-6">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" className="stroke-muted fill-none" strokeWidth="12" />
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray={`${(optimization.score.overall / 100) * 440} 440`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">{optimization.score.overall}</span>
              <span className="text-xs text-muted-foreground font-bold mt-1">/ 100</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 px-4">
            Based on {optimization.insights.length} analyzed data points across Tax, EPF, Gratuity, and Allowances.
          </p>

          <div className="w-full space-y-3">
            {[
              { label: "Tax Planning", score: optimization.score.taxPlanning },
              { label: "Retirement", score: optimization.score.retirement },
              { label: "Salary Structure", score: optimization.score.salaryStructure },
              { label: "Payroll Efficiency", score: optimization.score.payrollEfficiency },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center text-sm">
                <span className="font-medium">{item.label}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getScoreColor(item.score)}`}>{item.score}/100</span>
              </div>
            ))}
          </div>
        </div>

        {/* The AI Insights Feed */}
        <div className="lg:col-span-2 border border-border bg-card rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex justify-between items-center">
            <h3 className="font-bold text-foreground flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500"/> Actionable Insights</h3>
            {optimization.totalPotentialSavings > 0 && (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-xs font-bold">
                {formatCurrency(optimization.totalPotentialSavings)} Missed Savings
              </span>
            )}
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
            {optimization.insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-xl border flex gap-4 items-start ${
                  insight.type === 'negative' ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30' :
                  insight.type === 'positive' ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' :
                  'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {insight.type === 'negative' && <AlertCircle className="w-5 h-5 text-rose-500" />}
                  {insight.type === 'positive' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {insight.type === 'neutral' && <Shield className="w-5 h-5 text-blue-500" />}
                </div>
                <div>
                  <p className={`text-sm ${
                    insight.type === 'negative' ? 'text-rose-900 dark:text-rose-200' :
                    insight.type === 'positive' ? 'text-emerald-900 dark:text-emerald-200' :
                    'text-blue-900 dark:text-blue-200'
                  }`}>
                    {insight.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. The Future Timeline (Retirement & Gratuity) */}
      <div className="border border-border bg-card rounded-3xl p-8 shadow-sm">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-rose-500"/> Future Projections</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
            <div className="text-indigo-600 dark:text-indigo-400 font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> EPF at Age {store.retirementAge}</div>
            <div className="text-4xl font-black font-mono text-indigo-700 dark:text-indigo-300 mb-4">{formatCurrency(epf.projectedBalance)}</div>
            <p className="text-xs text-indigo-800/80 dark:text-indigo-200/80">
              By staying invested for {Math.max(0, store.retirementAge - store.age)} more years, your EPF will generate a staggering <strong>{formatCurrency(epf.totalInterestEarned)}</strong> purely in tax-free interest.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="text-amber-600 dark:text-amber-400 font-bold mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Gratuity at Age {store.retirementAge}</div>
            <div className="text-4xl font-black font-mono text-amber-700 dark:text-amber-300 mb-4">{formatCurrency(gratuity.projectedGratuity)}</div>
            <p className="text-xs text-amber-800/80 dark:text-amber-200/80">
              Assuming an 8% annual hike, if you stay with the same employer until retirement, your final payout is estimated at the value above.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
