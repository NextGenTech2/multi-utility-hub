import { useState, useEffect, useRef, useCallback } from "react";
import { calculateOldRegimeTax } from "./tax/oldRegime";
import { calculateNewRegimeTax } from "./tax/newRegime";

// ─── 1. Debounce Hook ───────────────────────────────────────────────────────
/**
 * Delays updating a value until the user stops changing it for `delay` ms.
 * Use this to avoid running heavy engine calculations on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ─── 2. Engine Cache ────────────────────────────────────────────────────────
/**
 * Simple hash of an object's values for cache key generation.
 * Not cryptographic — just needs to be unique for different inputs.
 */
export function hashInputs(inputs: Record<string, any>): string {
  return JSON.stringify(inputs);
}

/**
 * Wraps an engine function with a single-entry cache.
 * If the inputs haven't changed (same hash), returns the previous result.
 * This avoids redundant calculations when navigating between calculators
 * or when React re-renders without input changes.
 */
export function createCachedEngine<I extends Record<string, any>, O>(
  engineFn: (inputs: I) => O
): (inputs: I) => O {
  let lastHash: string = "";
  let lastResult: O | null = null;

  return (inputs: I): O => {
    const currentHash = hashInputs(inputs);
    if (currentHash === lastHash && lastResult !== null) {
      return lastResult;
    }
    lastHash = currentHash;
    lastResult = engineFn(inputs);
    return lastResult;
  };
}

// ─── 3. Retirement Summary Validation Gate ──────────────────────────────────
/**
 * Returns true only when we have enough meaningful data to generate
 * a retirement benefits summary. Prevents showing misleading projections
 * with zero or default values.
 */
export function canGenerateRetirementSummary(params: {
  salary: number;
  age: number;
  yearsOfService: number;
}): boolean {
  return params.salary > 0 && params.age > 0 && params.yearsOfService >= 0;
}

// ─── 4. Marginal Tax Estimator ──────────────────────────────────────────────
/**
 * Estimates the tax on a given taxable amount, considering the user's
 * existing income (to determine the correct marginal slab).
 * Used by Leave Encashment, Gratuity, and other engines that need to
 * estimate tax on a lump-sum payout.
 */
export function estimateMarginalTax(
  taxableAmount: number,
  existingIncome: number,
  regime: "old" | "new"
): { tax: number; effectiveRate: number; marginalRate: number } {
  if (taxableAmount <= 0) {
    return { tax: 0, effectiveRate: 0, marginalRate: 0 };
  }

  const calcFn = regime === "old" ? calculateOldRegimeTax : calculateNewRegimeTax;

  // Tax on existing income alone
  const taxWithout = calcFn(Math.max(0, existingIncome)).totalTax;

  // Tax on existing income + this additional amount
  const taxWith = calcFn(Math.max(0, existingIncome + taxableAmount)).totalTax;

  // The difference is the marginal tax on the additional amount
  const marginalTax = Math.max(0, taxWith - taxWithout);

  const effectiveRate = taxableAmount > 0
    ? parseFloat(((marginalTax / taxableAmount) * 100).toFixed(2))
    : 0;

  const marginalRate = effectiveRate; // simplified — same as effective on the incremental amount

  return {
    tax: Math.round(marginalTax),
    effectiveRate,
    marginalRate,
  };
}
