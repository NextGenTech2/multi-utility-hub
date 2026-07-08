import { BenefitInput, BenefitResult } from "../rules";

export function calculateBooks(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Books & Journals Reimbursement";
  const id = "books";
  const annualLimit = 15000;
  const eligibleAmount = Math.round(annualLimit / 12);

  let exemptAmount = 0;
  if (input.enabled) {
    const annualDeclared = (input.declaredAmount !== undefined ? input.declaredAmount : input.monthlyAmount * 12);
    exemptAmount = Math.min(annualDeclared, annualLimit);
  }

  return {
    id,
    name,
    eligibleAmount,
    exemptAmount,
    taxImpact: 0,
    explanation: "Reimbursement of expenses incurred on technical books, journals, and periodicals for professional development is fully tax-free in both regimes.",
    proofRequired: "Valid purchase receipts or subscription invoices in employee's name.",
  };
}
