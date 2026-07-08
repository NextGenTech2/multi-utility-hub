import { BenefitInput, BenefitResult } from "../rules";

export function calculateFuel(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Fuel Reimbursement";
  const id = "fuel";
  const monthlyLimit = 5000; // Standard corporate mixed use cap
  const eligibleAmount = monthlyLimit;

  let exemptAmount = 0;
  if (input.enabled) {
    exemptAmount = Math.min(input.monthlyAmount, monthlyLimit) * 12;
  }

  return {
    id,
    name,
    eligibleAmount,
    exemptAmount,
    taxImpact: 0,
    explanation: "Reimbursement of running and maintenance costs for a vehicle used for official duties is exempt. Capped at ₹5,000/month in both regimes.",
    proofRequired: "Fuel bills, log sheets, and vehicle registration documents.",
  };
}
