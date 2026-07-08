import { BenefitInput, BenefitResult } from "../rules";

export function calculateEmployerNps(input: BenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Employer NPS Contribution";
  const id = "employerNps";
  
  // Eligible monthly limit is 14% of monthly basic salary
  const monthlyLimit = Math.round((basicSalary / 12) * 0.14);
  const eligibleAmount = monthlyLimit;

  let exemptAmount = 0;
  if (input.enabled) {
    // Exempt up to 14% of Basic Salary under Section 80CCD(2)
    exemptAmount = Math.min(input.monthlyAmount * 12, basicSalary * 0.14);
  }

  return {
    id,
    name,
    eligibleAmount,
    exemptAmount,
    taxImpact: 0, // will be populated by taxEngine
    explanation: "Employer NPS contributions are tax-exempt up to 14% of your Basic Salary + DA under Section 80CCD(2) for both private and public sector employees. This is available in both Old and New regimes.",
    proofRequired: "NPS contribution summary or salary statement showing employer contribution.",
  };
}
