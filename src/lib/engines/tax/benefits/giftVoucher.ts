import { BenefitInput, BenefitResult } from "../rules";

export function calculateGiftVoucher(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Gift Voucher / Token";
  const id = "giftVoucher";
  const annualLimit = 5000;
  const eligibleAmount = Math.round(annualLimit / 12); // represent monthly

  let exemptAmount = 0;
  // Gift vouchers are only tax-exempt in the Old regime. In the New regime, all gifts are fully taxable.
  const isAllowedInRegime = regime === "old";

  if (input.enabled && isAllowedInRegime) {
    const annualDeclared = (input.declaredAmount !== undefined ? input.declaredAmount : input.monthlyAmount * 12);
    exemptAmount = Math.min(annualDeclared, annualLimit);
  }

  return {
    id,
    name,
    eligibleAmount,
    exemptAmount,
    taxImpact: 0,
    explanation: `Gifts in kind (vouchers/tokens) from the employer are tax-free up to ₹5,000 per year. ${!isAllowedInRegime ? "Not applicable under the New Tax Regime." : ""}`,
    proofRequired: "Gift voucher receipt or ledger copy.",
  };
}
