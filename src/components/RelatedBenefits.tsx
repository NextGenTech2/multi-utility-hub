import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface RelatedBenefitItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface RelatedBenefitsProps {
  currentPage: string;
  items: RelatedBenefitItem[];
}

export default function RelatedBenefits({ currentPage, items }: RelatedBenefitsProps) {
  // Filter out the current page link if it exists in the items array
  const filteredItems = items.filter((item) => item.href !== currentPage);

  if (filteredItems.length === 0) return null;

  return (
    <div className="border border-border bg-card rounded-2xl p-6 shadow-sm">
      <h3 className="text-base font-bold text-foreground mb-4">Related Benefits You Should Check</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:bg-muted/10 hover:border-foreground/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-foreground/5 text-foreground group-hover:bg-foreground/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground leading-tight">{item.name}</span>
                  <span className="text-xs text-muted-foreground mt-0.5 leading-normal">{item.description}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
