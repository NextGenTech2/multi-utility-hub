"use client";

import { useState } from "react";
import { Copy, Trash2, Check, Sparkles, Type } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { CASE_CONVERTER_FAQS } from "@/data/faqs";

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const getWordCount = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter((w) => w.length > 0).length;
  };

  const getCharCount = (str: string) => {
    return str.length;
  };

  const getLineCount = (str: string) => {
    if (!str) return 0;
    return str.split("\n").length;
  };

  const handleClear = () => {
    setText("");
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to split any string into clean alphanumeric words
  const getWords = (str: string): string[] => {
    return str
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // separate camelCase words
      .replace(/[^a-zA-Z0-9]/g, " ") // convert non-alphanumeric to spaces
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
  };

  const convertToUpperCase = () => {
    setText(text.toUpperCase());
  };

  const convertToLowerCase = () => {
    setText(text.toLowerCase());
  };

  const convertToCamelCase = () => {
    const paragraphs = text.split("\n");
    const convertedParagraphs = paragraphs.map((para) => {
      if (!para || !/[a-zA-Z0-9]/.test(para)) {
        return para;
      }
      const words = getWords(para);
      if (words.length === 0) return para;
      return words
        .map((word, idx) => {
          const lower = word.toLowerCase();
          if (idx === 0) return lower;
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join("");
    });
    setText(convertedParagraphs.join("\n"));
  };

  const convertToSnakeCase = () => {
    const paragraphs = text.split("\n");
    const convertedParagraphs = paragraphs.map((para) => {
      if (!para || !/[a-zA-Z0-9]/.test(para)) {
        return para;
      }
      const words = getWords(para);
      if (words.length === 0) return para;
      return words.map((word) => word.toLowerCase()).join("_");
    });
    setText(convertedParagraphs.join("\n"));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Case Converter &amp; String Analyzer
          </h1>
          <p className="text-sm text-muted">
            Transform text cases and analyze word metrics in real-time. This versatile case converter tool operates as a quick uppercase lowercase converter. All actions occur instantly on the client side.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="Case Converter & String Analyzer | ApexToolHub" 
            text="Transform text cases (UPPERCASE, lowercase, camelCase, snake_case) and analyze word metrics in real-time. Free case converter tool." 
          />
        </div>
      </div>

      {/* Editor Canvas Container */}
      <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden shadow-sm">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Type className="h-4 w-4 text-zinc-500" />
            Text Canvas
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="text-xs flex items-center gap-1 text-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer py-1 px-2 rounded hover:bg-muted/10 min-h-[32px] flex items-center"
              data-testid="copy-btn"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Result
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="text-xs flex items-center gap-1 text-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer py-1 px-2 rounded hover:bg-muted/10 min-h-[32px] flex items-center"
              data-testid="clear-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-[300px] resize-y border-0 p-4 font-mono text-sm bg-transparent text-foreground focus:outline-none focus:ring-0 placeholder-zinc-500 dark:placeholder-zinc-600"
            spellCheck="false"
            translate="no"
            data-testid="text-input"
          />
        </div>

        {/* Interactive Case Converters Action Bar */}
        <div className="border-t border-border bg-background/50 px-4 py-3 flex flex-wrap gap-2 items-center">
          <button
            onClick={convertToUpperCase}
            disabled={!text}
            className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1 text-foreground"
            data-testid="uppercase-btn"
          >
            UPPERCASE
          </button>
          <button
            onClick={convertToLowerCase}
            disabled={!text}
            className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1"
            data-testid="lowercase-btn"
          >
            lowercase
          </button>
          <button
            onClick={convertToCamelCase}
            disabled={!text}
            className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1"
            data-testid="camelcase-btn"
          >
            camelCase
          </button>
          <button
            onClick={convertToSnakeCase}
            disabled={!text}
            className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1"
            data-testid="snakecase-btn"
          >
            snake_case
          </button>
        </div>

        {/* Character & Word Metrics Bar */}
        <div className="border-t border-border bg-background/30 px-4 py-3 text-xs text-muted flex flex-wrap gap-x-6 gap-y-2 select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground tabular-nums" translate="no">
              {getCharCount(text)}
            </span>
            <span>characters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground tabular-nums" translate="no">
              {getWordCount(text)}
            </span>
            <span>words</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground tabular-nums" translate="no">
              {getLineCount(text)}
            </span>
            <span>lines</span>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={CASE_CONVERTER_FAQS} idPrefix="case-faq" />
      </div>
    </div>
  );
}
