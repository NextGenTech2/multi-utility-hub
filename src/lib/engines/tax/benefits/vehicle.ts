import { BenefitInput, BenefitResult } from "../rules";

export interface VehicleBenefitInput extends BenefitInput {
  vehicleType: "maintenance_small" | "maintenance_large" | "combined_small" | "combined_large";
}

export function calculateVehicle(input: VehicleBenefitInput, basicSalary: number, regime: "old" | "new"): BenefitResult {
  const name = "Vehicle Car Allowance";
  const id = "vehicle";
  
  let monthlyLimit = 0;
  let explanation = "";

  switch (input.vehicleType) {
    case "maintenance_small":
      monthlyLimit = 5000;
      explanation = "Car maintenance allowance (<1600cc engine size) for mixed use is exempt up to ₹5,000/month.";
      break;
    case "maintenance_large":
      monthlyLimit = 7000;
      explanation = "Car maintenance allowance (>1600cc engine size) for mixed use is exempt up to ₹7,000/month.";
      break;
    case "combined_small":
      monthlyLimit = 8000;
      explanation = "Car maintenance + driver allowance (<1600cc engine size) is exempt up to ₹8,000/month.";
      break;
    case "combined_large":
      monthlyLimit = 10000;
      explanation = "Car maintenance + driver allowance (>1600cc engine size) is exempt up to ₹10,000/month.";
      break;
    default:
      monthlyLimit = 5000;
      explanation = "Standard car allowance exemption.";
  }

  const eligibleAmount = monthlyLimit;
  let exemptAmount = 0;
  
  // Note: Vehicle benefits for personal/mixed use are fully allowed in Old regime, 
  // but under New regime, only vehicles provided for official duties (with logbook) are exempt. 
  // Standard corporate car allowance is generally not exempt in the New Tax Regime.
  const isAllowedInRegime = regime === "old";

  if (input.enabled && isAllowedInRegime) {
    exemptAmount = Math.min(input.monthlyAmount, monthlyLimit) * 12;
  }

  return {
    id,
    name,
    eligibleAmount,
    exemptAmount,
    taxImpact: 0,
    explanation: `${explanation} ${!isAllowedInRegime ? "Not applicable under the New Tax Regime." : ""}`,
    proofRequired: "Car logbook, employer maintenance approvals, and driver bills.",
  };
}
