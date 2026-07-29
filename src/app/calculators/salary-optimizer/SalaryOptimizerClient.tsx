"use client";

import React, { useState, useMemo } from "react";
import { Calculator, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Mail, Copy, Info, CheckSquare, Square, ChevronRight, XCircle, ArrowRight, Printer, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { runSalaryOptimizer } from "@/lib/engines/salaryOptimizerEngine";
import Link from "next/link";

export default function SalaryOptimizerClient() {
  const [ctc, setCtc] = useState<string>("2500000");
  const [basic, setBasic] = useState<string>("1000000");
  const [hra, setHra] = useState<string>("400000");
  const [special, setSpecial] = useState<string>("550000");
  const [bonus, setBonus] = useState<string>("200000");
  const [pf, setPf] = useState<string>("120000");
  const [other, setOther] = useState<string>("230000");

  const [allowedBenefits, setAllowedBenefits] = useState({
    nps: true,
    mealCard: true,
    internet: true,
    telephone: true,
    fuel: false,
    carLease: false
  });

  const [copied, setCopied] = useState(false);

  const formatCurr = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const parsedCtc = Number(ctc) || 0;
  const currentBreakdown = {
    basic: Number(basic) || 0,
    hra: Number(hra) || 0,
    specialAllowance: Number(special) || 0,
    bonus: Number(bonus) || 0,
    employerPf: Number(pf) || 0,
    otherAllowances: Number(other) || 0,
    performanceBonus: 0,
    gratuity: 0
  };

  const engineResult = useMemo(() => {
    return runSalaryOptimizer({
      currentCtc: parsedCtc,
      currentBreakdown,
      allowedBenefits
    });
  }, [parsedCtc, currentBreakdown, allowedBenefits]);

  const toggleBenefit = (key: keyof typeof allowedBenefits) => {
    setAllowedBenefits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateEmail = () => {
    const list = engineResult.recommendedBenefits.map(b => `• ${b.name}`).join("\n");
    const body = `Hello HR,\n\nI would like to opt into the company's flexible benefits plan.\n\nPlease let me know if the following components can be activated from my existing Special Allowance:\n\n${list}\n\nThis change is only a salary restructuring and does not increase my CTC.\n\nPlease let me know the next steps.\n\nThank you.`;
    return body;
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(generateEmail());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const annualSaving = engineResult.currentMetrics.tax - engineResult.optimizedMetrics.tax;
  const monthlySaving = annualSaving / 12;

  // Render Stars Component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex text-amber-400">
        {[1,2,3,4,5].map(star => (
          <Star key={star} className={`w-3 h-3 ${star <= rating ? 'fill-amber-400' : 'text-muted-foreground/30 fill-muted/30'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20 printable-area">
      
      {/* 2. GIANT HERO SAVING CARD */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <TrendingUp className="w-64 h-64" />
        </div>
        <h2 className="text-emerald-100 font-bold tracking-widest uppercase text-sm mb-6">Salary Optimization Complete</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
          <div className="text-center">
            <div className="text-emerald-100/80 text-sm uppercase font-bold mb-1">Before</div>
            <div className="text-3xl font-mono text-emerald-100 line-through opacity-70">{formatCurr(engineResult.currentMetrics.inHand / 12)}</div>
          </div>
          <ArrowRight className="w-8 h-8 text-emerald-200 hidden md:block" />
          <div className="text-center">
            <div className="text-emerald-100 text-sm uppercase font-bold mb-1">New Monthly Take Home</div>
            <div className="text-5xl font-mono font-black text-white">{formatCurr(engineResult.optimizedMetrics.inHand / 12)}</div>
          </div>
        </div>
        
        <div className="inline-block bg-white/20 px-6 py-2 rounded-full text-emerald-50 font-medium text-lg">
          You save <strong className="text-white font-bold">{formatCurr(annualSaving)}</strong> every year (+{formatCurr(monthlySaving)}/month)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Inputs & Policy */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          {/* Input Card */}
          <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-500" /> Current Structure
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="text-sm font-semibold text-foreground block">Total CTC (Annual) (₹)</label>
                  {parsedCtc > 0 && (
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      currentBreakdown.basic + currentBreakdown.hra + currentBreakdown.specialAllowance + currentBreakdown.employerPf + currentBreakdown.bonus + currentBreakdown.otherAllowances > parsedCtc 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' 
                        : currentBreakdown.basic + currentBreakdown.hra + currentBreakdown.specialAllowance + currentBreakdown.employerPf + currentBreakdown.bonus + currentBreakdown.otherAllowances === parsedCtc
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {formatCurr(currentBreakdown.basic + currentBreakdown.hra + currentBreakdown.specialAllowance + currentBreakdown.employerPf + currentBreakdown.bonus + currentBreakdown.otherAllowances)} of {formatCurr(parsedCtc)}
                      {currentBreakdown.basic + currentBreakdown.hra + currentBreakdown.specialAllowance + currentBreakdown.employerPf + currentBreakdown.bonus + currentBreakdown.otherAllowances > parsedCtc && ` (Exceeds by ${formatCurr(currentBreakdown.basic + currentBreakdown.hra + currentBreakdown.specialAllowance + currentBreakdown.employerPf + currentBreakdown.bonus + currentBreakdown.otherAllowances - parsedCtc)})`}
                    </span>
                  )}
                </div>
                <input type="text" value={ctc} onChange={(e) => setCtc(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-emerald-500/20 font-mono text-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Basic (Annual)</label>
                  <input type="text" value={basic} onChange={(e) => setBasic(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">HRA (Annual)</label>
                  <input type="text" value={hra} onChange={(e) => setHra(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 mb-1 block">Special Allowance (Annual)</label>
                  <input type="text" value={special} onChange={(e) => setSpecial(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-3 py-2 rounded-md border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 font-mono text-sm focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Employer PF (Annual)</label>
                  <input type="text" value={pf} onChange={(e) => setPf(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bonus (Annual)</label>
                  <input type="text" value={bonus} onChange={(e) => setBonus(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Other (Annual)</label>
                  <input type="text" value={other} onChange={(e) => setOther(e.target.value.replace(/[^0-9]/g, ""))} className="w-full px-3 py-2 rounded-md border border-border bg-background font-mono text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Company Policy Card */}
          <div className="border border-border bg-card rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 bg-emerald-500/10 rounded-bl-xl">
               <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-bold mb-1">Company Policy Check</h3>
            <p className="text-xs text-muted-foreground mb-4">Toggle the benefits your employer actually offers.</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Retirement</h4>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => toggleBenefit('nps')} className={`flex items-center gap-2 p-2 rounded border text-sm transition-all text-left ${allowedBenefits.nps ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30' : 'bg-background border-border opacity-70'}`}>
                    {allowedBenefits.nps ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground shrink-0" />} <span className={allowedBenefits.nps ? 'font-medium' : ''}>Employer NPS</span>
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Daily Benefits</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mealCard', label: 'Meal Card' },
                    { id: 'internet', label: 'Internet' },
                    { id: 'telephone', label: 'Telephone' }
                  ].map(benefit => (
                    <button key={benefit.id} onClick={() => toggleBenefit(benefit.id as keyof typeof allowedBenefits)} className={`flex items-center gap-2 p-2 rounded border text-sm transition-all text-left ${allowedBenefits[benefit.id as keyof typeof allowedBenefits] ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30' : 'bg-background border-border opacity-70'}`}>
                      {allowedBenefits[benefit.id as keyof typeof allowedBenefits] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground shrink-0" />} <span className={`truncate ${allowedBenefits[benefit.id as keyof typeof allowedBenefits] ? 'font-medium' : ''}`}>{benefit.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Transport</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'fuel', label: 'Fuel Reimb.' },
                    { id: 'carLease', label: 'Car Lease' }
                  ].map(benefit => (
                    <button key={benefit.id} onClick={() => toggleBenefit(benefit.id as keyof typeof allowedBenefits)} className={`flex items-center gap-2 p-2 rounded border text-sm transition-all text-left ${allowedBenefits[benefit.id as keyof typeof allowedBenefits] ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30' : 'bg-background border-border opacity-70'}`}>
                      {allowedBenefits[benefit.id as keyof typeof allowedBenefits] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground shrink-0" />} <span className={`truncate ${allowedBenefits[benefit.id as keyof typeof allowedBenefits] ? 'font-medium' : ''}`}>{benefit.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Output Dashboards */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Action Bar (Print / PDF) */}
          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border print:hidden">
            <div className="text-sm font-medium">Prepared by ApexToolHub</div>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors">
              <Printer className="w-4 h-4" /> Download PDF Proposal
            </button>
          </div>

          <div className="hidden print:block mb-8 text-left border border-border p-8 rounded-xl bg-slate-50">
             <h1 className="text-2xl font-black text-black mb-6">Salary Restructuring Recommendation</h1>
             
             <div className="grid grid-cols-2 gap-y-4 mb-6 text-sm text-black">
                <div><span className="text-gray-500 block mb-1">Employee CTC:</span> <strong className="text-lg">{formatCurr(parsedCtc)}</strong></div>
                <div><span className="text-gray-500 block mb-1">Annual Saving:</span> <strong className="text-lg text-emerald-600">{formatCurr(annualSaving)}</strong></div>
                <div><span className="text-gray-500 block mb-1">Current Tax:</span> <strong className="text-base">{formatCurr(engineResult.currentMetrics.tax)}</strong></div>
                <div><span className="text-gray-500 block mb-1">Optimized Tax:</span> <strong className="text-base">{formatCurr(engineResult.optimizedMetrics.tax)}</strong></div>
             </div>

             <div className="mb-4">
                <span className="text-gray-500 block mb-2 text-sm">Suggested Flexi Components:</span>
                <ul className="list-disc pl-5 font-medium text-black">
                  {engineResult.recommendedBenefits.map((b, i) => (
                    <li key={i}>{b.name}</li>
                  ))}
                </ul>
             </div>
             
             <p className="text-xs text-gray-500 italic mt-6 border-t pt-4">This restructuring does not increase company cost (CTC). It only reallocates existing taxable allowances into eligible tax-efficient benefits, subject to company policy.</p>
          </div>

          {/* 6. Optimization Timeline */}
          <div className="border border-border bg-card rounded-xl p-6 shadow-sm overflow-x-auto print:hidden">
             <div className="flex items-center justify-between min-w-[600px]">
                <div className="flex flex-col items-center text-center w-32">
                   <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2 font-bold text-muted-foreground border border-border">1</div>
                   <div className="text-xs font-bold">Current CTC</div>
                   <div className="text-[10px] text-muted-foreground mt-1">{formatCurr(parsedCtc)}</div>
                </div>
                <div className="flex-1 h-0.5 bg-border mx-2 relative"><ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-border translate-x-1/2" /></div>
                
                <div className="flex flex-col items-center text-center w-32">
                   <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-2 font-bold text-emerald-600 border border-emerald-200 dark:border-emerald-800">2</div>
                   <div className="text-xs font-bold text-emerald-600">Restructured</div>
                   <div className="text-[10px] text-muted-foreground mt-1">{engineResult.recommendedBenefits.length} flexi added</div>
                </div>
                <div className="flex-1 h-0.5 bg-emerald-200 dark:bg-emerald-800 mx-2 relative"><ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300 dark:text-emerald-700 translate-x-1/2" /></div>
                
                <div className="flex flex-col items-center text-center w-32">
                   <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-2 font-bold text-emerald-600 border border-emerald-200 dark:border-emerald-800">3</div>
                   <div className="text-xs font-bold text-emerald-600">Tax Reduced</div>
                   <div className="text-[10px] text-emerald-600 font-bold mt-1">-{formatCurr(annualSaving)}</div>
                </div>
                <div className="flex-1 h-0.5 bg-emerald-200 dark:bg-emerald-800 mx-2 relative"><ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300 dark:text-emerald-700 translate-x-1/2" /></div>
                
                <div className="flex flex-col items-center text-center w-32">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center mb-2 font-bold text-white shadow-lg shadow-emerald-500/20">4</div>
                   <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Take Home</div>
                   <div className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 px-2 rounded-full mt-1">+{formatCurr(monthlySaving)}/mo</div>
                </div>
             </div>
          </div>

          {/* 5. Salary Structure Pie/Bar Chart */}
          <div className="border border-border bg-card rounded-xl p-6 shadow-sm">
             <h3 className="font-bold mb-6">Visual Structure Shift</h3>
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase mb-2">
                    <span>Current</span>
                    <span>{formatCurr(parsedCtc)}</span>
                  </div>
                  <div className="flex h-8 rounded-lg overflow-hidden border border-border">
                    <div style={{width: `${(engineResult.currentBreakdown.basic / parsedCtc) * 100}%`}} className="bg-slate-400" title="Basic"></div>
                    <div style={{width: `${(engineResult.currentBreakdown.hra / parsedCtc) * 100}%`}} className="bg-slate-300 dark:bg-slate-500" title="HRA"></div>
                    <div style={{width: `${(engineResult.currentBreakdown.specialAllowance / parsedCtc) * 100}%`}} className="bg-rose-400" title="Special Allowance (Fully Taxed)"></div>
                    <div style={{width: `${(engineResult.currentBreakdown.employerPf / parsedCtc) * 100}%`}} className="bg-slate-200 dark:bg-slate-600" title="PF"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">
                    <span>Optimized</span>
                    <span>{formatCurr(parsedCtc)}</span>
                  </div>
                  <div className="flex h-8 rounded-lg overflow-hidden border border-emerald-500/30">
                    <div style={{width: `${(engineResult.optimizedBreakdown.basic / parsedCtc) * 100}%`}} className="bg-slate-400" title="Basic"></div>
                    <div style={{width: `${(engineResult.optimizedBreakdown.hra / parsedCtc) * 100}%`}} className="bg-slate-300 dark:bg-slate-500" title="HRA"></div>
                    <div style={{width: `${(engineResult.optimizedBreakdown.specialAllowance / parsedCtc) * 100}%`}} className="bg-rose-400 flex items-center justify-center overflow-hidden" title="Special (Reduced)">
                      {engineResult.optimizedBreakdown.specialAllowance > 0 && <span className="text-[8px] text-rose-900 font-bold px-1 truncate mix-blend-color-burn">Taxed</span>}
                    </div>
                    
                    {/* New Flexi Components */}
                    {engineResult.recommendedBenefits.map((b, i) => (
                      <div key={i} style={{width: `${(b.amount / parsedCtc) * 100}%`}} className="bg-emerald-400 border-l border-emerald-500/20" title={b.name}></div>
                    ))}
                    
                    <div style={{width: `${(engineResult.optimizedBreakdown.employerPf / parsedCtc) * 100}%`}} className="bg-slate-200 dark:bg-slate-600" title="PF"></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] uppercase font-bold text-muted-foreground mt-2 border-b border-border/50 pb-4">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Basic</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-300 dark:bg-slate-500 rounded-sm"></div> HRA</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-400 rounded-sm"></div> Special (Taxable)</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-400 rounded-sm"></div> Flexi (Tax Free)</div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Improvement Breakdown</div>
                  {engineResult.recommendedBenefits.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      {engineResult.recommendedBenefits.map((b, i) => (
                        <div key={i} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                          <span className="text-muted-foreground">{b.name}</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">-{formatCurr(b.taxImpact)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2 mt-2 font-bold text-base border-t border-border">
                        <span>Total Annual Tax Saved</span>
                        <span className="font-mono text-emerald-600">{formatCurr(annualSaving)}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground italic mt-1">Remaining Special Allowance converted into tax-efficient benefits.</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">No flexi benefits activated. Check the company policy options.</div>
                  )}
                </div>
             </div>
          </div>

          {/* Optimization Meter */}
          <div className="border border-border bg-card rounded-xl p-6 shadow-sm print:hidden">
             <div className="flex justify-between items-end mb-4">
               <h3 className="font-bold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500"/> Optimization Score</h3>
               <div className="text-3xl font-black font-mono text-emerald-600">{engineResult.optimizationScore}<span className="text-lg text-muted-foreground">/100</span></div>
             </div>
             
             <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden flex">
               <div className="bg-emerald-500 h-3 transition-all duration-1000 ease-out" style={{width: `${engineResult.optimizationScore}%`}}></div>
             </div>
             
             <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mt-4">
               <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Company benefits selected</div>
               <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> New tax regime optimal</div>
               <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> CTC limits verified</div>
               <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Standard deductions applied</div>
             </div>
          </div>

          {/* 1. "Where did numbers come from" Cards */}
          {engineResult.recommendedBenefits.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Your New Flexi-Benefits Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {engineResult.recommendedBenefits.map((b, i) => (
                  <div key={i} className="border border-emerald-500/30 bg-card rounded-xl p-5 shadow-sm hover:border-emerald-500 transition-colors relative">
                    <div className="absolute top-4 right-4"><CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                    <h4 className="font-bold text-lg mb-1">{b.name}</h4>
                    <div className="mb-4">
                      <StarRating rating={b.confidenceRating} />
                    </div>
                    
                    <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-500 mb-4 border-b border-border pb-4">
                      {formatCurr(b.amount)}<span className="text-sm font-normal text-muted-foreground uppercase"> / yr</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Based on <strong className="text-foreground">{formatCurr(b.monthlyAmount)}/month</strong> reimbursement
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50 text-xs font-medium">
                      <Link href="/calculators/income-tax/" className="text-emerald-600 hover:underline flex items-center gap-1">
                        View Tax Rule <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Missing Opportunities & 11. Employer Doesn't Offer These */}
          {engineResult.missedOpportunities.length > 0 && (
            <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm mt-8 print:break-before-page">
              <div className="p-5 border-b border-border bg-muted/20">
                <h3 className="font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <XCircle className="w-5 h-5" /> Benefits Your Employer Doesn't Offer (Or you missed)
                </h3>
              </div>
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/10">
                    <tr>
                      <th className="px-6 py-3 font-bold">Benefit</th>
                      <th className="px-6 py-3 font-bold">Max Claimable</th>
                      <th className="px-6 py-3 font-bold text-rose-600">Lost Tax Saving</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engineResult.missedOpportunities.map((m, i) => (
                      <tr key={i} className="border-b border-border/50 bg-background hover:bg-muted/10">
                        <td className="px-6 py-4 font-medium flex items-center gap-2"><XCircle className="w-4 h-4 text-rose-500 opacity-50" /> {m.name}</td>
                        <td className="px-6 py-4 font-mono text-muted-foreground">{formatCurr(m.lostAmount)}/yr</td>
                        <td className="px-6 py-4 font-mono font-bold text-rose-600">~{formatCurr(m.potentialSaving)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-5 bg-rose-50 dark:bg-rose-950/20 text-sm text-rose-800 dark:text-rose-300 border-t border-border">
                If these benefits become available, you could save another <strong>{formatCurr(engineResult.missedOpportunities.reduce((a,b)=>a+b.potentialSaving,0))}</strong> per year. Discuss these during your next appraisal.
              </div>
            </div>
          )}

          {/* 7. HR Negotiation Tips (Card 6 & 7 combined) */}
          {engineResult.recommendedBenefits.length > 0 && (
            <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm print:hidden mt-8">
              <div className="p-5 border-b border-border/50 bg-muted/20">
                <h3 className="font-bold flex items-center gap-2">HR Negotiation Action Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">What to ask for during your next appraisal or mid-year restructure.</p>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Request these components</h4>
                  <ul className="space-y-3">
                    {engineResult.recommendedBenefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium text-sm">
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                        {b.name} ({formatCurr(b.monthlyAmount)}/mo)
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 border-b border-border flex justify-between items-center">
                    <div className="text-xs font-bold"><Mail className="w-4 h-4 inline mr-2 text-blue-500" />Email Draft to HR</div>
                    <button onClick={copyEmail} className="text-xs text-foreground bg-background px-2 py-1 rounded border hover:bg-muted">
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-muted-foreground bg-background">
                    {generateEmail()}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .printable-area {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .border-border { border-color: #e5e7eb !important; }
          .bg-card { background-color: white !important; }
        }
      `}</style>
    </div>
  );
}
