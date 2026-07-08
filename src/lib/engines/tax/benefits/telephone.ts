import { BenefitInput, BenefitResult } from "../rules";

export function calculateTelephone(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Telephone Reimbursement";
  const id = "telephone";
  const monthlyLimit = 1500;
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
    explanation: "Reimbursements of telephone (landline or mobile) expenses are tax-free perquisites under Rule 3(7)(ix) in both regimes.",
    proofRequired: "Postpaid mobile/landline telephone bill statements.",
  };
}
