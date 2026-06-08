"use client";

import { useCurrency } from "@/context/CurrencyContext";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border w-fit">
      <button
        onClick={() => setCurrency("USD")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${
          currency === "USD"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        🇺🇸 USD ($)
      </button>
      <button
        onClick={() => setCurrency("INR")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${
          currency === "INR"
            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        🇮🇳 INR (₹)
      </button>
    </div>
  );
}
