"use client";

import { useState, useEffect } from "react";
import { Clock, Copy, Check, RotateCcw, Calendar, RefreshCw } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { UNIX_EPOCH_FAQS } from "@/data/faqs";


export default function EpochConverterPage() {
  // Live Clock States
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [copiedLive, setCopiedLive] = useState(false);

  // Timestamp to Date Converter States
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [unit, setUnit] = useState<"s" | "ms">("s");
  const [convertedDateGMT, setConvertedDateGMT] = useState("");
  const [convertedDateLocal, setConvertedDateLocal] = useState("");
  const [timestampError, setTimestampError] = useState<string | null>(null);
  const [copiedGMT, setCopiedGMT] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState(false);

  // Date to Timestamp Converter States
  const [inputDate, setInputDate] = useState("");
  const [convertedTimestamp, setConvertedTimestamp] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [copiedTimestamp, setCopiedTimestamp] = useState(false);

  // Live Clock Ticker Effect
  useEffect(() => {
    if (!isLive) return;
    setCurrentEpoch(Math.floor(Date.now() / 1000));
    
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Timestamp to Date conversion handler
  const handleTimestampToDate = () => {
    setTimestampError(null);
    setConvertedDateGMT("");
    setConvertedDateLocal("");
    if (!inputTimestamp.trim()) return;

    try {
      const val = parseFloat(inputTimestamp.trim());
      if (isNaN(val)) {
        throw new Error("Timestamp must be a numerical value.");
      }

      // Convert seconds to milliseconds if needed
      const timeMs = unit === "s" ? val * 1000 : val;
      const date = new Date(timeMs);
      
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date structure generated from timestamp.");
      }

      setConvertedDateGMT(date.toUTCString());
      setConvertedDateLocal(date.toString());
    } catch (e: any) {
      setTimestampError(e.message || "Failed to parse timestamp.");
    }
  };

  // Date to Timestamp conversion handler
  const handleDateToTimestamp = () => {
    setDateError(null);
    setConvertedTimestamp("");
    if (!inputDate) return;

    try {
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Please adjust date inputs.");
      }
      setConvertedTimestamp(Math.floor(date.getTime() / 1000).toString());
    } catch (e: any) {
      setDateError(e.message || "Failed to parse date.");
    }
  };

  const handleCopy = (val: string, setCopiedState: (v: boolean) => void) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleSetToCurrent = () => {
    setInputTimestamp(Math.floor(Date.now() / 1000).toString());
    setUnit("s");
    setTimestampError(null);
    setConvertedDateGMT("");
    setConvertedDateLocal("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Epoch Timestamp Converter
          </h1>
          <p className="text-sm text-muted">
            Translate Unix epoch timestamps into UTC or local dates, or transform human dates back to Unix seconds. This epoch converter online utility operates instantly.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="Epoch Converter & Unix Timestamp Converter | DevToolHub" 
            text="Convert Unix epoch timestamps to human-readable dates and UTC online. 100% Client-side." 
          />
        </div>
      </div>


      {/* Live Clock Ticker */}
      <div className="border border-border bg-card rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground animate-pulse">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-sans font-bold uppercase tracking-wider">Current Unix Epoch Time</p>
            <p 
              className="text-2xl font-bold tracking-tight text-foreground font-mono tabular-nums mt-0.5" 
              translate="no"
            >
              {currentEpoch}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto select-none">
          <button
            onClick={() => handleCopy(currentEpoch.toString(), setCopiedLive)}
            className="flex-1 md:flex-none text-xs flex items-center justify-center gap-1.5 border border-border bg-card hover:bg-muted/10 py-2 px-4 rounded-md font-semibold cursor-pointer min-h-[38px] text-foreground transition-colors"
          >
            {copiedLive ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Timestamp
              </>
            )}
          </button>
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex-1 md:flex-none text-xs font-semibold py-2 px-4 rounded-md border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer min-h-[38px]"
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* Grid of Converters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timestamp to Date Converter */}
        <div className="border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
              <Calendar className="h-4 w-4 text-zinc-500" />
              Timestamp to Date
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputTimestamp}
                  onChange={(e) => setInputTimestamp(e.target.value)}
                  placeholder="e.g. 1780498800"
                  className="flex-1 rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground placeholder-zinc-500 dark:placeholder-zinc-650 min-h-[38px] font-mono"
                  translate="no"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "s" | "ms")}
                  className="rounded border border-border bg-background py-2 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px]"
                >
                  <option value="s">Seconds (s)</option>
                  <option value="ms">Millis (ms)</option>
                </select>
              </div>
              
              <div className="flex gap-2 select-none">
                <button
                  onClick={handleTimestampToDate}
                  className="flex-1 py-2 text-xs font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer min-h-[36px]"
                >
                  Convert
                </button>
                <button
                  onClick={handleSetToCurrent}
                  className="px-3 py-2 text-xs font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer min-h-[36px]"
                >
                  Set to Current
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3.5">
            {timestampError && (
              <div className="text-xs text-red-500 bg-red-500/10 p-2.5 rounded border border-red-500/15">
                {timestampError}
              </div>
            )}
            
            <div className="space-y-3 font-mono text-xs">
              {/* GMT Row */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                  <span>GMT Date (UTC)</span>
                  {convertedDateGMT && (
                    <button
                      onClick={() => handleCopy(convertedDateGMT, setCopiedGMT)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedGMT ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </button>
                  )}
                </div>
                <div className="bg-background border border-border p-2 rounded min-h-[36px] flex items-center text-zinc-300 break-all select-all" translate="no">
                  {convertedDateGMT || <span className="text-zinc-600 dark:text-zinc-700 font-sans text-xs">GMT Date will appear here...</span>}
                </div>
              </div>
              
              {/* Local Row */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                  <span>Local Date</span>
                  {convertedDateLocal && (
                    <button
                      onClick={() => handleCopy(convertedDateLocal, setCopiedLocal)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLocal ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </button>
                  )}
                </div>
                <div className="bg-background border border-border p-2 rounded min-h-[36px] flex items-center text-zinc-300 break-all select-all" translate="no">
                  {convertedDateLocal || <span className="text-zinc-600 dark:text-zinc-700 font-sans text-xs">Local Date will appear here...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date to Timestamp Converter */}
        <div className="border border-border bg-card rounded-lg p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
              <RefreshCw className="h-4 w-4 text-zinc-500" />
              Date to Timestamp
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="datetime-local"
                step="1"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full rounded border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px] font-sans"
              />
              <button
                onClick={handleDateToTimestamp}
                disabled={!inputDate}
                className="w-full py-2 text-xs font-semibold rounded border border-border bg-card hover:bg-muted/10 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer min-h-[36px]"
              >
                Get Timestamp
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3.5">
            {dateError && (
              <div className="text-xs text-red-500 bg-red-500/10 p-2.5 rounded border border-red-500/15">
                {dateError}
              </div>
            )}
            
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                <span>Unix Timestamp (Seconds)</span>
                {convertedTimestamp && (
                  <button
                    onClick={() => handleCopy(convertedTimestamp, setCopiedTimestamp)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTimestamp ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </button>
                )}
              </div>
              <div className="bg-background border border-border p-2 rounded min-h-[36px] flex items-center text-zinc-300 select-all" translate="no">
                {convertedTimestamp || <span className="text-zinc-600 dark:text-zinc-700 font-sans text-xs">Timestamp will appear here...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={UNIX_EPOCH_FAQS} idPrefix="epoch-faq" />
      </div>
    </div>
  );
}
