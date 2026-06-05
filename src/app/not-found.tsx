"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Terminal, Home, Search, Layers, ArrowRight } from "lucide-react";

const ALL_TOOLS = [
  { name: "JSON Suite", href: "/formatters/json-suite", desc: "Format, validate, parse XML, or diff-compare complex JSON objects." },
  { name: "JSON to CSV", href: "/converters/json-to-csv", desc: "Flatten complex, nested JSON arrays or objects into standard tabular CSV formats." },
  { name: "CSV to JSON", href: "/converters/csv-to-json", desc: "Transform spreadsheet sheets and comma-separated layouts into structured JSON arrays." },
  { name: "Web Tokens", href: "/developers/jwt-decoder", desc: "Decode JWT payloads, encode/decode Base64 and URLs instantly." },
  { name: "Crypto / Hashing", href: "/developers/hash-generator", desc: "Generate MD5, SHA-256, and secure Bcrypt hashes directly in-browser." },
  { name: "Swagger Previewer", href: "/developers/swagger-viewer", desc: "Render YAML to interactive API docs in real time." },
  { name: "Regex Tester", href: "/developers/regex-tester", desc: "Write and evaluate regular expressions with real-time matching." },
  { name: "Diff Checker", href: "/text/diff-checker", desc: "Compare raw text blocks side-by-side to highlight character changes." },
  { name: "Case Converter", href: "/text/case-converter", desc: "Convert text between UPPER, lower, camelCase, snake_case with real-time counters." },
  { name: "Percentage Calculator", href: "/calculators/percentage", desc: "Quickly solve multi-variation percentage formulas on the fly." },
  { name: "Epoch Converter", href: "/converters/unix-epoch", desc: "Convert Unix timestamps to human-readable calendar dates." },
  { name: "Unit Converter", href: "/converters/unit", desc: "Convert data bytes, lengths, weights, and file capacities." },
  { name: "Document Converter", href: "/converters/docx-to-pdf", desc: "Convert Word documents (.docx) to PDF and PDF documents to Word (.docx) formats." },
  { name: "YouTube Asset Extractor", href: "/media/youtube-metadata", desc: "Extract video IDs and CDNs thumbnails." }
];

export default function NotFound() {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredTools = ALL_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleBrowseClick = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        // On mobile: open the navigation sidebar drawer
        window.dispatchEvent(new Event("toggle-sidebar"));
      } else {
        // On desktop: focus the search input field on the page
        searchInputRef.current?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center select-none animate-in fade-in duration-300">
      {/* Premium Glassmorphic Terminal Card */}
      <div className="w-full max-w-lg border border-border bg-card rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono text-muted tracking-tight">shell_process_error.sh</span>
          <div className="w-12" /> {/* spacer */}
        </div>

        {/* Terminal Body */}
        <div className="p-6 bg-zinc-950 font-mono text-left text-xs leading-relaxed space-y-3.5">
          <p className="text-zinc-500"># ApexToolHub System Diagnostics</p>
          <div className="flex items-start gap-2">
            <span className="text-zinc-500">$</span>
            <span className="text-zinc-100">curl -I https://multiutilityhub.com/requested-endpoint</span>
          </div>
          <div className="space-y-1">
            <p className="text-red-400 font-bold">HTTP/1.1 404 NOT FOUND</p>
            <p className="text-zinc-400">Content-Type: text/plain; charset=UTF-8</p>
            <p className="text-zinc-400">Server: EdgeNetwork/3.5</p>
          </div>
          <p className="text-zinc-500"># Traceback log:</p>
          <p className="text-amber-500">
            [WARNING] The utility route requested does not resolve to an active controller.
            Ensure you did not input dynamic parameters directly in the URL bar.
          </p>
          <p className="text-zinc-500">
            $ <span className="text-zinc-300 animate-pulse">█</span>
          </p>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mb-3">
        Page Not Found
      </h1>
      <p className="text-muted text-sm sm:text-base max-w-md leading-relaxed mb-6">
        The tool or page you are looking for has been relocated in our directory restructure or does not exist.
      </p>

      {/* Search Input Box with Results */}
      <div className="w-full max-w-lg mb-8 space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all utility tools..."
            className="w-full min-h-[48px] pl-11 pr-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card text-base text-foreground focus:ring-1 focus:ring-foreground focus:outline-none placeholder-zinc-500 shadow-sm"
          />
        </div>

        {/* Filtered Search Results dropdown list */}
        {search && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-card rounded-lg p-2 max-h-[220px] overflow-y-auto text-left shadow-lg space-y-1 divide-y divide-zinc-100 dark:divide-zinc-900 animate-in fade-in duration-200">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-md transition-colors group first:border-0 border-t"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-bold text-foreground leading-none mb-1">{tool.name}</span>
                    <span className="text-xs text-muted leading-tight truncate">{tool.desc}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-450 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))
            ) : (
              <p className="text-xs text-muted text-center py-4">No matching tools found.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 w-full sm:w-auto">
        <Link
          href="/"
          className="min-h-[48px] px-6 rounded-md bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <button
          onClick={handleBrowseClick}
          className="min-h-[48px] px-6 rounded-md border border-border bg-card text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Layers className="h-4 w-4 text-muted" />
          Browse Tool Directory
        </button>
      </div>
    </div>
  );
}
