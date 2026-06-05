"use client";

import { useState } from "react";
import { Calculator, RotateCcw, Copy, Check } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { PERCENTAGE_FAQS } from "@/data/faqs";


export default function PercentageCalculatorPage() {
  // Form A: What is X% of Y?
  const [aX, setAX] = useState("");
  const [aY, setAY] = useState("");
  const [copiedA, setCopiedA] = useState(false);

  // Form B: X is what percentage of Y?
  const [bX, setBX] = useState("");
  const [bY, setBY] = useState("");
  const [copiedB, setCopiedB] = useState(false);

  // Form C: Percentage increase/decrease from X to Y
  const [cX, setCX] = useState("");
  const [cY, setCY] = useState("");
  const [copiedC, setCopiedC] = useState(false);

  // Compute values dynamically
  const getResultA = () => {
    const numX = parseFloat(aX);
    const numY = parseFloat(aY);
    if (isNaN(numX) || isNaN(numY)) return "";
    const res = (numX * numY) / 100;
    // Format to max 4 decimal places, removing trailing zeros
    return Number(res.toFixed(4)).toString();
  };

  const getResultB = () => {
    const numX = parseFloat(bX);
    const numY = parseFloat(bY);
    if (isNaN(numX) || isNaN(numY) || numY === 0) return "";
    const res = (numX / numY) * 100;
    return Number(res.toFixed(4)).toString() + "%";
  };

  const getResultC = () => {
    const numX = parseFloat(cX);
    const numY = parseFloat(cY);
    if (isNaN(numX) || isNaN(numY) || numX === 0) return "";
    const diff = numY - numX;
    const pct = (diff / numX) * 100;
    const direction = pct >= 0 ? "increase" : "decrease";
    return `${Number(Math.abs(pct).toFixed(4)).toString()}% ${direction}`;
  };

  const handleReset = () => {
    setAX("");
    setAY("");
    setBX("");
    setBY("");
    setCX("");
    setCY("");
  };

  const handleCopy = (value: string, setCopied: (v: boolean) => void) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resA = getResultA();
  const resB = getResultB();
  const resC = getResultC();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Percentage Calculator
          </h1>
          <div className="flex items-center gap-2">
            <ShareButton 
              title="Percentage Calculator | ApexToolHub" 
              text="Calculate percentages online instantly. What is X% of Y, percentage increase/decrease, etc." 
            />
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All
            </button>
          </div>
        </div>
        <p className="text-sm text-muted">
          Resolve daily percentage questions dynamically. Output updates instantly as you type.
        </p>
      </div>


      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module A */}
        <div className="border border-border bg-card rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Basic Percentage Yield
            </h2>
            <p className="text-foreground font-medium tracking-tight">What is X% of Y?</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1 font-sans">Percentage (X)</label>
                <input
                  type="number"
                  value={aX}
                  onChange={(e) => setAX(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] tabular-nums"
                  translate="no"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1 font-sans">Value (Y)</label>
                <input
                  type="number"
                  value={aY}
                  onChange={(e) => setAY(e.target.value)}
                  placeholder="e.g. 200"
                  className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] tabular-nums"
                  translate="no"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-5 pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-muted font-sans">Result:</span>
              <div 
                className="text-xl font-bold tracking-tight text-foreground font-mono tabular-nums min-h-[28px] flex items-center" 
                translate="no"
              >
                {resA || <span className="text-zinc-400 dark:text-zinc-600 text-sm font-normal font-sans">Enter values...</span>}
              </div>
            </div>
            {resA && (
              <button
                onClick={() => handleCopy(resA, setCopiedA)}
                className="h-9 w-9 rounded-md border border-border bg-background hover:bg-muted/10 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                title="Copy result"
              >
                {copiedA ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted" />}
              </button>
            )}
          </div>
        </div>

        {/* Module B */}
        <div className="border border-border bg-card rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Percentage Share
            </h2>
            <p className="text-foreground font-medium tracking-tight">X is what percentage of Y?</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1 font-sans">Value (X)</label>
                <input
                  type="number"
                  value={bX}
                  onChange={(e) => setBX(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] tabular-nums"
                  translate="no"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1 font-sans">Total (Y)</label>
                <input
                  type="number"
                  value={bY}
                  onChange={(e) => setBY(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] tabular-nums"
                  translate="no"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-5 pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-muted font-sans">Result:</span>
              <div 
                className="text-xl font-bold tracking-tight text-foreground font-mono tabular-nums min-h-[28px] flex items-center" 
                translate="no"
              >
                {resB || <span className="text-zinc-400 dark:text-zinc-600 text-sm font-normal font-sans">Enter values...</span>}
              </div>
            </div>
            {resB && (
              <button
                onClick={() => handleCopy(resB, setCopiedB)}
                className="h-9 w-9 rounded-md border border-border bg-background hover:bg-muted/10 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                title="Copy result"
              >
                {copiedB ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted" />}
              </button>
            )}
          </div>
        </div>

        {/* Module C - Percentage Increase/Decrease */}
        <div className="border border-border bg-card rounded-lg p-5 flex flex-col justify-between shadow-sm md:col-span-2">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-zinc-500" />
              Percentage Variance Change
            </h2>
            <p className="text-foreground font-medium tracking-tight">What is the percentage variance from X to Y?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1 font-sans">Initial Value (X)</label>
                <input
                  type="number"
                  value={cX}
                  onChange={(e) => setCX(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] tabular-nums"
                  translate="no"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1 font-sans">Final Value (Y)</label>
                <input
                  type="number"
                  value={cY}
                  onChange={(e) => setCY(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] tabular-nums"
                  translate="no"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-5 pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-muted font-sans">Result:</span>
              <div 
                className="text-xl font-bold tracking-tight text-foreground font-mono tabular-nums min-h-[28px] flex items-center" 
                translate="no"
              >
                {resC || <span className="text-zinc-400 dark:text-zinc-600 text-sm font-normal font-sans">Enter values...</span>}
              </div>
            </div>
            {resC && (
              <button
                onClick={() => handleCopy(resC, setCopiedC)}
                className="h-9 w-9 rounded-md border border-border bg-background hover:bg-muted/10 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                title="Copy result"
              >
                {copiedC ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={PERCENTAGE_FAQS} idPrefix="percentage-faq" />
      </div>
    </div>
  );
}

