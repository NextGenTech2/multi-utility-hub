"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, Check, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";

interface MatchResult {
  text: string;
  index: number;
  groups: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,6})");
  const [testText, setTestText] = useState("Contact us at support@devtoolhub.com or sales-team@work.org for details.");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(true);
  const [flagM, setFlagM] = useState(false);
  
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Auto calculate matches when dependencies update
  useEffect(() => {
    setError(null);
    setMatches([]);
    if (!pattern.trim()) return;

    try {
      const flags = (flagG ? "g" : "") + (flagI ? "i" : "") + (flagM ? "m" : "");
      const regex = new RegExp(pattern, flags);
      
      // Prevent infinite loops for patterns that match empty strings
      const testRegex = new RegExp(pattern);
      if (testRegex.test("")) {
        setError("Regular expression matches empty strings, which can cause browser freezing. Please refine your pattern.");
        return;
      }

      const results: MatchResult[] = [];
      let match;
      
      if (flags.includes("g")) {
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1).map(g => g || "")
          });
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1).map(g => g || "")
          });
        }
      }
      setMatches(results);
    } catch (e: any) {
      setError(e.message || "Invalid regular expression pattern.");
    }
  }, [pattern, testText, flagG, flagI, flagM]);

  const handleClear = () => {
    setPattern("");
    setTestText("");
    setMatches([]);
    setError(null);
  };

  const handleLoadSample = () => {
    setPattern("\\b(0?[1-9]|[12]\\d|3[01])[-/\\.](0?[1-9]|1[012])[-/\\.](19|20)\\d\\d\\b");
    setTestText("Important key dates are 03/06/2026, 12-10-1998, and 31.12.2025.");
  };

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const getHighlightedText = () => {
    if (error || !pattern || !testText) return escapeHtml(testText);
    
    try {
      const flags = (flagG ? "g" : "") + (flagI ? "i" : "") + (flagM ? "m" : "");
      const intervals: { start: number; end: number }[] = [];
      let match;
      const regex = new RegExp(pattern, flags);

      if (flags.includes("g")) {
        while ((match = regex.exec(testText)) !== null) {
          if (match[0].length === 0) break;
          intervals.push({ start: match.index, end: match.index + match[0].length });
        }
      } else {
        match = regex.exec(testText);
        if (match && match[0].length > 0) {
          intervals.push({ start: match.index, end: match.index + match[0].length });
        }
      }

      if (intervals.length === 0) return escapeHtml(testText);

      let result = "";
      let lastIdx = 0;
      for (const interval of intervals) {
        const before = testText.slice(lastIdx, interval.start);
        const matched = testText.slice(interval.start, interval.end);
        
        result += escapeHtml(before) + `<span class="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border-b border-emerald-500/80 px-0.5 rounded-sm select-all">${escapeHtml(matched)}</span>`;
        lastIdx = interval.end;
      }
      result += escapeHtml(testText.slice(lastIdx));
      return result;
    } catch {
      return escapeHtml(testText);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Regex Tester &amp; Live Parser
        </h1>
        <p className="text-sm text-muted">
          Test regular expression patterns dynamically. Matches and capture groupings are parsed live.
        </p>
      </div>

      {/* Editor Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left pane - Configurations */}
        <div className="space-y-5 flex flex-col">
          {/* Pattern input */}
          <div className="flex flex-col border border-border bg-card rounded-lg p-4 space-y-3.5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
              <ShieldAlert className="h-4 w-4 text-zinc-500" />
              Regular Expression Pattern
            </h2>
            <div className="flex items-center gap-2 font-mono text-sm" translate="no">
              <span className="text-zinc-500 text-lg font-bold">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern (e.g. [a-z]+)"
                className="flex-1 rounded border border-border bg-background py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px] placeholder-zinc-500 dark:placeholder-zinc-650"
              />
              <span className="text-zinc-500 text-lg font-bold">/</span>
            </div>

            {/* Flags */}
            <div className="flex gap-4 pt-1 select-none">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={flagG}
                  onChange={(e) => setFlagG(e.target.checked)}
                  className="rounded border-border focus:ring-0 text-foreground cursor-pointer"
                />
                <span>global (g)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={flagI}
                  onChange={(e) => setFlagI(e.target.checked)}
                  className="rounded border-border focus:ring-0 text-foreground cursor-pointer"
                />
                <span>ignore case (i)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={flagM}
                  onChange={(e) => setFlagM(e.target.checked)}
                  className="rounded border-border focus:ring-0 text-foreground cursor-pointer"
                />
                <span>multiline (m)</span>
              </label>
            </div>
          </div>

          {/* Test Text Canvas */}
          <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden shadow-sm flex-1">
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Test Text
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleLoadSample}
                  className="text-xs text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px]"
                >
                  Load Demo
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px] text-red-500"
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text payload to match against here..."
              className="w-full flex-1 min-h-[200px] md:min-h-[250px] resize-y border-0 p-4 font-mono text-sm bg-transparent text-foreground focus:outline-none focus:ring-0 placeholder-zinc-500 dark:placeholder-zinc-650"
              spellCheck="false"
              translate="no"
            />
          </div>
        </div>

        {/* Right Pane - Results & Highlights */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden min-h-[400px]">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 select-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Live Output Summary
            </span>
            {matches.length > 0 && !error && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/10 tabular-nums">
                {matches.length} matches
              </span>
            )}
          </div>
          
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 overflow-y-auto space-y-5">
            {error ? (
              /* Regex Compile Error Block */
              <div className="flex items-start gap-2.5 p-3.5 rounded border border-red-500/20 dark:border-red-500/25 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold tracking-tight">Regex Pattern Error</p>
                  <p className="mt-1 opacity-90">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Highlighted text block */}
                <div className="space-y-1.5 select-none">
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Highlighted Matches:
                  </span>
                  <div
                    className="font-mono text-sm bg-white dark:bg-zinc-900/60 rounded p-3 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 leading-relaxed whitespace-pre-wrap break-all min-h-[120px]"
                    translate="no"
                    dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
                  />
                </div>

                {/* Match Capture list */}
                <div className="space-y-2 select-text">
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Captured Groups Details:
                  </span>
                  <div className="space-y-2">
                    {matches.length === 0 ? (
                      <p className="text-xs text-red-500 dark:text-red-400 font-semibold italic">No matches found in the text canvas.</p>
                    ) : (
                      matches.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-2.5 space-y-1 text-xs"
                          translate="no"
                        >
                          <div className="flex items-center justify-between font-mono text-zinc-500 dark:text-zinc-400 select-none">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">Match {idx + 1}</span>
                            <span className="text-[10px] tabular-nums">Index: {m.index}</span>
                          </div>
                          <p className="font-mono text-emerald-600 dark:text-emerald-400 select-all font-bold break-all bg-emerald-50/50 dark:bg-emerald-950/20 p-1.5 rounded mt-1 border border-emerald-200 dark:border-emerald-900/30">
                            {m.text}
                          </p>
                          {m.groups.length > 0 && (
                            <div className="mt-1.5 pl-3 border-l border-zinc-200 dark:border-zinc-800 space-y-1">
                              {m.groups.map((group, gIdx) => (
                                <p key={gIdx} className="font-mono text-zinc-500 dark:text-zinc-400 text-[11px] break-all">
                                  <span className="select-none font-bold text-zinc-650 dark:text-zinc-500">Group {gIdx + 1}: </span>
                                  <span className="text-zinc-700 dark:text-zinc-300 select-all">{group || '""'}</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
