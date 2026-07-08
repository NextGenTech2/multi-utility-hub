"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Calculator, CheckCircle2, AlertCircle, TrendingUp, Clock, Calendar, HelpCircle, Briefcase, FileText } from "lucide-react";
import { runGratuityEngine } from "@/lib/engines/gratuityEngine";

export default function GratuityClient() {
  const [basicSalary, setBasicSalary] = useState<string>("100000");
  const [years, setYears] = useState<number>(4);
  const [months, setMonths] = useState<number>(7);
  const [isCovered, setIsCovered] = useState<boolean>(true);

  const [showProjection, setShowProjection] = useState<boolean>(false);
  const [hikePct, setHikePct] = useState<number>(8);
  const [yearsToRetire, setYearsToRetire] = useState<number>(20);

  const formatCurr = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const salary = Number(basicSalary) || 0;
  
  const engineResult = React.useMemo(() => {
    return runGratuityEngine({
      basicSalary: salary,
      years,
      months,
      isCovered,
      hikePct,
      yearsToRetire
    });
  }, [salary, years, months, isCovered, hikePct, yearsToRetire]);

  const {
    roundedYears,
    divisor,
    isEligible,
    gratuityAmount,
    projectedGratuity,
    timeline,
    monthsNeeded,
    scenarioAmount
  } = engineResult;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
      
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-6">
        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-500" /> Service Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Last Drawn Salary (Basic + DA)</label>
              <div className="relative flex items-center mb-2">
                <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                <input
                  type="text"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all"
                  placeholder="e.g. 100000"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Only include Basic Salary and Dearness Allowance. Exclude HRA, PF, or Special Allowances.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Years of Service</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Months</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <label className="text-sm font-semibold text-foreground mb-3 block">Are you covered under the Gratuity Act?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsCovered(true)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-all ${
                    isCovered 
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm" 
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-bold">Yes, Covered</span>
                  <span className="text-[10px] opacity-80">(Uses 15/26 Formula)</span>
                </button>
                <button
                  onClick={() => setIsCovered(false)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-all ${
                    !isCovered 
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm" 
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-bold">Not Covered</span>
                  <span className="text-[10px] opacity-80">(Uses 15/30 Formula)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Future Projection Toggle */}
        <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
          <button 
            onClick={() => setShowProjection(!showProjection)}
            className="w-full flex justify-between items-center text-sm font-semibold text-foreground group"
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Future Gratuity Projection
            </span>
            <span className="text-xs px-2 py-1 bg-muted rounded group-hover:bg-muted-foreground/20 transition-colors">
              {showProjection ? "Hide" : "Calculate"}
            </span>
          </button>
          
          {showProjection && (
            <div className="mt-5 space-y-4 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Expected Annual Hike</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={hikePct}
                      onChange={(e) => setHikePct(Number(e.target.value))}
                      className="w-full pl-3 pr-6 py-2 rounded-md border border-border bg-background text-sm"
                    />
                    <span className="absolute right-3 text-muted-foreground font-mono text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Years to Retirement</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={yearsToRetire}
                      onChange={(e) => setYearsToRetire(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50 flex justify-between items-center">
                <div className="text-xs text-emerald-800 dark:text-emerald-400 font-medium leading-tight max-w-[150px]">
                  Estimated Gratuity at Retirement:
                </div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-500">
                  {formatCurr(projectedGratuity)}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                * Based on compounding {hikePct}% hike for {yearsToRetire} years.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Main Eligibility & Result Dashboard */}
        <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          <div className={`p-6 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-border/50 md:w-1/3 transition-colors ${isEligible ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
            {isEligible ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">Eligible</h3>
                <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium bg-emerald-500/10 px-2 py-1 rounded-full">Completed {roundedYears} Years</div>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
                <h3 className="font-bold text-rose-700 dark:text-rose-400 text-lg">Not Eligible</h3>
                <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1 font-medium max-w-[140px]">
                  Requires {isCovered ? "4 yrs 6 months" : "5 full years"}
                </div>
              </>
            )}
          </div>

          <div className="p-6 md:p-8 flex-1 bg-gradient-to-br from-background to-muted/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Estimated Gratuity Payable</h3>
            <div className={`text-4xl md:text-5xl font-black font-mono drop-shadow-sm mb-4 ${isEligible ? 'text-foreground' : 'text-muted-foreground'}`}>
              {isEligible ? formatCurr(gratuityAmount) : "₹0"}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Years Counted</span>
                <span className="font-bold">{roundedYears} <span className="text-muted-foreground text-xs font-normal">({years}y {months}m)</span></span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Tax Status</span>
                <span className="font-bold">{gratuityAmount > 2000000 ? "Partially Taxable" : "Fully Exempt"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Math Breakdown */}
        {isEligible && (
          <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2"><Calculator className="w-4 h-4 text-emerald-500"/> Exactly how is this calculated?</h4>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-4 gap-x-2 md:gap-x-4 text-center">
              
              <div className="bg-muted/50 border border-border/50 p-3 rounded-lg w-full md:w-auto">
                <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Salary</div>
                <div className="font-mono font-bold text-lg">{formatCurr(salary)}</div>
              </div>

              <div className="text-muted-foreground font-bold">×</div>

              <div className="bg-muted/50 border border-border/50 p-3 rounded-lg flex-1 md:flex-none">
                <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Days</div>
                <div className="font-mono font-bold text-lg">15</div>
              </div>

              <div className="text-muted-foreground font-bold">×</div>

              <div className="bg-muted/50 border border-border/50 p-3 rounded-lg flex-1 md:flex-none">
                <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Years</div>
                <div className="font-mono font-bold text-lg">{roundedYears}</div>
              </div>

              <div className="text-muted-foreground font-bold">÷</div>

              <div className="bg-muted/50 border border-border/50 p-3 rounded-lg flex-1 md:flex-none">
                <div className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Divisor</div>
                <div className="font-mono font-bold text-lg">{divisor}</div>
              </div>

              <div className="text-muted-foreground font-bold">=</div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-lg w-full md:w-auto">
                <div className="text-[10px] uppercase text-emerald-700/70 dark:text-emerald-500/70 font-bold mb-1">Gratuity</div>
                <div className="font-mono font-bold text-lg text-emerald-700 dark:text-emerald-400">{formatCurr(gratuityAmount)}</div>
              </div>

            </div>

            {/* Rounding Explanation */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm text-blue-900/80 dark:text-blue-300">
              <span className="font-bold flex items-center gap-1 mb-1"><HelpCircle className="w-4 h-4"/> How did we get {roundedYears} years?</span>
              {isCovered ? (
                months >= 6 
                  ? `Because you completed more than 6 months in your final year (${years} years and ${months} months), the Gratuity Act rounds it UP to the next full year (${roundedYears} Years).`
                  : `Because you completed less than 6 months in your final year (${years} years and ${months} months), the extra months are ignored. Your tenure is counted as exactly ${roundedYears} Years.`
              ) : (
                `Because your company is NOT covered under the Gratuity Act, extra months are completely ignored. You completed ${years} full years and ${months} months, so your tenure is counted strictly as ${roundedYears} Years.`
              )}
            </div>
          </div>
        )}

        {/* Resignation Scenarios & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500"/> Resignation Scenario</h4>
            
            {isEligible ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">If you resign <strong>today</strong>, you are legally entitled to your full gratuity payout.</p>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                  <span className="text-sm font-medium">Payable Amount:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurr(gratuityAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">If you resign <strong>today</strong>, you lose your entire gratuity because you have not met the minimum service requirement.</p>
                
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-100 dark:border-rose-900/50">
                  <div className="text-xs text-rose-800 dark:text-rose-400 font-medium mb-1">Time Remaining for Eligibility:</div>
                  <div className="font-bold text-rose-600 dark:text-rose-500">{monthsNeeded} more months</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border">
                  <span className="text-xs font-medium text-muted-foreground max-w-[120px]">Gratuity if you wait {monthsNeeded} months:</span>
                  <span className="font-mono font-bold">{formatCurr(scenarioAmount)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="border border-border bg-card rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> Earning Timeline</h4>
            <div className="space-y-2">
              {timeline.map((t, idx) => (
                <div key={idx} className={`flex justify-between items-center p-2 rounded text-sm ${t.year === roundedYears ? 'bg-emerald-500/10 font-bold border border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'hover:bg-muted'}`}>
                  <span>{t.year} Years</span>
                  <span className="font-mono">{formatCurr(t.amount)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
