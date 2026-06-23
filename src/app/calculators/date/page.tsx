"use client";

import React, { useState, useEffect } from "react";
import { Calendar, RotateCcw, Copy, Check, Plus, Minus, ArrowRightLeft, CalendarPlus, Clock } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { DATE_CALCULATOR_FAQS } from "@/data/faqs";

export default function DateCalculatorPage() {
  const [activeTab, setActiveTab] = useState<"diff" | "addsub">("diff");

  // Tab 1: Difference between dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [copiedDiff, setCopiedDiff] = useState(false);

  // Tab 2: Add or subtract time
  const [calcStartDate, setCalcStartDate] = useState("");
  const [calcOperation, setCalcOperation] = useState<"add" | "subtract">("add");
  const [calcYears, setCalcYears] = useState("");
  const [calcMonths, setCalcMonths] = useState("");
  const [calcWeeks, setCalcWeeks] = useState("");
  const [calcDays, setCalcDays] = useState("");
  const [copiedAddSub, setCopiedAddSub] = useState(false);

  // Set default dates on load
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setStartDate("2013-12-09"); // Default to user's example
    setEndDate(todayStr);       // Default to today
    setCalcStartDate(todayStr); // Default to today
  }, []);

  const handleResetDiff = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setStartDate("2013-12-09");
    setEndDate(todayStr);
    setIncludeEndDate(false);
  };

  const handleResetAddSub = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setCalcStartDate(todayStr);
    setCalcOperation("add");
    setCalcYears("");
    setCalcMonths("");
    setCalcWeeks("");
    setCalcDays("");
  };

  const handleCopy = (value: string, setCopied: (v: boolean) => void) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe timezone-agnostic date parser (noon local time)
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };

  // Calculations for Date Difference
  const getDifferenceResult = () => {
    const d1 = parseLocalDate(startDate);
    const d2 = parseLocalDate(endDate);
    if (!d1 || !d2) return null;

    const isPast = d1 > d2;
    const start = isPast ? d2 : d1;
    const end = isPast ? d1 : d2;

    const endCalc = new Date(end.getTime());
    if (includeEndDate) {
      endCalc.setDate(endCalc.getDate() + 1);
    }

    const diffTime = endCalc.getTime() - start.getTime();
    if (diffTime < 0) {
      return {
        isPast,
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
        totalWeeks: 0,
        remainingDays: 0,
        totalMonths: "0",
        totalYears: "0",
      };
    }

    const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Exact breakdown (Years, Months, Days)
    let years = endCalc.getFullYear() - start.getFullYear();
    let months = endCalc.getMonth() - start.getMonth();
    let days = endCalc.getDate() - start.getDate();

    if (days < 0) {
      const prevMonth = new Date(endCalc.getFullYear(), endCalc.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Fractional months & years
    const totalMonthsNum = (endCalc.getFullYear() - start.getFullYear()) * 12 + (endCalc.getMonth() - start.getMonth());
    const startDay = start.getDate();
    const endDay = endCalc.getDate();
    let totalMonthsFraction = totalMonthsNum;
    if (endDay !== startDay) {
      const daysInLastMonth = new Date(endCalc.getFullYear(), endCalc.getMonth(), 0).getDate();
      totalMonthsFraction += (endDay - startDay) / daysInLastMonth;
    }
    const totalMonths = Number(Math.max(0, totalMonthsFraction).toFixed(1)).toString();
    const totalYears = Number((totalDays / 365.2425).toFixed(2)).toString();

    return {
      isPast,
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDays,
      totalMonths,
      totalYears,
    };
  };

  const diffResult = getDifferenceResult();

  const getExactDiffString = () => {
    if (!diffResult) return "";
    const { years, months, days } = diffResult;
    if (years === 0 && months === 0 && days === 0) return "Same date";

    const parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    
    return parts.join(", ") + (diffResult.isPast ? " ago" : "");
  };

  // Calculations for Add/Subtract Time
  const getCalculatedDate = () => {
    const baseDate = parseLocalDate(calcStartDate);
    if (!baseDate) return null;

    const y = parseInt(calcYears) || 0;
    const m = parseInt(calcMonths) || 0;
    const w = parseInt(calcWeeks) || 0;
    const d = parseInt(calcDays) || 0;

    const factor = calcOperation === "add" ? 1 : -1;

    const targetDate = new Date(baseDate.getTime());
    targetDate.setFullYear(targetDate.getFullYear() + y * factor);
    targetDate.setMonth(targetDate.getMonth() + m * factor);
    targetDate.setDate(targetDate.getDate() + (w * 7 + d) * factor);

    return targetDate;
  };

  const calcTargetDate = getCalculatedDate();

  const formatLongDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (d: Date) => {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Quick Preset Handlers
  const applyPreset = (type: "start" | "end", preset: "today" | "startOfYear" | "endOfYear") => {
    const now = new Date();
    let dateStr = "";
    if (preset === "today") {
      dateStr = now.toISOString().split("T")[0];
    } else if (preset === "startOfYear") {
      dateStr = `${now.getFullYear()}-01-01`;
    } else if (preset === "endOfYear") {
      dateStr = `${now.getFullYear()}-12-31`;
    }

    if (type === "start") setStartDate(dateStr);
    else setEndDate(dateStr);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Date Calculator
          </h1>
          <div className="flex items-center gap-2">
            <ShareButton
              title="Date Calculator | ApexToolHub"
              text="Count exact days between dates or add/subtract days from a date instantly."
            />
            <button
              onClick={activeTab === "diff" ? handleResetDiff : handleResetAddSub}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
              data-testid="reset-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Section
            </button>
          </div>
        </div>
        <p className="text-sm text-muted">
          Count exact calendar intervals between two dates, or add/subtract time parameters to find a target calendar day.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/20 p-1 rounded-lg gap-1 max-w-md">
        <button
          onClick={() => setActiveTab("diff")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "diff"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Date Difference</span>
        </button>
        <button
          onClick={() => setActiveTab("addsub")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "addsub"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Add / Subtract Days</span>
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === "diff" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inputs Panel */}
          <div className="md:col-span-1 border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm h-fit">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-500" />
              Duration Parameters
            </h2>

            {/* Start Date */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-muted font-sans">Start Date</label>
                <div className="flex gap-1 text-[10px]">
                  <button onClick={() => applyPreset("start", "today")} className="text-muted hover:text-foreground underline cursor-pointer">Today</button>
                  <span>•</span>
                  <button onClick={() => applyPreset("start", "startOfYear")} className="text-muted hover:text-foreground underline cursor-pointer">Jan 1</button>
                </div>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px]"
                data-testid="start-date-input"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-muted font-sans">End Date</label>
                <div className="flex gap-1 text-[10px]">
                  <button onClick={() => applyPreset("end", "today")} className="text-muted hover:text-foreground underline cursor-pointer">Today</button>
                  <span>•</span>
                  <button onClick={() => applyPreset("end", "endOfYear")} className="text-muted hover:text-foreground underline cursor-pointer">Dec 31</button>
                </div>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px]"
                data-testid="end-date-input"
              />
            </div>

            {/* Checkbox settings */}
            <div className="pt-2 border-t border-border/60">
              <label className="flex items-center gap-2 text-xs font-sans text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEndDate}
                  onChange={(e) => setIncludeEndDate(e.target.checked)}
                  className="rounded border-border text-zinc-900 focus:ring-zinc-800 h-4 w-4 bg-background"
                />
                <span>Include End Date (add 1 day)</span>
              </label>
            </div>
          </div>

          {/* Results Panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Primary Result Box */}
            <div className="border border-border bg-card rounded-lg p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-zinc-500/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans flex items-center gap-1.5 select-none">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  Exact Time Elapsed
                </span>
                
                <div className="pt-2">
                  <div 
                    className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-mono min-h-[36px]"
                    data-testid="exact-diff-text"
                  >
                    {getExactDiffString() || <span className="text-zinc-400 dark:text-zinc-650 font-normal font-sans text-lg">Select valid dates...</span>}
                  </div>
                  {diffResult && (
                    <p className="text-xs text-muted-foreground mt-2 font-sans">
                      Difference from {startDate} to {endDate} {includeEndDate ? "(inclusive of end date)" : ""}
                    </p>
                  )}
                </div>
              </div>

              {diffResult && (
                <div className="border-t border-border/60 mt-6 pt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">Copy result to clipboard</span>
                  <button
                    onClick={() => handleCopy(getExactDiffString(), setCopiedDiff)}
                    className="h-9 w-9 rounded-md border border-border bg-background hover:bg-muted/10 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                    title="Copy diff text"
                  >
                    {copiedDiff ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted" />}
                  </button>
                </div>
              )}
            </div>

            {/* Secondary Breakdown Cards */}
            {diffResult && (
              <div className="grid grid-cols-2 gap-4">
                {/* Total Days */}
                <div className="border border-border bg-card rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider select-none">Total Days</span>
                  <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-foreground mt-1 tabular-nums">
                    {diffResult.totalDays.toLocaleString()} days
                  </div>
                  <span className="text-[10px] text-muted mt-1 leading-none font-sans">Total number of days elapsed</span>
                </div>

                {/* Total Weeks */}
                <div className="border border-border bg-card rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider select-none">Total Weeks</span>
                  <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-foreground mt-1 tabular-nums">
                    {diffResult.totalWeeks.toLocaleString()} wk{diffResult.totalWeeks !== 1 ? "s" : ""}
                    {diffResult.remainingDays > 0 && ` ${diffResult.remainingDays} d`}
                  </div>
                  <span className="text-[10px] text-muted mt-1 leading-none font-sans">Weeks &amp; remaining days</span>
                </div>

                {/* Total Months */}
                <div className="border border-border bg-card rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider select-none">Total Months</span>
                  <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-foreground mt-1 tabular-nums">
                    {diffResult.totalMonths} months
                  </div>
                  <span className="text-[10px] text-muted mt-1 leading-none font-sans">Approximate decimal months</span>
                </div>

                {/* Total Years */}
                <div className="border border-border bg-card rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider select-none">Total Years</span>
                  <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-foreground mt-1 tabular-nums">
                    {diffResult.totalYears} years
                  </div>
                  <span className="text-[10px] text-muted mt-1 leading-none font-sans">Approximate decimal years</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inputs Panel */}
          <div className="md:col-span-1 border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm h-fit">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-500" />
              Calendar Modification
            </h2>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-muted font-sans">Start Date</label>
              <input
                type="date"
                value={calcStartDate}
                onChange={(e) => setCalcStartDate(e.target.value)}
                className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px]"
                data-testid="calc-start-date"
              />
            </div>

            {/* Add / Subtract selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-muted font-sans">Operation</label>
              <div className="flex border border-border rounded-lg overflow-hidden p-0.5 bg-background">
                <button
                  type="button"
                  onClick={() => setCalcOperation("add")}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    calcOperation === "add"
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
                <button
                  type="button"
                  onClick={() => setCalcOperation("subtract")}
                  className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                    calcOperation === "subtract"
                      ? "bg-foreground text-background"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Minus className="h-3 w-3" /> Subtract
                </button>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
              <div>
                <label className="block text-[10px] font-bold text-muted font-sans mb-1">Years</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={calcYears}
                  onChange={(e) => setCalcYears(e.target.value)}
                  className="w-full rounded border border-border bg-background py-1.5 px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-550 tabular-nums min-h-[36px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted font-sans mb-1">Months</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(e.target.value)}
                  className="w-full rounded border border-border bg-background py-1.5 px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-550 tabular-nums min-h-[36px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted font-sans mb-1">Weeks</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={calcWeeks}
                  onChange={(e) => setCalcWeeks(e.target.value)}
                  className="w-full rounded border border-border bg-background py-1.5 px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-550 tabular-nums min-h-[36px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted font-sans mb-1">Days</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={calcDays}
                  onChange={(e) => setCalcDays(e.target.value)}
                  className="w-full rounded border border-border bg-background py-1.5 px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-550 tabular-nums min-h-[36px]"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Primary Result Box */}
            <div className="border border-border bg-card rounded-lg p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-zinc-500/5 to-transparent rounded-bl-full pointer-events-none" />

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans flex items-center gap-1.5 select-none">
                  <CalendarPlus className="h-3.5 w-3.5 text-zinc-500" />
                  Calculated Target Date
                </span>

                <div className="pt-2">
                  <div 
                    className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
                    data-testid="target-date-text"
                  >
                    {calcTargetDate ? formatLongDate(calcTargetDate) : <span className="text-zinc-400 dark:text-zinc-650 font-normal text-lg">Input target params...</span>}
                  </div>
                  {calcTargetDate && (
                    <div className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-2">
                      <span>Standard Short Format:</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">{formatShortDate(calcTargetDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {calcTargetDate && (
                <div className="border-t border-border/60 mt-6 pt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans">Copy formatted date to clipboard</span>
                  <button
                    onClick={() => handleCopy(formatLongDate(calcTargetDate), setCopiedAddSub)}
                    className="h-9 w-9 rounded-md border border-border bg-background hover:bg-muted/10 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                    title="Copy target date"
                  >
                    {copiedAddSub ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={DATE_CALCULATOR_FAQS} idPrefix="date-faq" />
      </div>
    </div>
  );
}
