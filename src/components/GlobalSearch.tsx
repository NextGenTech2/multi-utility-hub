"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ArrowRight, Command } from "lucide-react";
import { ALL_TOOLS } from "@/data/tools";
import { useCurrency } from "@/context/CurrencyContext";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { currency } = useCurrency();

  // Toggle search modal with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const mappedTools = ALL_TOOLS.map((tool) => {
    if (tool.href === "/calculators/mortgage") {
      return {
        ...tool,
        name: currency === "INR" ? "Home Loan Calculator" : "Mortgage Calculator",
        desc: currency === "INR"
          ? "Calculate your Equated Monthly Installment (EMI) for home loans."
          : "Calculate monthly mortgage payments including property tax, PMI, and home insurance.",
      };
    }
    return tool;
  });

  const filteredTools = mappedTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 md:w-64 rounded-md border border-border bg-card hover:bg-muted/30 transition-colors text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 group"
      >
        <Search className="h-4 w-4" />
        <span className="text-sm flex-1 text-left hidden sm:inline-block">Search utilities...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 group-hover:bg-muted/80">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop click area */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Search Box */}
          <div className="relative z-10 w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden mx-4 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools by name or description..."
                className="flex-1 bg-transparent text-base text-foreground focus:outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredTools.length > 0 ? (
                <div className="space-y-1">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground mb-1">{tool.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1 pr-4">{tool.desc}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No matching tools found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
