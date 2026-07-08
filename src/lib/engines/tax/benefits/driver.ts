import { BenefitInput, BenefitResult } from "../rules";

export function calculateDriver(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Driver Salary Reimbursement";
  const id = "driver";
  const monthlyLimit = 15000; // Typical corporate chauffeur cap
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
    explanation: "Reimbursement of a driver's salary is exempt if the vehicle is used for official commute and business travel. Exempt up to ₹15,000/month.",
    proofRequired: "Driver's salary receipts/vouchers, driver's licence copy, and declaration.",
  };
}
