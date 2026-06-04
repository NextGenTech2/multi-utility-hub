"use client";

import { useState } from "react";
import { Copy, Trash2, Check, FileText, Sparkles } from "lucide-react";

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffResult, setDiffResult] = useState<{
    left: (string | null)[];
    right: (string | null)[];
    leftTypes: ("removed" | "unchanged")[];
    rightTypes: ("added" | "unchanged")[];
  } | null>(null);

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setDiffResult(null);
  };

  const handleLoadSample = () => {
    setOriginal(
      "DevToolHub is a utility workspace.\nIt runs 100% on the client side.\nThis is version 1.0 of the application.\nHave a wonderful day!"
    );
    setModified(
      "DevToolHub is a modern workstation.\nIt runs 100% on the client side.\nAll data stays in your browser.\nThis is version 1.1 of the application.\nHave a wonderful day!"
    );
    setDiffResult(null);
  };

  const handleCompare = () => {
    const oldLines = original.split("\n");
    const newLines = modified.split("\n");
    
    const left: (string | null)[] = [];
    const right: (string | null)[] = [];
    const leftTypes: ("removed" | "unchanged")[] = [];
    const rightTypes: ("added" | "unchanged")[] = [];
    
    let i = 0, j = 0;
    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        left.push(oldLines[i]);
        right.push(newLines[j]);
        leftTypes.push("unchanged");
        rightTypes.push("unchanged");
        i++;
        j++;
      } else if (i < oldLines.length && (j >= newLines.length || !newLines.slice(j).includes(oldLines[i]))) {
        left.push(oldLines[i]);
        right.push(null);
        leftTypes.push("removed");
        rightTypes.push("unchanged");
        i++;
      } else {
        left.push(null);
        right.push(newLines[j]);
        leftTypes.push("unchanged");
        rightTypes.push("added");
        j++;
      }
    }

    setDiffResult({ left, right, leftTypes, rightTypes });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Text Diff Checker
        </h1>
        <p className="text-sm text-muted">
          Compare two versions of text side-by-side to highlight added, removed, or modified lines.
        </p>
      </div>

      {/* Editor Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-zinc-500" />
              Original Text (Left)
            </span>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Enter original draft here..."
            className="w-full h-44 resize-y border-0 p-4 font-mono text-sm bg-transparent text-foreground focus:outline-none focus:ring-0 placeholder-zinc-500 dark:placeholder-zinc-650"
            spellCheck="false"
            translate="no"
          />
        </div>

        {/* Modified */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-zinc-500" />
              Modified Text (Right)
            </span>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Enter modified draft here..."
            className="w-full h-44 resize-y border-0 p-4 font-mono text-sm bg-transparent text-foreground focus:outline-none focus:ring-0 placeholder-zinc-500 dark:placeholder-zinc-650"
            spellCheck="false"
            translate="no"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 select-none">
        <button
          onClick={handleCompare}
          className="px-5 py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5 text-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Compare Texts
        </button>
        <button
          onClick={handleLoadSample}
          className="px-4 py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer min-h-[38px]"
        >
          Load Demo
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors cursor-pointer min-h-[38px] text-red-500 border-red-500/10 hover:bg-red-550/10"
        >
          Clear All
        </button>
      </div>

      {/* Comparison Diff Screen */}
      {diffResult && (
        <div className="border border-border bg-card rounded-lg overflow-hidden shadow-sm">
          <div className="border-b border-border bg-background px-4 py-2.5 select-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Side-By-Side Comparison Results
            </span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-border bg-zinc-950 font-mono text-xs overflow-x-auto select-text">
            {/* Left Col - Original Pane */}
            <div className="min-w-[320px] p-4 space-y-1" translate="no">
              {diffResult.left.map((line, idx) => {
                const type = diffResult.leftTypes[idx];
                return (
                  <div
                    key={`l-${idx}`}
                    className={`flex gap-3 px-2 py-0.5 rounded leading-normal ${
                      type === "removed"
                        ? "bg-red-500/15 text-red-200 border-l-2 border-red-500"
                        : line === null
                        ? "opacity-20 select-none bg-zinc-900/40"
                        : "text-zinc-400"
                    }`}
                  >
                    <span className="w-6 text-right select-none text-zinc-650 font-sans">{idx + 1}</span>
                    <span className="whitespace-pre-wrap">{line === null ? " " : line}</span>
                  </div>
                );
              })}
            </div>

            {/* Right Col - Modified Pane */}
            <div className="min-w-[320px] p-4 space-y-1" translate="no">
              {diffResult.right.map((line, idx) => {
                const type = diffResult.rightTypes[idx];
                return (
                  <div
                    key={`r-${idx}`}
                    className={`flex gap-3 px-2 py-0.5 rounded leading-normal ${
                      type === "added"
                        ? "bg-emerald-500/15 text-emerald-200 border-l-2 border-emerald-500"
                        : line === null
                        ? "opacity-20 select-none bg-zinc-900/40"
                        : "text-zinc-400"
                    }`}
                  >
                    <span className="w-6 text-right select-none text-zinc-650 font-sans">{idx + 1}</span>
                    <span className="whitespace-pre-wrap">{line === null ? " " : line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
