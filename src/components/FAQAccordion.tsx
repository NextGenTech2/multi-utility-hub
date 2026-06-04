"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  idPrefix?: string;
  className?: string;
}

export function FAQAccordion({ items, idPrefix = "faq", className = "" }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate the JSON-LD FAQPage Schema dynamically based on items
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <div className={`space-y-4 max-w-4xl mx-auto w-full ${className}`}>
      {/* Dynamic JSON-LD structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div className="border-b border-border pb-4 select-none text-left">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Have questions about this tool? Find quick answers here.
        </p>
      </div>

      <ul className="space-y-3 text-left">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${idPrefix}-btn-${index}`;
          const panelId = `${idPrefix}-panel-${index}`;

          return (
            <li
              key={index}
              className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-zinc-350 dark:hover:border-zinc-700"
            >
              {/* Question Heading with Semantic tag (h3) for SEO */}
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 text-sm font-semibold text-foreground hover:text-foreground/90 transition-colors text-left focus:outline-none focus:bg-muted/5 min-h-[48px] cursor-pointer"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>
              </h3>

              {/* Collapsible Content Area */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={`transition-all duration-200 ${
                  isOpen ? "max-h-[1000px] border-t border-border bg-muted/5" : "max-h-0"
                }`}
              >
                <div 
                  className="p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
