import Link from "next/link";
import { Code2, Type, Percent, FileJson, Key, Hash, FileText, ShieldAlert, Clock, PercentCircle, RefreshCw, ArrowRight, FileCode, FileSpreadsheet, Files } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

export default function Home() {
  const categories = [
    {
      title: "Developer Utilities",
      description: "Data parsing, formats & tokens",
      icon: Code2,
      tools: [
        {
          name: "JSON Suite",
          href: "/formatters/json-suite",
          icon: FileJson,
          description: "Format, validate, parse XML, or diff-compare complex JSON objects.",
        },
        {
          name: "JSON to CSV",
          href: "/converters/json-to-csv",
          icon: FileSpreadsheet,
          description: "Flatten complex, nested JSON arrays or objects into standard tabular CSV formats instantly.",
        },
        {
          name: "Web Tokens",
          href: "/developers/jwt-decoder",
          icon: Key,
          description: "Decode JWT payloads, encode/decode Base64 and URLs instantly.",
        },
        {
          name: "Crypto / Hashing",
          href: "/developers/hash-generator",
          icon: Hash,
          description: "Generate MD5, SHA-256, and secure Bcrypt hashes directly in-browser.",
        },
        {
          name: "Swagger Previewer",
          href: "/developers/swagger-viewer",
          icon: FileCode,
          description: "Render YAML to interactive API docs in real time.",
        },
      ],
    },
    {
      title: "Text & String Tools",
      description: "Diff checkers & syntax testing",
      icon: Type,
      tools: [
        {
          name: "Diff Checker",
          href: "/text/diff-checker",
          icon: FileText,
          description: "Compare raw text blocks side-by-side to highlight character changes.",
        },
        {
          name: "Regex Tester",
          href: "/developers/regex-tester",
          icon: ShieldAlert,
          description: "Write and evaluate regular expressions with real-time matching.",
        },
        {
          name: "Case Converter",
          href: "/text/case-converter",
          icon: Type,
          description: "Convert text between UPPER, lower, camelCase, snake_case with real-time counters.",
        },
      ],
    },
    {
      title: "Math & Finance",
      description: "Calculators, times & scales",
      icon: Percent,
      tools: [
        {
          name: "Percentage Calculator",
          href: "/calculators/percentage",
          icon: PercentCircle,
          description: "Quickly solve multi-variation percentage formulas on the fly.",
        },
        {
          name: "Epoch Converter",
          href: "/converters/unix-epoch",
          icon: Clock,
          description: "Convert Unix timestamps to human-readable calendar dates.",
        },
        {
          name: "Unit Converter",
          href: "/converters/unit",
          icon: RefreshCw,
          description: "Convert data bytes, lengths, weights, and file capacities.",
        },
      ],
    },
    {
      title: "Document & File Utilities",
      description: "File conversions & formatting tools",
      icon: Files,
      tools: [
        {
          name: "Document Converter",
          href: "/converters/docx-to-pdf",
          icon: FileText,
          description: "Convert Word documents (.docx) to PDF and PDF documents to Word (.docx) formats.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto">
      {/* Hero Header Section */}
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-border/40 pb-6 select-none">
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            All the tools you need,{" "}
            <span className="bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600 dark:from-zinc-400 dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
            Fast, privacy-focused, 100% client-side web utilities for developers and digital professionals.
            Zero latency, zero logs, zero cookie analytics.
          </p>
        </div>
        <div className="shrink-0 mt-2">
          <ShareButton 
            title="DevToolHub | All Major Utilities in One Place" 
            text="Access high-performance developer tools, conversion tools, formatting suites, and utilities client-side." 
          />
        </div>
      </header>

      {/* Responsive Column-Category Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.title} className="space-y-5">
              {/* Category Header */}
              <div className="flex items-center gap-2 border-b border-border/80 pb-3 select-none">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-muted/20 text-muted-foreground">
                  <CategoryIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-sm font-semibold tracking-tight text-foreground leading-none">
                    {category.title}
                  </h2>
                  <span className="text-[10px] text-muted-foreground font-normal mt-0.5">
                    {category.description}
                  </span>
                </div>
              </div>

              {/* Category Tools List */}
              <div className="space-y-4">
                {category.tools.map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex flex-col justify-between p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-600 min-h-[140px] focus:outline-none focus:ring-1 focus:ring-foreground/20 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4 select-none">
                          <div className="flex h-9 w-9 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors">
                            <ToolIcon className="h-4.5 w-4.5 text-foreground/80 group-hover:text-foreground transition-colors" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-zinc-400 dark:text-zinc-650 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground tracking-tight mb-1.5">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
