"use client";

import { AlertTriangle } from "lucide-react";

export function FinancialDisclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 mt-8 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="space-y-1 text-amber-700 dark:text-amber-400">
        <p className="font-semibold">Educational Purposes Only</p>
        <p className="opacity-90 leading-relaxed">
          The calculations provided by this tool are for educational and informational purposes only and do not constitute financial, investment, or tax advice. Actual rates, terms, and outcomes may vary based on your financial institution and market conditions. Please consult with a qualified financial advisor before making any major financial decisions.
        </p>
      </div>
    </div>
  );
}
