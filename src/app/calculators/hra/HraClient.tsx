"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatCurrency } from "@/lib/utils";
import { Home, AlertCircle, Building, CheckCircle2, IndianRupee, Printer, Percent, MapPin, Calculator, Info } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

// Metro cities in India for HRA purposes (50% rule)
const METRO_CITIES = ["delhi", "new delhi", "mumbai", "bombay", "kolkata", "calcutta", "chennai", "madras"];

export default function HraClient() {
  // Global View State
  const [period, setPeriod] = useState<"monthly" | "annual">("annual");
  const [inputType, setInputType] = useState<"ctc" | "manual">("ctc");
  
  // Auto CTC Inputs
  const [ctc, setCtc] = useState<string>("1200000");
  const [basicPct, setBasicPct] = useState<number>(40);
  const [hraPct, setHraPct] = useState<number>(50); // HRA as % of Basic
  
  // Manual Inputs (always stored as Annual internally for math, displayed based on period)
  const [annualBasic, setAnnualBasic] = useState<number>(480000);
  const [annualHra, setAnnualHra] = useState<number>(240000);
  
  // Shared Inputs
  const [rent, setRent] = useState<string>("25000"); // Now controlled by rentPeriod
  const [rentPeriod, setRentPeriod] = useState<"monthly" | "annual">("monthly");
  const [cityName, setCityName] = useState<string>("Bangalore");
  const [isMetro, setIsMetro] = useState<boolean>(false);
  
  // Tax Slab
  const [taxSlab, setTaxSlab] = useState<number>(30); // 5%, 20%, 30%

  // Detect Metro status on city change
  useEffect(() => {
    const city = cityName.toLowerCase().trim();
    if (!city) return;
    const metroDetected = METRO_CITIES.some(m => city.includes(m));
    setIsMetro(metroDetected);
  }, [cityName]);

  // Sync Auto CTC to Manual State
  useEffect(() => {
    if (inputType === "ctc") {
      const numCtc = Number(ctc) || 0;
      const calcBasic = numCtc * (basicPct / 100);
      const calcHra = calcBasic * (hraPct / 100);
      setAnnualBasic(calcBasic);
      setAnnualHra(calcHra);
    }
  }, [ctc, basicPct, hraPct, inputType]);

  // Formatting helper
  const formatCurr = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Convert rent input to annual for math based on rentPeriod toggle
  const numRent = Number(rent) || 0;
  const annualRent = rentPeriod === "monthly" ? numRent * 12 : numRent;
  
  // Calculations (always done annually)
  const condition1 = annualHra;
  const condition2 = Math.max(0, annualRent - (0.1 * annualBasic));
  const condition3 = isMetro ? (0.5 * annualBasic) : (0.4 * annualBasic);

  const exemptAnnualHra = Math.min(condition1, condition2, condition3);
  const taxableAnnualHra = Math.max(0, annualHra - exemptAnnualHra);
  
  // Find the winner
  let winner = 1;
  if (exemptAnnualHra === condition2) winner = 2;
  if (exemptAnnualHra === condition3) winner = 3;

  // Values for display (adjusted by period)
  const multiplier = period === "monthly" ? 1/12 : 1;
  const dBasic = annualBasic * multiplier;
  const dHra = annualHra * multiplier;
  const dRent = annualRent * multiplier;
  
  const dCond1 = condition1 * multiplier;
  const dCond2 = condition2 * multiplier;
  const dCond3 = condition3 * multiplier;
  const dExempt = exemptAnnualHra * multiplier;
  const dTaxable = taxableAnnualHra * multiplier;
  
  const taxSavedAnnual = (exemptAnnualHra * (taxSlab / 100)) * 1.04; // including 4% health & education cess
  const dTaxSaved = taxSavedAnnual * multiplier;

  // Validation Warnings
  const warnings = [];
  if (annualRent > 0 && annualBasic > 0 && annualRent < (0.1 * annualBasic)) {
    warnings.push("Rent paid is less than 10% of your Basic Salary. You will not get any HRA exemption under Rule 2.");
  }
  if (inputType === "ctc" && (Number(ctc) || 0) > 0 && annualRent > (Number(ctc) * 0.8)) {
    warnings.push("This rent appears unusually high compared to your CTC. Please verify the values.");
  }
  if (annualHra > 0 && annualRent > 0 && annualHra < (annualRent * 0.2)) {
    warnings.push("Your HRA received from employer is very small compared to your rent. Your employer salary structure limits your exemption.");
  }

  // Visual Bars Logic (Max value for scaling)
  const maxBarValue = Math.max(dCond1, dCond2, dCond3) || 1;
  const getWidth = (val: number) => `${Math.max(2, Math.min(100, (val / maxBarValue) * 100))}%`;

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
        
        {/* Toggle Bar */}
        <div className="flex bg-muted p-1 rounded-lg">
          <button onClick={() => setPeriod("monthly")} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${period === "monthly" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-muted-foreground/10"}`}>Monthly View</button>
          <button onClick={() => setPeriod("annual")} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${period === "annual" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-muted-foreground/10"}`}>Annual View</button>
        </div>

        <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-500" /> Salary Structure
          </h2>
          
          <div className="space-y-6">
            <div className="flex bg-muted/30 p-1 rounded-lg">
              <button onClick={() => setInputType("ctc")} className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-md transition-all ${inputType === "ctc" ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"}`}>Auto from CTC</button>
              <button onClick={() => setInputType("manual")} className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-md transition-all ${inputType === "manual" ? "bg-foreground text-background shadow" : "text-muted-foreground hover:bg-muted"}`}>Manual Entry</button>
            </div>

            {inputType === "ctc" ? (
              <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Gross Yearly CTC</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                    <input
                      type="text"
                      value={ctc}
                      onChange={(e) => setCtc(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Basic % of CTC</label>
                    <div className="relative">
                      <select 
                        value={basicPct} 
                        onChange={(e) => setBasicPct(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 font-mono text-sm appearance-none"
                      >
                        <option value={35}>35%</option>
                        <option value={40}>40% (Standard)</option>
                        <option value={45}>45%</option>
                        <option value={50}>50%</option>
                        <option value={60}>60%</option>
                      </select>
                      <Percent className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">HRA % of Basic</label>
                    <div className="relative">
                      <select 
                        value={hraPct} 
                        onChange={(e) => setHraPct(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 font-mono text-sm appearance-none"
                      >
                        <option value={40}>40%</option>
                        <option value={50}>50% (Standard)</option>
                      </select>
                      <Percent className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Basic Salary ({period})</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-muted-foreground font-mono text-sm">₹</span>
                    <input
                      type="text"
                      value={period === "monthly" ? Math.round(annualBasic / 12) : annualBasic}
                      onChange={(e) => {
                        const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                        setAnnualBasic(period === "monthly" ? val * 12 : val);
                      }}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">HRA Received ({period})</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-muted-foreground font-mono text-sm">₹</span>
                    <input
                      type="text"
                      value={period === "monthly" ? Math.round(annualHra / 12) : annualHra}
                      onChange={(e) => {
                        const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                        setAnnualHra(period === "monthly" ? val * 12 : val);
                      }}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border/50">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-foreground block">Rent Paid</label>
                <div className="flex bg-muted/50 rounded p-0.5 border border-border/50">
                  <button 
                    onClick={() => {
                      if (rentPeriod === "annual") setRent(String(Math.round((Number(rent) || 0) / 12)));
                      setRentPeriod("monthly");
                    }} 
                    className={`px-2 py-0.5 text-xs font-medium rounded-[3px] transition-all ${rentPeriod === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => {
                      if (rentPeriod === "monthly") setRent(String((Number(rent) || 0) * 12));
                      setRentPeriod("annual");
                    }} 
                    className={`px-2 py-0.5 text-xs font-medium rounded-[3px] transition-all ${rentPeriod === "annual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Annual
                  </button>
                </div>
              </div>
              <div className="relative flex items-center mb-4">
                <span className="absolute left-4 text-muted-foreground font-mono">₹</span>
                <input
                  type="text"
                  value={rent}
                  onChange={(e) => setRent(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-foreground/20 font-mono text-lg transition-all"
                  placeholder="25000"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">City</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background focus:ring-2 font-sans text-sm"
                      placeholder="e.g. Bangalore, Delhi"
                    />
                  </div>
                </div>
                <div className="flex-[0.8]">
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">Detected Status</label>
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium ${isMetro ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" : "bg-muted text-muted-foreground border-border"}`}>
                    {isMetro ? <Building className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                    {isMetro ? "Metro (50%)" : "Non-Metro (40%)"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Your Highest Tax Slab</label>
              <select 
                value={taxSlab} 
                onChange={(e) => setTaxSlab(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 font-medium"
              >
                <option value={5}>5% Slab (Low Income)</option>
                <option value={20}>20% Slab (Medium Income)</option>
                <option value={30}>30% Slab (High Income)</option>
              </select>
            </div>
          </div>
        </div>

        {warnings.map((warn, i) => (
          <div key={i} className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <p className="flex gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Title for Print */}
        <div className="hidden print:block mb-8 border-b pb-4">
          <h1 className="text-3xl font-black">HRA Calculation Report</h1>
          <p className="text-muted-foreground mt-2">Generated dynamically using the Indian Income Tax Act rules.</p>
        </div>

        <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
          {/* Hero Header */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-background to-muted/20 border-b border-border/50 relative">
            <button 
              onClick={() => window.print()}
              className="absolute top-6 right-6 p-2 bg-background border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all no-print"
              title="Download/Print Report"
            >
              <Printer className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Exempt HRA ({period})</h3>
              <div className="text-4xl md:text-6xl font-black font-mono text-emerald-600 dark:text-emerald-400 drop-shadow-sm mb-4">
                {formatCurr(dExempt)}
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-full text-sm font-medium border border-rose-100 dark:border-rose-900/50">
                  Taxable: {formatCurr(dTaxable)}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-900/50">
                  Approx Tax Saved: {formatCurr(dTaxSaved)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Regime Switch Alert */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border flex items-start gap-4">
              <Info className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Old vs New Tax Regime Impact</h4>
                <p className="text-sm text-muted-foreground mb-2">You can only claim this {formatCurr(dExempt)} exemption if you opt for the <strong>Old Tax Regime</strong>.</p>
                <div className="flex flex-wrap gap-4 text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Old Regime: <span className="text-emerald-600 dark:text-emerald-400">Available</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="font-medium">New Regime: <span className="text-rose-600 dark:text-rose-400">₹0 Exemption</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Formula Comparison */}
            <div>
              <h4 className="font-semibold text-foreground mb-6">How is this calculated?</h4>
              
              <div className="space-y-6">
                
                {/* Rule 1 */}
                <div className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${winner === 1 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>1</div>
                      <span className="font-medium">Actual HRA Received</span>
                    </div>
                    <span className="font-mono font-bold">{formatCurr(dCond1)}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${winner === 1 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`}
                      style={{ width: getWidth(dCond1) }}
                    />
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${winner === 2 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>2</div>
                      <div className="flex flex-col">
                        <span className="font-medium">Rent Paid - 10% of Basic</span>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <div className="flex justify-between gap-4">
                            <span>{period === "monthly" ? "Monthly" : "Annual"} Rent Paid:</span>
                            <span className="font-mono">{formatCurr(dRent)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>10% of Basic Salary:</span>
                            <span className="font-mono">{formatCurr(0.1 * dBasic)}</span>
                          </div>
                          <div className="flex justify-between gap-4 border-t border-border/50 pt-1 mt-1">
                            <span>Difference:</span>
                            <span className="font-mono text-foreground">{formatCurr(dRent - (0.1 * dBasic))}</span>
                          </div>
                          {(dRent - (0.1 * dBasic)) < 0 && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 italic">
                              * Negative values are treated as zero.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-lg">{formatCurr(dCond2)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Eligible</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden mt-3">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${winner === 2 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`}
                      style={{ width: getWidth(dCond2) }}
                    />
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${winner === 3 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>3</div>
                      <span className="font-medium">{isMetro ? '50%' : '40%'} of Basic Salary ({isMetro ? 'Metro' : 'Non-Metro'})</span>
                    </div>
                    <span className="font-mono font-bold">{formatCurr(dCond3)}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${winner === 3 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`}
                      style={{ width: getWidth(dCond3) }}
                    />
                  </div>
                </div>

              </div>

              {/* Winner Explanation */}
              <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl flex gap-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-lg mb-1">
                    Rule {winner} is the Lowest
                  </h4>
                  <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                    The Income Tax Act mandates that your HRA exemption is strictly the <strong>lowest</strong> of the three rules above. Therefore, {formatCurr(dExempt)} becomes your tax-free exempt amount, saving you approximately {formatCurr(dTaxSaved)} in income tax.
                  </p>
                </div>
              </div>
            </div>

            {/* Print Data Breakdown (Only visible on print) */}
            <div className="hidden print:block mt-12">
              <h4 className="font-bold border-b pb-2 mb-4">Input Data Breakdown</h4>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b"><td className="py-2">Basic Salary ({period})</td><td className="text-right font-mono">{formatCurr(dBasic)}</td></tr>
                  <tr className="border-b"><td className="py-2">HRA Received ({period})</td><td className="text-right font-mono">{formatCurr(dHra)}</td></tr>
                  <tr className="border-b"><td className="py-2">Rent Paid ({period})</td><td className="text-right font-mono">{formatCurr(dRent)}</td></tr>
                  <tr className="border-b"><td className="py-2">City Type</td><td className="text-right font-mono">{cityName} ({isMetro ? 'Metro' : 'Non-Metro'})</td></tr>
                  <tr className="border-b"><td className="py-2">Tax Slab Assumed</td><td className="text-right font-mono">{taxSlab}%</td></tr>
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
