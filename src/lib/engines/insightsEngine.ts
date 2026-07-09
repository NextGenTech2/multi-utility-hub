import { ENGINE_VERSIONS } from "./versions";
import { formatCurrency } from "@/lib/utils";

export const VERSION = ENGINE_VERSIONS.insights;

export interface Insight {
  id: string;
  type: "positive" | "negative" | "neutral" | "warning";
  category: "tax" | "retirement" | "benefits" | "salary" | "leave";
  text: string;
  potentialSaving?: number;
  actionUrl?: string;
}

export interface InsightsInput {
  tax?: any; // Result from runTaxEngine
  epf?: any; // Result from runEpfEngine
  gratuity?: any; // Result from runGratuityEngine
  leaveEncashment?: any; // Result from runLeaveEncashmentEngine
  salary?: { grossSalary: number; basicPercentage: number };
}

export function runInsightsEngine(inputs: InsightsInput): Insight[] {
  const insights: Insight[] = [];

  const { tax, epf, gratuity, leaveEncashment } = inputs;

  // 1. Tax Regime Insights
  if (tax) {
    const recommended = tax.recommendedRegime;
    const savings = tax.savings;
    if (recommended === "new" && savings > 0) {
      insights.push({
        id: "tax_regime_new",
        type: "positive",
        category: "tax",
        text: `Switch to the New Tax Regime to save ${formatCurrency(savings)} annually in taxes.`,
        potentialSaving: savings,
        actionUrl: "/calculators/income-tax"
      });
    } else if (recommended === "old" && savings > 0) {
      insights.push({
        id: "tax_regime_old",
        type: "positive",
        category: "tax",
        text: `The Old Tax Regime is highly optimal for you, saving ${formatCurrency(savings)} annually through deductions.`,
        potentialSaving: savings,
        actionUrl: "/calculators/income-tax"
      });
    }
  }

  // 2. EPF Insights
  if (epf) {
    const healthScore = epf.healthScore;
    if (healthScore < 60) {
      insights.push({
        id: "epf_low_savings",
        type: "warning",
        category: "retirement",
        text: "Your retirement savings rate in EPF is low. Consider allocating more to VPF (Voluntary Provident Fund) for tax-free growth.",
        actionUrl: "/calculators/pf"
      });
    } else if (healthScore >= 80) {
      insights.push({
        id: "epf_healthy_savings",
        type: "positive",
        category: "retirement",
        text: "Excellent! Your EPF contributions are on track to build a substantial retirement corpus.",
        actionUrl: "/calculators/pf"
      });
    }
  }

  // 3. Gratuity Insights
  if (gratuity) {
    const { roundedYears, isEligible, monthsNeeded } = gratuity;
    if (!isEligible && roundedYears >= 4 && monthsNeeded > 0) {
      insights.push({
        id: "gratuity_threshold",
        type: "warning",
        category: "retirement",
        text: `You are just ${monthsNeeded} months away from completing the 5-year threshold required to lock in your gratuity benefits.`,
        actionUrl: "/calculators/gratuity"
      });
    } else if (isEligible) {
      insights.push({
        id: "gratuity_eligible",
        type: "positive",
        category: "retirement",
        text: `You have crossed the 5-year eligibility mark. You have unlocked a gratuity benefit of ${formatCurrency(gratuity.gratuityAmount)}.`,
        actionUrl: "/calculators/gratuity"
      });
    }
  }

  // 4. Leave Encashment Insights
  if (leaveEncashment) {
    const { reason, taxableAmount, taxExemptAmount, grossEncashment } = leaveEncashment;
    
    if (reason === "during_service" && grossEncashment > 0) {
      insights.push({
        id: "leave_during_service_tax",
        type: "negative",
        category: "leave",
        text: "Leave encashment during active service is fully taxable under your slab rate. Consider holding balance until retirement or resignation for potential tax exemptions.",
        actionUrl: "/calculators/leave-encashment"
      });
    } else if (reason === "resignation" && grossEncashment > 0) {
      insights.push({
        id: "leave_resignation_tax",
        type: "warning",
        category: "leave",
        text: `Your resignation leave encashment is taxable. Leave encashments received on resignation are fully taxable under standard IT rules.`,
        actionUrl: "/calculators/leave-encashment"
      });
    } else if (reason === "retirement" && taxableAmount > 0) {
      insights.push({
        id: "leave_retirement_partial_tax",
        type: "warning",
        category: "leave",
        text: `Your retirement leave encashment exceeds the ₹25L exemption limit. ${formatCurrency(taxableAmount)} is subject to income tax.`,
        actionUrl: "/calculators/leave-encashment"
      });
    } else if (reason === "retirement" && grossEncashment > 0 && taxableAmount === 0) {
      insights.push({
        id: "leave_retirement_tax_free",
        type: "positive",
        category: "leave",
        text: `Fantastic! Your retirement leave encashment of ${formatCurrency(taxExemptAmount)} is 100% tax-free under Section 10(10AA).`,
        actionUrl: "/calculators/leave-encashment"
      });
    }
  }

  // 5. Cross-Engine Insights (Ultimate Dashboard specific)
  if (epf && gratuity && leaveEncashment) {
    const totalCorpus = epf.projectedBalance + gratuity.projectedGratuity + leaveEncashment.grossEncashment;
    if (totalCorpus > 10000000) {
      insights.push({
        id: "crorepati_milestone",
        type: "positive",
        category: "retirement",
        text: "Your combined projected retirement payout (EPF + Gratuity + Leave) exceeds ₹1 Crore! You are well-positioned for financial freedom.",
      });
    }
  }

  return insights;
}
