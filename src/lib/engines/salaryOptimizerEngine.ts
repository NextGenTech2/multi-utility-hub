import { SalaryBreakdown, BenefitInput } from "./tax/rules";
import { runTaxEngine, CalculatorInputs } from "./tax/taxEngine";

export interface OptimizerInputs {
  currentCtc: number;
  currentBreakdown: SalaryBreakdown;
  allowedBenefits: {
    nps: boolean;
    mealCard: boolean;
    internet: boolean;
    telephone: boolean;
    fuel: boolean;
    carLease: boolean;
  };
}

export interface OptimizerResult {
  currentBreakdown: SalaryBreakdown;
  optimizedBreakdown: SalaryBreakdown;
  recommendedBenefits: {
    name: string;
    key: string;
    amount: number;
    monthlyAmount: number;
    description: string;
    taxFree: boolean;
    confidenceRating: number;
  }[];
  currentMetrics: {
    tax: number;
    inHand: number;
    retirement: number;
  };
  optimizedMetrics: {
    tax: number;
    inHand: number;
    retirement: number;
  };
  optimizationScore: number;
  missedOpportunities: {
    name: string;
    lostAmount: number;
    potentialSaving: number;
  }[];
}

const DEFAULT_FLEXI = {
  npsPercent: 0.10, // 10% of basic
  mealCardMonthly: 2200,
  internetMonthly: 2000,
  telephoneMonthly: 1500,
  fuelMonthly: 5000,
  carLeaseMonthly: 10000,
};

const CONFIDENCE_RATING = {
  nps: 5,
  mealCard: 5,
  internet: 4,
  telephone: 4,
  fuel: 3,
  carLease: 2
};

function buildEmptyFlexiBenefits() {
  return {
    vehicleBenefitType: "none" as "none" | "maintenance_small" | "maintenance_large" | "combined_small" | "combined_large",
    vehicleMaintenanceAmount: 0,
    employerNps: { enabled: false, monthlyAmount: 0 },
    foodCoupon: { enabled: false, monthlyAmount: 0 },
    internet: { enabled: false, monthlyAmount: 0 },
    mobile: { enabled: false, monthlyAmount: 0 },
    telephone: { enabled: false, monthlyAmount: 0 },
    fuel: { enabled: false, monthlyAmount: 0 },
    driver: { enabled: false, monthlyAmount: 0 },
    books: { enabled: false, monthlyAmount: 0 },
    professionalMembership: { enabled: false, monthlyAmount: 0 },
    giftVoucher: { enabled: false, monthlyAmount: 0 },
    lta: { enabled: false, monthlyAmount: 0 },
    uniform: { enabled: false, monthlyAmount: 0 },
    newspaper: { enabled: false, monthlyAmount: 0 },
    internetEquipment: { enabled: false, monthlyAmount: 0 },
  };
}

