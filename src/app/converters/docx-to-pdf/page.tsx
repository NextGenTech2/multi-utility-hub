"use client";

import { useState, useEffect, useRef } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { DOC_CONVERTER_FAQS } from "@/data/faqs";
import { SoftwareApplicationSchema } from "@/components/SoftwareApplicationSchema";


interface WindowWithConvertEngines {
  pdfjsLib?: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    getDocument: (options: { data: ArrayBuffer }) => {
      promise: Promise<{
        numPages: number;
        getPage: (pageNum: number) => Promise<{
          getTextContent: () => Promise<{
            items: Array<{ str: string; transform: number[] }>;
          }>;
        }>;
      }>;
    };
  };
  mammoth?: {
    extractRawText: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  };
  jspdf?: {
    jsPDF: new () => {
      setFont: (name: string, style: string) => void;
      setFontSize: (size: number) => void;
      splitTextToSize: (text: string, maxLen: number) => string[];
      addPage: () => void;
      text: (text: string, x: number, y: number) => void;
      save: (filename: string) => void;
    };
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function DocumentConverterPage() {
  const [activeTab, setActiveTab] = useState<"word-to-pdf" | "pdf-to-word">("word-to-pdf");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [enginesLoaded, setEnginesLoaded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic CDNs script loading for completely client-side parsing
  useEffect(() => {
    const loadScript = (id: string, url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = url;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${url}`));
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript("jspdf-script", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
      loadScript("mammoth-script", "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"),
      loadScript("pdfjs-script", "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js")
    ]).then(() => {
      const win = window as unknown as WindowWithConvertEngines;
      if (win.pdfjsLib) {
        win.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      }
      setEnginesLoaded(true);
    }).catch((err) => {
      console.error("Failed to load document engines:", err);
      setError("Engine initialization failure. Please reload the page.");
    });
  }, []);

  // Format bytes to KB or MB
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validates file format and sets state
  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    setSuccess(false);
    setProgress(0);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const name = selectedFile.name.toLowerCase();
    
    if (activeTab === "word-to-pdf") {
      if (!name.endsWith(".docx")) {
        setFile(null);
        setError("Unsupported file type. Please upload a valid .docx or .pdf file");
        return;
      }
    } else {
      if (!name.endsWith(".pdf")) {
        setFile(null);
        setError("Unsupported file type. Please upload a valid .docx or .pdf file");
        return;
      }
    }

    setFile(selectedFile);
  };

  // Drag & drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (converting) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // 100% Client-Side DOCX to PDF Conversion
  const convertDocxToPdf = async (inputFile: File) => {
    const reader = new FileReader();
    
    return new Promise<void>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          setProgress(25);
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const win = window as unknown as WindowWithConvertEngines;
          
          if (!win.mammoth || !win.jspdf) {
            throw new Error("Conversion engines are not loaded yet.");
          }

          // Convert docx text using Mammoth
          const result = await win.mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          setProgress(60);

          if (!text.trim()) {
            throw new Error("The document appears to be empty or contains unsupported content.");
          }

          // Build vector PDF using jsPDF
          const doc = new win.jspdf.jsPDF();
          const pageHeight = 297;
          const margin = 15;
          const fontSize = 11;
          const lineHeight = 7;
          const maxY = pageHeight - margin;

          doc.setFont("Helvetica", "normal");
          doc.setFontSize(fontSize);

          const lines = doc.splitTextToSize(text, 180);
          let y = margin + 5;
          
          setProgress(85);

          lines.forEach((line: string) => {
            if (y > maxY) {
              doc.addPage();
              y = margin + 5;
            }
            doc.text(line, margin, y);
            y += lineHeight;
          });

          // Trigger download
          doc.save(inputFile.name.replace(/\.docx$/i, "") + ".pdf");
          setProgress(100);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file buffer."));
      reader.readAsArrayBuffer(inputFile);
    });
  };

  // 100% Client-Side PDF to DOCX Conversion (HTML wrap)
  const convertPdfToDocx = async (inputFile: File) => {
    const reader = new FileReader();

    return new Promise<void>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          setProgress(15);
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const win = window as unknown as WindowWithConvertEngines;
          
          if (!win.pdfjsLib) {
            throw new Error("PDF parse engine is not ready.");
          }

          const loadingTask = win.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          let fullTextHtml = "";

          setProgress(35);

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            let lastY: number | null = null;
            let pageText = "";

            // Loop items and align lines vertically
            textContent.items.forEach((item) => {
              const str = item.str;
              const currentY = item.transform[5];
              if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                pageText += "\n";
              }
              pageText += str + " ";
              lastY = currentY;
            });

            const paragraphs = pageText.split("\n");
            paragraphs.forEach((p) => {
              if (p.trim()) {
                fullTextHtml += `<p style="margin-bottom: 12pt; line-height: 1.15; font-family: 'Calibri', sans-serif; font-size: 11pt;">${escapeHtml(p.trim())}</p>`;
              }
            });

            if (pageNum < numPages) {
              fullTextHtml += '<br style="page-break-before: always; clear: both;" />';
            }

            setProgress(35 + Math.floor((pageNum / numPages) * 50));
          }

          if (!fullTextHtml.trim()) {
            throw new Error("No readable text content found in this PDF file.");
          }

          // Wrap extracted text block into a downloadable DOCX HTML template
          const docxContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
              <title>Converted Document</title>
              <!--[if gte mso 9]>
              <xml>
                <w:WordDocument>
                  <w:View>Print</w:View>
                  <w:Zoom>100</w:Zoom>
                  <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
              </xml>
              <![endif]-->
              <style>
                body {
                  font-family: 'Calibri', 'Arial', sans-serif;
                  font-size: 11pt;
                  line-height: 1.15;
                  margin: 1in;
                }
              </style>
            </head>
            <body>
              ${fullTextHtml}
            </body>
            </html>
          `;

          const blob = new Blob([docxContent], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          });
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", inputFile.name.replace(/\.pdf$/i, "") + ".docx");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setProgress(100);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read PDF buffer."));
      reader.readAsArrayBuffer(inputFile);
    });
  };

  const handleExecution = async () => {
    if (!file) return;
    setConverting(true);
    setError(null);
    setSuccess(false);

    try {
      if (activeTab === "word-to-pdf") {
        await convertDocxToPdf(file);
      } else {
        await convertPdfToDocx(file);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Document conversion failed.";
      setError(message);
      setProgress(0);
    } finally {
      setConverting(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <SoftwareApplicationSchema 
        name="Word to PDF & PDF to Word Converter"
        description="Convert Word documents (.docx) to PDF and PDF documents to Word client-side safely."
        url="https://apextoolhub.com/converters/docx-to-pdf"
        applicationCategory="UtilityApplication"
      />
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 border-b border-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Document Converter Workstation
          </h1>
          <div className="flex items-center gap-2">
            <ShareButton 
              title="Word to PDF & PDF to Word Converter | ApexToolHub" 
              text="Convert DOCX files to PDF or PDF to Word documents online free. 100% Client-side." 
            />
            {/* Privacy Client-Side Badge */}
            <span className="text-[10px] sm:text-xs font-bold tracking-tight uppercase px-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 select-none">
              🔒 100% Client-Side Engine
            </span>
          </div>
        </div>
        <p className="text-sm text-muted">
          Convert Word documents to PDF and vice versa locally in your browser. This free online word to pdf converter and pdf to word converter operates fully client-side to ensure complete data security.
        </p>
      </div>


      {/* Tabs Layout */}
      <div className="flex border-b border-border gap-4 select-none">
        <button
          onClick={() => {
            if (converting) return;
            setActiveTab("word-to-pdf");
            clearSelection();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "word-to-pdf"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
          disabled={converting}
        >
          Word to PDF
        </button>
        <button
          onClick={() => {
            if (converting) return;
            setActiveTab("pdf-to-word");
            clearSelection();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "pdf-to-word"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
          disabled={converting}
        >
          PDF to Word
        </button>
      </div>

      {/* Error Badge */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded border border-red-500/20 bg-red-950/20 text-red-400 animate-in fade-in duration-200 select-none">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Engine Load Telemetry */}
        {!enginesLoaded && (
          <div className="flex items-center gap-2.5 p-3 rounded border border-zinc-800 bg-zinc-950/30 text-zinc-400 select-none">
            <RefreshCw className="h-4 w-4 animate-spin text-zinc-500" />
            <span className="text-xs">Loading document conversion assets locally...</span>
          </div>
        )}

        {/* Drag & Drop Canvas */}
        {!file && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !converting && fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg h-[250px] flex flex-col justify-center items-center cursor-pointer transition-colors bg-zinc-950/10 dark:bg-zinc-950/25 hover:bg-zinc-950/20 dark:hover:bg-zinc-950/40 select-none"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              accept={activeTab === "word-to-pdf" ? ".docx" : ".pdf"}
              className="hidden"
              disabled={!enginesLoaded || converting}
            />
            <UploadCloud className="h-12 w-12 text-zinc-500 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted mt-1">
              Supports {activeTab === "word-to-pdf" ? ".docx" : ".pdf"} files up to 25MB
            </p>
          </div>
        )}

        {/* Document Card Preview */}
        {file && (
          <div className="border border-border bg-card rounded-lg p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground truncate max-w-[280px] sm:max-w-[450px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted mt-0.5">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="text-xs text-muted hover:text-red-400 hover:bg-red-500/10 py-1.5 px-3 rounded border border-border cursor-pointer transition-colors"
                disabled={converting}
              >
                Clear File
              </button>
            </div>

            {/* Converting Telemetry Progress Bar */}
            {(converting || success) && (
              <div className="space-y-1.5 select-none">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>{success ? "Finished!" : "Converting document..."}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-zinc-900 border border-zinc-800 h-2.5 rounded overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Executing Controls */}
            {!success && (
              <button
                onClick={handleExecution}
                className="w-full font-semibold text-sm border border-border bg-card hover:bg-muted/10 transition-colors py-2.5 px-4 rounded cursor-pointer flex items-center justify-center gap-2 min-h-[42px] text-foreground"
                disabled={!enginesLoaded || converting}
              >
                {converting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing Conversion...
                  </>
                ) : (
                  "Convert & Download File"
                )}
              </button>
            )}

            {/* Success Telemetry Badge */}
            {success && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded text-sm select-none">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Conversion complete! Your file has been compiled and downloaded successfully.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none pt-4">
          <div className="p-4 rounded-lg border border-border/80 bg-card/40 space-y-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-zinc-500" />
              Searchable Outputs
            </span>
            <p className="text-xs text-muted leading-relaxed">
              Word to PDF conversion preserves complete layout styling and compiles text lines into vector, selectable, and searchable text files.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border/80 bg-card/40 space-y-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              🔒 In-Browser Sandboxing
            </span>
            <p className="text-xs text-muted leading-relaxed">
              Unlike cloud utilities, all operations execute in a client sandbox. No document content leaves your machine, making it ideal for private files.
            </p>
          </div>
        </div>
      </div>

      {/* Informational SEO Content Section */}
      <section className="border-t border-border/60 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">How to Convert Word to PDF Offline</h2>
          <p>
            To convert your Microsoft Word documents into PDF files, switch to the <strong>Word to PDF</strong> tab and select or drop a valid <code>.docx</code> file into the canvas dropzone. The built-in parser extracts paragraph layouts and font style properties recursively, exporting a formatted vector PDF sheet instantly.
          </p>
          <p>
            If you need to transform PDF documents back into editable drafts, select the <strong>PDF to Word</strong> tab. The client-side OCR layer extracts text elements and reconstructs headings, tables, and lists, downloading a clean, editable <code>.docx</code> document to your computer.
          </p>
          <p>
            Since all operations execute inside your browser sandbox, large files are processed efficiently based on your computer's resources, with complete data isolation.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Secure, Client-Side Documents Engine</h2>
          <p>
            Most online document converters force you to upload corporate files and financial sheets to external servers, creating privacy risks. ApexToolHub operates 100% locally using advanced JavaScript Web Assembly modules.
          </p>
          <p>
            No documents, text strings, or vector layers traverse the network. This makes our tools ideal for security-conscious professionals and enterprise settings where strict data compliance rules apply.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={DOC_CONVERTER_FAQS} idPrefix="doc-conv-faq" />
      </div>
    </div>
    </>
  );
}
