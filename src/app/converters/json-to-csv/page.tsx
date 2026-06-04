"use client";

import { useState } from "react";
import { FileSpreadsheet, Trash2, AlertCircle, Copy, Check, Download } from "lucide-react";

const DEFAULT_JSON = `[
  {
    "id": 101,
    "name": "Reyaansh Sharma",
    "profile": {
      "role": "Lead Architect",
      "department": "Engineering"
    },
    "tags": ["core", "api"],
    "active": true
  },
  {
    "id": 102,
    "name": "Ananya Iyer",
    "profile": {
      "role": "Product Manager",
      "department": "Design"
    },
    "tags": ["ux", "growth"],
    "active": false
  },
  {
    "id": 103,
    "name": "Kabir Mehta",
    "profile": {
      "role": "Senior Engineer",
      "department": "Engineering"
    },
    "tags": ["frontend"],
    "active": true
  }
]`;

// Recursive object flattening function using dot notation
function flattenObject(
  obj: unknown,
  prefix = "",
  res: Record<string, unknown> = {}
): Record<string, unknown> {
  if (obj === null || obj === undefined) {
    res[prefix] = "";
    return res;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      res[prefix] = "[]";
    } else {
      // Check if it's a primitive array (e.g. ["core", "api"])
      const isPrimitiveArray = obj.every(
        (item) => typeof item !== "object" || item === null
      );
      if (isPrimitiveArray) {
        res[prefix] = obj.join("; ");
      } else {
        obj.forEach((item, index) => {
          flattenObject(item, prefix ? `${prefix}.${index}` : `${index}`, res);
        });
      }
    }
    return res;
  }

  if (typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        const propName = prefix ? `${prefix}.${key}` : key;
        const val = record[key];
        if (val !== null && typeof val === "object") {
          flattenObject(val, propName, res);
        } else {
          res[propName] = val;
        }
      }
    }
    return res;
  }

  res[prefix] = obj;
  return res;
}

// Escapes values following RFC 4180 CSV specifications
function escapeCSVValue(val: unknown): string {
  if (val === null || val === undefined) {
    return "";
  }
  let str: string;
  if (typeof val === "object") {
    str = JSON.stringify(val);
  } else {
    str = String(val);
  }

  // Wrap in quotes if it has double-quotes, commas, or newlines
  if (/[",\r\n]/.test(str)) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

// Separate pure helper function for parsing and conversion
function convertJSONToCSV(input: string): { csv: string; error: string | null } {
  if (!input.trim()) {
    return { csv: "", error: null };
  }

  try {
    const parsed = JSON.parse(input) as unknown;
    if (parsed === null || typeof parsed !== "object") {
      throw new Error("Input must be a valid JSON array or object.");
    }

    let items: Record<string, unknown>[];
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        throw new Error("JSON array is empty.");
      }
      const hasObject = parsed.some(
        (item) => item !== null && typeof item === "object" && !Array.isArray(item)
      );
      if (!hasObject) {
        throw new Error("JSON array must contain objects.");
      }
      items = parsed.filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object" && !Array.isArray(item)
      );
    } else {
      items = [parsed as Record<string, unknown>];
    }

    const flattenedItems: Record<string, unknown>[] = [];
    const headerSet = new Set<string>();

    items.forEach((item) => {
      const flattened = flattenObject(item);
      flattenedItems.push(flattened);
      Object.keys(flattened).forEach((k) => headerSet.add(k));
    });

    if (headerSet.size === 0) {
      throw new Error("No properties found to convert to columns.");
    }

    const headers = Array.from(headerSet);
    const csvRows = [headers.join(",")];

    flattenedItems.forEach((item) => {
      const rowValues = headers.map((header) => escapeCSVValue(item[header]));
      csvRows.push(rowValues.join(","));
    });

    return { csv: csvRows.join("\n"), error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to convert JSON";
    return { csv: "", error: `Invalid JSON: ${message}` };
  }
}

export default function JsonToCsvPage() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  
  // Use lazy state initializers to populate initial data on first mount cleanly
  const [csvOutput, setCsvOutput] = useState(() => {
    return convertJSONToCSV(DEFAULT_JSON).csv;
  });
  
  const [error, setError] = useState<string | null>(() => {
    return convertJSONToCSV(DEFAULT_JSON).error;
  });

  const [copied, setCopied] = useState(false);

  const handleConvert = (input: string) => {
    const result = convertJSONToCSV(input);
    setCsvOutput(result.csv);
    setError(result.error);
  };

  const handleClear = () => {
    setJsonInput("");
    setCsvOutput("");
    setError(null);
  };

  const loadSample = () => {
    setJsonInput(DEFAULT_JSON);
    handleConvert(DEFAULT_JSON);
  };

  const handleCopy = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `converted_data_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          JSON to CSV Converter
        </h1>
        <p className="text-sm text-muted">
          Flatten complex, nested JSON arrays or objects into standard tabular CSV formats locally.
        </p>
      </div>

      {/* Split Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[calc(100vh-14rem)]">
        {/* Left Panel: JSON Input Area */}
        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg overflow-hidden h-[450px] lg:h-full">
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 select-none">
              <FileSpreadsheet className="h-4 w-4 text-zinc-500" />
              Raw JSON Input
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleConvert(jsonInput)}
                className="text-xs flex items-center justify-center font-semibold border border-border bg-card hover:bg-muted/10 transition-colors py-1 px-3 rounded cursor-pointer min-h-[30px] text-foreground"
              >
                Convert Data
              </button>
              <button
                onClick={loadSample}
                className="text-xs flex items-center justify-center bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors py-1 px-2.5 rounded cursor-pointer min-h-[30px]"
              >
                Load Sample
              </button>
              <button
                onClick={handleClear}
                className="text-xs flex items-center justify-center gap-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors py-1 px-2.5 rounded cursor-pointer min-h-[30px]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-full p-4 bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none text-sm leading-relaxed placeholder-zinc-400 dark:placeholder-zinc-600 select-text"
              placeholder="Paste raw JSON here (an array of objects or a single object)..."
              spellCheck="false"
              translate="no"
            />
          </div>

          {/* Syntax Error Warning Badge */}
          {error && (
            <div className="border-t border-zinc-900 bg-zinc-900/40 px-4 py-3 select-none">
              <div className="flex items-start gap-2.5 p-3 rounded border border-amber-500/20 bg-amber-950/20 text-amber-400 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Invalid JSON:</span>{" "}
                  <span className="opacity-90">{error.replace("Invalid JSON: ", "")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Output Preview Canvas */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden h-[450px] lg:h-full shadow-xs">
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 select-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              CSV Tabular Output
            </span>
            {csvOutput && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs flex items-center justify-center gap-1.5 border border-border bg-card hover:bg-muted/10 transition-colors py-1 px-3 rounded cursor-pointer min-h-[30px] font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy CSV
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-xs flex items-center justify-center gap-1.5 border border-border bg-card hover:bg-muted/10 transition-colors py-1 px-3 rounded cursor-pointer min-h-[30px] font-semibold text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV
                </button>
              </div>
            )}
          </div>

          {/* Mono Preview Canvas */}
          <div className="flex-1 p-4 overflow-auto bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 font-mono text-sm leading-relaxed [color-scheme:light] dark:[color-scheme:dark]">
            {csvOutput ? (
              <pre className="whitespace-pre overflow-x-auto select-text select-all" translate="no">
                {csvOutput}
              </pre>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-600 p-8 select-none">
                <FileSpreadsheet className="h-10 w-10 text-zinc-700 mb-3" />
                <p className="text-sm">Tabular CSV results will render here after conversion.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
