import { BenefitInput, BenefitResult } from "../rules";

export function calculateMealCard(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Food Coupon (Meal Card)";
  const id = "mealCard";
  const monthlyLimit = 8800; // ₹200 per meal * 2 meals * 22 days
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
    taxImpact: 0, // will be populated by taxEngine
    explanation: "Tax-free up to ₹200 per meal (calculated as ₹8,800/month for 22 working days, up to ₹1,05,600/year). Meal coupons (e.g. Pluxee/Sodexo) are fully exempt in both Old and New Tax Regimes.",
    proofRequired: "None. Declared via employer's food card portal.",
  };
}