export function runSalaryOptimizer(inputs: OptimizerInputs): OptimizerResult {
  const { currentCtc, currentBreakdown, allowedBenefits } = inputs;
  
  // Create current inputs for tax engine (assuming New Regime as default for optimization comparison)
  const currentTaxInputs: CalculatorInputs = {
    grossSalary: currentCtc,
    salaryBreakdown: currentBreakdown,
    isAdvanced: true,
    flexiBenefits: buildEmptyFlexiBenefits(),
    deductions: {
      ppf: 0,
      epf: 0,
      elss: 0,
      lifeInsurance: 0,
      taxSaverFd: 0,
      npsSelf: 0,
      healthInsurance: 0,
      homeLoanInterest: 0,
      educationLoan: 0,
      donations: 0
    }
  };

  const currentResult = runTaxEngine(currentTaxInputs);

  // Build optimized breakdown
  const optBreakdown = { ...currentBreakdown };
  let specialAllowancePool = optBreakdown.specialAllowance;

  // We will pull money out of special allowance to fund the flexi benefits.
  const recommendedBenefits = [];
  const optFlexi = buildEmptyFlexiBenefits();
  
  const addBenefit = (key: string, name: string, monthlyAmount: number, condition: boolean, taxFree: boolean, confidence: number) => {
    const annualAmount = monthlyAmount * 12;
    if (condition && specialAllowancePool >= annualAmount) {
      specialAllowancePool -= annualAmount;
      recommendedBenefits.push({ name, key, amount: annualAmount, monthlyAmount, description: "Tax-free allowance", taxFree, confidenceRating: confidence });
      return true;
    }
    return false;
  };

  if (allowedBenefits.nps) {
    const npsAmount = optBreakdown.basic * DEFAULT_FLEXI.npsPercent;
    if (specialAllowancePool >= npsAmount) {
      specialAllowancePool -= npsAmount;
      optFlexi.employerNps = { enabled: true, monthlyAmount: Math.round(npsAmount / 12) };
      recommendedBenefits.push({
        name: "Employer NPS",
        key: "nps",
        amount: npsAmount,
        monthlyAmount: Math.round(npsAmount / 12),
        description: "Tax saving under Sec 80CCD(2)",
        taxFree: true,
        confidenceRating: CONFIDENCE_RATING.nps
      });
    }
  }

  if (addBenefit("mealCard", "Meal Card", DEFAULT_FLEXI.mealCardMonthly, allowedBenefits.mealCard, true, CONFIDENCE_RATING.mealCard)) {
    optFlexi.foodCoupon = { enabled: true, monthlyAmount: DEFAULT_FLEXI.mealCardMonthly };
  }
  if (addBenefit("internet", "Internet", DEFAULT_FLEXI.internetMonthly, allowedBenefits.internet, true, CONFIDENCE_RATING.internet)) {
    optFlexi.internet = { enabled: true, monthlyAmount: DEFAULT_FLEXI.internetMonthly };
  }
  if (addBenefit("telephone", "Telephone", DEFAULT_FLEXI.telephoneMonthly, allowedBenefits.telephone, true, CONFIDENCE_RATING.telephone)) {
    optFlexi.telephone = { enabled: true, monthlyAmount: DEFAULT_FLEXI.telephoneMonthly };
  }
  if (addBenefit("fuel", "Fuel", DEFAULT_FLEXI.fuelMonthly, allowedBenefits.fuel, true, CONFIDENCE_RATING.fuel)) {
    optFlexi.fuel = { enabled: true, monthlyAmount: DEFAULT_FLEXI.fuelMonthly };
  }
  if (addBenefit("carLease", "Car Lease", DEFAULT_FLEXI.carLeaseMonthly, allowedBenefits.carLease, true, CONFIDENCE_RATING.carLease)) {
    optFlexi.vehicleBenefitType = "combined_large";
    optFlexi.vehicleMaintenanceAmount = DEFAULT_FLEXI.carLeaseMonthly;
  }
  
  // Re-assign remaining special allowance
  optBreakdown.specialAllowance = specialAllowancePool;

  const optimizedTaxInputs: CalculatorInputs = {
    ...currentTaxInputs,
    salaryBreakdown: optBreakdown,
    flexiBenefits: optFlexi
  };

  const optimizedResult = runTaxEngine(optimizedTaxInputs);

  // Retirement Projection (20 years at 10%)
  const currentYearlyRetirementContrib = currentBreakdown.employerPf + (currentBreakdown.basic * 0.12); // Employee PF + Employer PF
  const optYearlyRetirementContrib = currentYearlyRetirementContrib + (optFlexi.employerNps.enabled ? optFlexi.employerNps.monthlyAmount * 12 : 0);
  
  const calculateCompound = (annualContrib: number, rate: number, years: number) => {
    let total = 0;
    for (let i = 0; i < years; i++) {
      total = (total + annualContrib) * (1 + rate);
    }
    return total;
  };

  const currentRetirement = calculateCompound(currentYearlyRetirementContrib, 0.10, 20);
  const optRetirement = calculateCompound(optYearlyRetirementContrib, 0.10, 20);

  // Optimization Score Heuristic
  const maxScore = 98; // Cap at 98% for credibility
  let score = 45; // Base score
  if (allowedBenefits.nps) score += 20;
  if (allowedBenefits.mealCard) score += 10;
  if (allowedBenefits.internet) score += 10;
  if (allowedBenefits.telephone) score += 5;
  if (allowedBenefits.fuel) score += 10;
  if (allowedBenefits.carLease) score += 5;
  score = Math.min(maxScore, score);

  // Missed opportunities (if they don't have certain benefits allowed)
  const missed = [];
  // Approximate lost tax saving at marginal rate
  // Marginal rate approximation (if income > 15L -> 30%)
  const marginalRate = currentCtc > 1500000 ? 0.30 : (currentCtc > 1200000 ? 0.20 : 0.10);
  
  if (!allowedBenefits.carLease) missed.push({ name: "Car Lease", lostAmount: (DEFAULT_FLEXI.carLeaseMonthly * 12), potentialSaving: (DEFAULT_FLEXI.carLeaseMonthly * 12) * marginalRate });
  if (!allowedBenefits.nps) missed.push({ name: "Employer NPS", lostAmount: (optBreakdown.basic * 0.10), potentialSaving: (optBreakdown.basic * 0.10) * marginalRate });
  if (!allowedBenefits.fuel) missed.push({ name: "Fuel Reimbursement", lostAmount: (DEFAULT_FLEXI.fuelMonthly * 12), potentialSaving: (DEFAULT_FLEXI.fuelMonthly * 12) * marginalRate });
  if (!allowedBenefits.mealCard) missed.push({ name: "Meal Card", lostAmount: (DEFAULT_FLEXI.mealCardMonthly * 12), potentialSaving: (DEFAULT_FLEXI.mealCardMonthly * 12) * marginalRate });
  if (!allowedBenefits.internet) missed.push({ name: "Internet", lostAmount: (DEFAULT_FLEXI.internetMonthly * 12), potentialSaving: (DEFAULT_FLEXI.internetMonthly * 12) * marginalRate });
  if (!allowedBenefits.telephone) missed.push({ name: "Telephone", lostAmount: (DEFAULT_FLEXI.telephoneMonthly * 12), potentialSaving: (DEFAULT_FLEXI.telephoneMonthly * 12) * marginalRate });

  return {
    currentBreakdown,
    optimizedBreakdown: optBreakdown,
    recommendedBenefits,
    currentMetrics: {
      tax: currentResult.newRegime.totalTax,
      inHand: currentResult.newRegime.takeHomeSalary,
      retirement: currentRetirement
    },
    optimizedMetrics: {
      tax: optimizedResult.newRegime.totalTax,
      inHand: optimizedResult.newRegime.takeHomeSalary,
      retirement: optRetirement
    },
    optimizationScore: score,
    missedOpportunities: missed
  };
}
