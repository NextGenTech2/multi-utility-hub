export interface SalaryBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  performanceBonus: number;
  employerPf: number;
  gratuity: number;
  otherAllowances: number;
}

export interface BenefitInput {
  enabled: boolean;
  monthlyAmount: number;
  declaredAmount?: number; // for annual benefits
}

export interface BenefitResult {
  id: string;
  name: string;
  eligibleAmount: number; // monthly or annual limit based on rule
  exemptAmount: number;   // calculated annual tax-exempt amount
  taxImpact: number;      // estimated tax savings
  explanation: string;
  proofRequired: string;
}

export interface AdvancedDeductions {
  ppf: number;
  epf: number;
  elss: number;
  lifeInsurance: number;
  taxSaverFd: number;
  npsSelf: number; // 80CCD(1B)
  healthInsurance: number; // 80D
  homeLoanInterest: number; // Section 24b
  educationLoan: number; // Section 80E
  donations: number; // Section 80G
}

export interface TaxBreakdown {
  regime: "old" | "new";
  grossSalary: number;
  totalBenefitsExempt: number;
  taxableIncome: number;
  baseTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  monthlyTds: number;
  takeHomeSalary: number;
  effectiveTaxRate: number;
  averageTaxRate: number;
}

export interface OptimizationSuggestion {
  id: string;
  benefitName: string;
  potentialSaving: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  requiresHrApproval: boolean;
  explanation: string;
}

export interface OptimizationReport {
  ctc: number;
  employerBenefitsUsed: number;
  unusedBenefits: number;
  potentialAdditionalSaving: number;
  recommendedRegime: "old" | "new" | "equal";
  optimizationScore: number;
}

// Generate Typical Salary Structure based on Gross Annual Salary
export function generateSalaryStructure(grossSalary: number): SalaryBreakdown {
  // Standard corporate salary allocation
  const basic = Math.round(grossSalary * 0.40); // 40% Basic
  const hra = Math.round(basic * 0.40); // 40% of Basic for HRA (non-metro standard)
  const employerPf = Math.round(basic * 0.12); // 12% of Basic PF
  const gratuity = Math.round(basic * 0.0481); // 4.81% Gratuity
  const bonus = Math.round(grossSalary * 0.05); // 5% Bonus
  const performanceBonus = Math.round(grossSalary * 0.05); // 5% Performance Bonus
  const otherAllowances = Math.round(grossSalary * 0.05); // 5% Other Allowances
  
  // Special allowance is the balancing figure
  const specialAllowance = Math.max(
    0,
    grossSalary - (basic + hra + employerPf + gratuity + bonus + performanceBonus + otherAllowances)
  );

  return {
    basic,
    hra,
    specialAllowance,
    bonus,
    performanceBonus,
    employerPf,
    gratuity,
    otherAllowances,
  };
}
