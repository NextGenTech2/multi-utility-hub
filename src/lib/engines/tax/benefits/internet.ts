import { BenefitInput, BenefitResult } from "../rules";

export function calculateInternet(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Internet Reimbursement";
  const id = "internet";
  const monthlyLimit = 2000;
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
    explanation: "Broadband and high-speed internet costs reimbursed by the employer for remote work duties are fully tax-free in both regimes.",
    proofRequired: "Broadband subscription bills paid by the employee.",
  };
}
