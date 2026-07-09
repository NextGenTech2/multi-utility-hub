import React, { useState } from "react";
import { Printer, Share2, Download, Check } from "lucide-react";

interface ReportDataItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultActionsProps {
  reportData: {
    title: string;
    inputs: ReportDataItem[];
    results: ReportDataItem[];
    breakdown?: Array<{ label: string; value: string; formula?: string }>;
    notes?: string[];
    engineVersion?: string;
  };
  shareParams: Record<string, string | number | boolean>;
}

export default function ResultActions({ reportData, shareParams }: ResultActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 1. Browser Print
  const handlePrint = () => {
    window.print();
  };

  // 2. Share link by serialization of params
  const handleShare = async () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      Object.entries(shareParams).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          url.searchParams.set(key, String(val));
        }
      });
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  // 3. Dynamic import of jsPDF for data-driven PDF generation
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Styling parameters
      const startX = 20;
      let currentY = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Professional header
      doc.setFillColor(30, 41, 59); // Sleek slate color
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("ApexToolHub Reports", startX, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Salary Intelligence Platform", startX, 28);
      
      const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.text(`Generated on: ${today}`, pageWidth - startX - 45, 28);

      currentY = 55;

      // Title
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(reportData.title, startX, currentY);
      currentY += 10;

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(startX, currentY, startX + contentWidth, currentY);
      currentY += 10;

      // Section: User Inputs
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Calculation Inputs", startX, currentY);
      currentY += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      reportData.inputs.forEach((input) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setTextColor(100, 116, 139);
        doc.text(input.label, startX, currentY);
        doc.setTextColor(15, 23, 42);
        doc.text(input.value, startX + 70, currentY);
        currentY += 6;
      });

      currentY += 6;

      // Section: Results
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Summary of Results", startX, currentY);
      currentY += 8;

      reportData.results.forEach((res) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        if (res.highlight) {
          doc.setFillColor(240, 253, 250); // Emerald highlight background
          doc.rect(startX - 2, currentY - 4, contentWidth + 4, 7, "F");
          doc.setFont("helvetica", "bold");
          doc.setTextColor(16, 185, 129); // Emerald text
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 23, 42);
        }
        doc.text(res.label, startX, currentY);
        doc.text(res.value, startX + 70, currentY);
        currentY += 7;
      });

      currentY += 6;

      // Section: Math Breakdown
      if (reportData.breakdown && reportData.breakdown.length > 0) {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Step-by-step Math Breakdown", startX, currentY);
        currentY += 8;

        reportData.breakdown.forEach((step) => {
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(71, 85, 105);
          doc.text(step.label, startX, currentY);
          doc.text(step.value, startX + 110, currentY);
          
          if (step.formula) {
            currentY += 5;
            doc.setFont("helvetica", "oblique");
            doc.setFontSize(8.5);
            doc.setTextColor(148, 163, 184);
            doc.text(`Formula: ${step.formula}`, startX, currentY);
            currentY += 2;
          }
          currentY += 6;
        });
      }

      // Add Version Info & Notes at the end
      if (reportData.notes && reportData.notes.length > 0) {
        currentY += 4;
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
        }
        doc.setDrawColor(241, 245, 249);
        doc.line(startX, currentY, startX + contentWidth, currentY);
        currentY += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);

        reportData.notes.forEach((note) => {
          const splitNote = doc.splitTextToSize(note, contentWidth);
          splitNote.forEach((line: string) => {
            if (currentY > 285) {
              doc.addPage();
              currentY = 20;
            }
            doc.text(line, startX, currentY);
            currentY += 4;
          });
        });
      }

      // Footer brand version details
      const versionStr = reportData.engineVersion ? `Engine: ${reportData.engineVersion}` : "";
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`© ApexToolHub Salary Intelligence Platform. ${versionStr}`, startX, 287);

      // Save PDF document
      const filename = `${reportData.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_report.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-center border-t border-border pt-4 print:hidden">
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-background hover:bg-muted/10 transition-colors"
      >
        <Printer className="w-4 h-4" /> Print
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border border-border bg-background hover:bg-muted/10 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" /> Copied!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" /> Share Link
          </>
        )}
      </button>

      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        <Download className="w-4 h-4" /> {downloading ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
}
