import { TaxBreakdown, BenefitResult } from "./tax/rules";
import { EpfEngineResult } from "./epfEngine";
import { GratuityEngineResult } from "./gratuityEngine";
import { SalaryStore } from "@/store/salaryStore";
import { formatCurrency } from "@/lib/utils";

export interface OptimizationScore {
  overall: number;
  taxPlanning: number;
  retirement: number;
  salaryStructure: number;
  benefitsUsage: number;
  payrollEfficiency: number;
}

export interface Insight {
  id: string;
  type: "positive" | "negative" | "neutral";
  text: string;
  potentialSaving?: number;
}

export interface OptimizationResult {
  score: OptimizationScore;
  insights: Insight[];
  recommendedRegime: "old" | "new" | "equal";
  regimeSavings: number;
  totalPotentialSavings: number;
}

export function runOptimizationEngine(
  store: SalaryStore,
  oldTax: TaxBreakdown,
  newTax: TaxBreakdown,
  oldBenefits: BenefitResult[],
  newBenefits: BenefitResult[],
  epfResult: EpfEngineResult,
  gratuityResult: GratuityEngineResult
): OptimizationResult {
  
  const insights: Insight[] = [];
  let totalPotentialSavings = 0;

  // 1. Tax Planning Score
  let taxScore = 100;
  let recommendedRegime: "old" | "new" | "equal" = "equal";
  let regimeSavings = 0;
  
  if (oldTax.totalTax < newTax.totalTax) {
    recommendedRegime = "old";
    regimeSavings = newTax.totalTax - oldTax.totalTax;
    insights.push({
      id: "regime-old",
      type: "positive",
      text: `Old Regime saves you ${formatCurrency(regimeSavings)} in taxes compared to the New Regime.`
    });
  } else if (newTax.totalTax < oldTax.totalTax) {
    recommendedRegime = "new";
    regimeSavings = oldTax.totalTax - newTax.totalTax;
    insights.push({
      id: "regime-new",
      type: "positive",
      text: `New Regime saves you ${formatCurrency(regimeSavings)} in taxes compared to the Old Regime.`
    });
  } else {
    insights.push({
      id: "regime-equal",
      type: "neutral",
      text: `Both tax regimes result in the exact same tax liability.`
    });
  }

  // Deduct points if they haven't maxed 80C but they are heavily taxed
  const total80c = store.sec80c.epf + store.sec80c.ppf + store.sec80c.elss + store.sec80c.lifeInsurance + store.sec80c.taxSaverFd;
  if (total80c < 150000 && recommendedRegime === "old") {
    taxScore -= 20;
    const room = 150000 - total80c;
    const taxBracket = oldTax.taxableIncome > 1000000 ? 0.3 : oldTax.taxableIncome > 500000 ? 0.2 : 0.05;
    const potential = room * taxBracket;
    if (potential > 0) {
      insights.push({
        id: "80c-room",
        type: "negative",
        text: `Maximize your Section 80C limit to save up to ${formatCurrency(potential)} in taxes.`,
        potentialSaving: potential
      });
      totalPotentialSavings += potential;
    }
  }

  // NPS 80CCD(1B)
  if (store.npsSelf < 50000 && recommendedRegime === "old") {
    taxScore -= 10;
    const room = 50000 - store.npsSelf;
    const taxBracket = oldTax.taxableIncome > 1000000 ? 0.3 : oldTax.taxableIncome > 500000 ? 0.2 : 0.05;
    const potential = room * taxBracket;
    if (potential > 0) {
      insights.push({
        id: "nps-room",
        type: "negative",
        text: `Invest in NPS under 80CCD(1B) to save an additional ${formatCurrency(potential)}.`,
        potentialSaving: potential
      });
      totalPotentialSavings += potential;
    }
  }

  // 2. Retirement Score
  let retirementScore = epfResult.healthScore; // inherit from epfEngine
  if (store.flexiBenefits.employerNps.enabled) {
    retirementScore = Math.min(100, retirementScore + 10);
    insights.push({
      id: "emp-nps",
      type: "positive",
      text: `Great job utilizing Employer NPS for tax-free retirement wealth.`
    });
  } else {
    retirementScore -= 10;
    const taxBracket = recommendedRegime === "new" ? 
      (newTax.taxableIncome > 1500000 ? 0.3 : 0.2) : 
      (oldTax.taxableIncome > 1000000 ? 0.3 : 0.2);
    
    // Assume 10% of basic can go to NPS
    const npsCapacity = Math.min(750000, store.grossSalary * (store.basicPercentage / 100) * 0.10);
    const potential = npsCapacity * taxBracket;
    
    if (potential > 0) {
      insights.push({
        id: "missed-emp-nps",
        type: "negative",
        text: `Enable Employer NPS to divert up to 10% of Basic salary tax-free, saving ~${formatCurrency(potential)}.`,
        potentialSaving: potential
      });
      totalPotentialSavings += potential;
    }
  }

  // 3. Benefits Usage Score
  let benefitsScore = 100;
  const missingBenefits = [];
  
  if (!store.flexiBenefits.mealCard.enabled) {
    benefitsScore -= 15;
    const potential = (2200 * 12) * 0.3; // assuming 30% bracket for simplicity on high incomes
    insights.push({
      id: "missed-meal",
      type: "negative",
      text: `Opting for Meal Cards can save you around ${formatCurrency(potential)} in taxes annually.`,
      potentialSaving: potential
    });
    totalPotentialSavings += potential;
  } else {
    insights.push({
      id: "meal-active",
      type: "positive",
      text: `Meal Card is active and saving you tax.`
    });
  }

  if (store.flexiBenefits.vehicleType === "none" && store.grossSalary > 1500000) {
    benefitsScore -= 10;
    insights.push({
      id: "missed-vehicle",
      type: "neutral",
      text: `High income earners often save huge taxes via Company Car Leases. Check if your HR offers it.`
    });
  }

  // 4. Salary Structure Score
  let structureScore = 100;
  if (store.basicPercentage < 40) {
    structureScore -= 20;
    insights.push({
      id: "low-basic",
      type: "negative",
      text: `Your Basic Salary (${store.basicPercentage}%) is low, which limits your PF and Gratuity compounding.`
    });
  } else if (store.basicPercentage > 50) {
    structureScore -= 10;
    insights.push({
      id: "high-basic",
      type: "neutral",
      text: `Your Basic Salary is high (${store.basicPercentage}%), causing high mandatory PF deductions and lower take-home.`
    });
  } else {
    insights.push({
      id: "good-basic",
      type: "positive",
      text: `Basic Salary is optimally structured between 40-50%.`
    });
  }

  if (gratuityResult.isEligible) {
    insights.push({
      id: "grat-eligible",
      type: "positive",
      text: `You have crossed 5 years and secured your ${formatCurrency(gratuityResult.gratuityAmount)} Gratuity payout.`
    });
  } else {
    insights.push({
      id: "grat-wait",
      type: "neutral",
      text: `Stick around for ${gratuityResult.monthsNeeded} more months to unlock ${formatCurrency(gratuityResult.scenarioAmount)} in Gratuity.`
    });
  }

  // 5. Payroll Efficiency Score
  // Essentially: (Take Home + PF Saved + Tax Saved via Benefits) / CTC
  const activeTax = recommendedRegime === "old" ? oldTax : newTax;
  const netValue = activeTax.takeHomeSalary + epfResult.totalMonthlyEPF * 12;
  const efficiencyRatio = netValue / store.grossSalary;
  
  let payrollEfficiency = 100;
  if (efficiencyRatio < 0.70) payrollEfficiency = 60;
  else if (efficiencyRatio < 0.80) payrollEfficiency = 80;
  else if (efficiencyRatio < 0.85) payrollEfficiency = 90;

  // Aggregate Overall Score
  const overall = Math.round(
    (taxScore * 0.3) + 
    (retirementScore * 0.2) + 
    (structureScore * 0.2) + 
    (benefitsScore * 0.2) + 
    (payrollEfficiency * 0.1)
  );

  return {
    score: {
      overall,
      taxPlanning: Math.max(0, taxScore),
      retirement: Math.max(0, retirementScore),
      salaryStructure: Math.max(0, structureScore),
      benefitsUsage: Math.max(0, benefitsScore),
      payrollEfficiency: Math.max(0, payrollEfficiency)
    },
    insights,
    recommendedRegime,
    regimeSavings,
    totalPotentialSavings
  };
}
