"use client";

import { useState, useRef, DragEvent } from "react";
import Papa from "papaparse";
import { TableProperties, Upload, Trash2, Copy, Check, AlertCircle, FileSpreadsheet, RefreshCw, FileText } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { CSV_TO_JSON_FAQS } from "@/data/faqs";


export default function CsvToJsonPage() {
  const [file, setFile] = useState<File | null>(null);
  const [inferTypes, setInferTypes] = useState(true);
  const [headerIndex, setHeaderIndex] = useState(0);
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Type Inference logic specified by USER
  function inferType(value: string) {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
    if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
    return value;
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      validateAndSetFile(selectedFiles[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    
    if (validExtensions.includes(fileExtension)) {
      setFile(selectedFile);
      setJsonOutput("");
      setError(null);
    } else {
      setFile(null);
      setError("Parsing Error: Unsupported file format. Please upload a valid CSV or Excel file (.csv, .xlsx, .xls).");
    }
  };

  const processRawData = (data: string[][]) => {
    try {
      if (headerIndex < 0 || headerIndex >= data.length) {
        throw new Error("Header Row Index is out of range.");
      }
      
      const headers = data[headerIndex].map(h => String(h).trim());
      if (headers.length === 0 || headers.every(h => !h)) {
        throw new Error("Invalid or empty headers row.");
      }

      const resultList: Record<string, any>[] = [];
      
      for (let i = headerIndex + 1; i < data.length; i++) {
        const row = data[i];
        // Skip empty lines
        if (row.length === 0 || row.every(cell => !cell || cell.trim() === "")) {
          continue;
        }
        
        const obj: Record<string, any> = {};
        headers.forEach((header, colIndex) => {
          if (!header) return; // skip empty headers
          const cellValue = row[colIndex] !== undefined ? String(row[colIndex]).trim() : "";
          
          if (inferTypes) {
            obj[header] = inferType(cellValue);
          } else {
            obj[header] = cellValue;
          }
        });
        
        resultList.push(obj);
      }

      setJsonOutput(JSON.stringify(resultList, null, 2));
      setLoading(false);
    } catch (err: any) {
      setError(`Parsing Error: Ensure your CSV/Excel file contains valid headers and data structure.`);
      setLoading(false);
    }
  };

  const handleConvert = () => {
    if (!file) {
      setError("Parsing Error: Please select or drop a valid file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setJsonOutput("");

    try {
      const reader = new FileReader();
      
      if (file.name.endsWith(".csv")) {
        // Stream CSV using PapaParse (handles larger files safely without UI lock)
        Papa.parse(file, {
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as string[][];
            if (!data || data.length === 0) {
              setError("Parsing Error: Ensure your CSV/Excel file contains valid headers and data structure.");
              setLoading(false);
              return;
            }
            processRawData(data);
          },
          error: () => {
            setError("Parsing Error: Ensure your CSV/Excel file contains valid headers and data structure.");
            setLoading(false);
          }
        });
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        reader.onload = async (e) => {
          try {
            const rawBytes = new Uint8Array(e.target?.result as ArrayBuffer);
            const XLSX = await import("xlsx");
            const workbook = XLSX.read(rawBytes, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            const sheetData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
            if (!sheetData || sheetData.length === 0) {
              setError("Parsing Error: Ensure your CSV/Excel file contains valid headers and data structure.");
              setLoading(false);
              return;
            }

            // Standardize format to 2D array strings
            const formattedData = sheetData.map(row => 
              row.map(val => val !== undefined && val !== null ? String(val) : "")
            );

            processRawData(formattedData);
          } catch {
            setError("Parsing Error: Ensure your CSV/Excel file contains valid headers and data structure.");
            setLoading(false);
          }
        };

        reader.onerror = () => {
          setError("Parsing Error: Failed to read Excel file bytes.");
          setLoading(false);
        };

        reader.readAsArrayBuffer(file);
      }
    } catch {
      setError("Parsing Error: Ensure your CSV/Excel file contains valid headers and data structure.");
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFile(null);
    setJsonOutput("");
    setError(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl flex items-center gap-2">
            <TableProperties className="h-7 w-7 text-foreground" />
            CSV/Excel to JSON Converter
          </h1>
          <p className="text-sm text-muted">
            Transform spreadsheet sheets and comma-separated layouts into structured JSON arrays in real time. 100% Client-side.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="CSV/Excel to JSON Converter | ApexToolHub" 
            text="Convert CSV or Excel files to JSON online for free. 100% Client-side." 
          />
        </div>
      </div>


      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Upload & Configuration */}
        <div className="lg:col-span-5 flex flex-col border border-border bg-card rounded-lg p-5 space-y-5 shadow-sm">
          {/* File Drag and Drop Zone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted">
              Select spreadsheet file
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[160px] ${
                isDragOver
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/40 bg-background/50 hover:bg-background"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv, .xlsx, .xls"
                className="hidden"
              />
              
              {!file ? (
                <>
                  <Upload className="h-9 w-9 text-zinc-400 mb-3" />
                  <p className="text-sm font-semibold text-foreground">Drag &amp; drop file here, or click</p>
                  <p className="text-xs text-zinc-500 mt-1">Supports CSV, XLSX, XLS formats</p>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-9 w-9 text-emerald-500 mb-3" />
                  <p className="text-sm font-semibold text-foreground break-all max-w-[280px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Parser Configuration
            </h3>

            {/* Infer Type Toggle */}
            <div className="flex items-center gap-3">
              <input
                id="infer-checkbox"
                type="checkbox"
                checked={inferTypes}
                onChange={(e) => setInferTypes(e.target.checked)}
                className="rounded border-border focus:ring-0 text-foreground cursor-pointer h-4 w-4"
                data-testid="infer-checkbox"
              />
              <label htmlFor="infer-checkbox" className="text-xs font-semibold text-muted hover:text-foreground cursor-pointer select-none">
                Infer Data Types
                <span className="block text-[10px] text-zinc-500 font-normal mt-0.5">
                  Converts numbers to actual numeric types and booleans
                </span>
              </label>
            </div>

            {/* Header Row Index */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="header-index" className="text-xs font-semibold text-muted select-none">
                Header Row Index
              </label>
              <input
                id="header-index"
                type="number"
                min="0"
                value={headerIndex}
                onChange={(e) => setHeaderIndex(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded border border-border bg-background py-1.5 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground text-xs placeholder-zinc-500 dark:placeholder-zinc-650"
                data-testid="header-index-input"
              />
              <p className="text-[10px] text-zinc-500">
                0-indexed position of the row containing table header keys.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-border pt-4 flex flex-col gap-2">
            <button
              onClick={handleConvert}
              disabled={loading || !file}
              className={`w-full text-sm font-semibold transition-all py-2.5 px-4 rounded cursor-pointer min-h-[42px] flex items-center justify-center gap-2 ${
                loading || !file
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-foreground hover:bg-foreground/90 text-background"
              }`}
              data-testid="convert-btn"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Converting Spreadsheet...</span>
                </>
              ) : (
                <span>Convert to JSON</span>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                disabled={!jsonOutput}
                className="text-xs flex items-center justify-center gap-1.5 bg-background hover:bg-muted/10 text-foreground transition-all py-2 px-3 rounded cursor-pointer border border-border min-h-[38px] disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="copy-json-btn"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="text-xs flex items-center justify-center gap-1.5 bg-background hover:bg-muted/10 text-red-500 transition-all py-2 px-3 rounded cursor-pointer border border-border min-h-[38px]"
                data-testid="clear-data-btn"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Data</span>
              </button>
            </div>
          </div>

          {/* Validation Alert Box */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded border border-amber-500/20 bg-amber-950/20 text-amber-500 text-xs animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Parsing Error:</span> Ensure your CSV/Excel file contains valid headers and data structure.
              </div>
            </div>
          )}
        </div>

        {/* Right Side: JSON Preview Output */}
        <div className="lg:col-span-7 flex flex-col border border-border bg-card rounded-lg overflow-hidden min-h-[450px]">
          <div className="flex items-center justify-between border-b border-border bg-background/50 px-4 py-3 select-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              JSON Output Preview
            </span>
            {jsonOutput && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                Success
              </span>
            )}
          </div>

          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 overflow-y-auto relative">
            {!jsonOutput ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 select-none text-zinc-500">
                <FileText className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-3" />
                <p className="text-sm font-semibold">Ready for Conversion</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1 max-w-xs">
                  Upload a spreadsheet file and configure the settings to output a valid structured JSON representation.
                </p>
              </div>
            ) : (
              <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap select-all animate-in fade-in duration-200" data-testid="json-output">
                {jsonOutput}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={CSV_TO_JSON_FAQS} idPrefix="csv-json-faq" />
      </div>
    </div>
  );
}

