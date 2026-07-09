import { ENGINE_VERSIONS } from "./versions";
import { createCachedEngine, estimateMarginalTax } from "./engineUtils";

export const VERSION = ENGINE_VERSIONS.leaveEncashment;

export interface LeaveEncashmentInputs {
  employmentType: "government" | "psu" | "private";
  reason: "retirement" | "resignation" | "during_service";
  monthlyBasic: number;
  dearnessAllowance: number;
  earnedLeaveBalance: number;
  leaveAvailed: number;
  leavesToEncash: number;
  employerLeavePolicy: number; // e.g., 30, 45, etc.
  yearsOfService: number;
  taxRegime: "old" | "new";
  otherIncome: number; // for marginal tax estimation
}

export interface LeaveEncashmentResult {
  monthlySalary: number;
  dailySalary: number;
  eligibleLeave: number;
  grossEncashment: number;
  taxExemptAmount: number;
  taxableAmount: number;
  estimatedTax: number;
  netAmount: number;

  exemptionBreakdown: {
    actualEncashment: number;
    cashEquivalent: number;
    tenMonthsAvgSalary: number;
    governmentLimit: number;
    exemptReason: string;
  };

  calculationSteps: Array<{
    label: string;
    value: number;
    formattedValue: string;
    formula?: string;
  }>;

  scenarioComparison: Array<{
    scenario: string;
    grossAmount: number;
    taxExempt: number;
    taxable: number;
    tax: number;
    netAmount: number;
    isCurrent: boolean;
  }>;
}

function formatINR(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export const runLeaveEncashmentEngine = createCachedEngine(
  (inputs: LeaveEncashmentInputs): LeaveEncashmentResult => {
    const basic = Math.max(0, inputs.monthlyBasic);
    const da = Math.max(0, inputs.dearnessAllowance);
    const monthlySalary = basic + da;
    const dailySalary = monthlySalary / 30;

    const balance = Math.max(0, inputs.earnedLeaveBalance);
    const availed = Math.max(0, inputs.leaveAvailed);
    const encash = Math.max(0, inputs.leavesToEncash);
    const years = Math.max(0, inputs.yearsOfService);
    const policyLimit = Math.max(0, inputs.employerLeavePolicy);

    // 1. Math for Gross Encashment
    // Gross is based on how many leaves the user is actually encashing (leavesToEncash)
    const grossEncashment = encash * dailySalary;

    // 2. Tax Exemption Logic under Section 10(10AA)
    let taxExemptAmount = 0;
    let exemptReason = "N/A";

    const actualEncashment = grossEncashment;
    
    // Cash equivalent: Max 30 days allowed per year of service minus availed leaves
    const maxAllowedEarned = Math.min(30, policyLimit) * years;
    const eligibleLeave = Math.max(0, Math.min(balance, maxAllowedEarned - availed));
    const cashEquivalent = eligibleLeave * dailySalary;

    const tenMonthsAvgSalary = monthlySalary * 10;
    const governmentLimit = 2500000; // Updated ₹25 Lakhs limit since FY 2023-24

    if (inputs.employmentType === "government") {
      // Government employees get 100% tax-free leave encashment at retirement/resignation
      if (inputs.reason !== "during_service") {
        taxExemptAmount = grossEncashment;
        exemptReason = "100% Tax Exempt for Government Employees";
      } else {
        taxExemptAmount = 0;
        exemptReason = "Fully taxable during active service";
      }
    } else {
      // Non-government (Private & PSU)
      if (inputs.reason === "retirement") {
        // Exemption applies at retirement
        const values = [
          { name: "Actual Encashment Received", val: actualEncashment },
          { name: "Cash Equivalent of Unavailed Leaves (Capped at 30 days/yr)", val: cashEquivalent },
          { name: "10 Months Average Salary", val: tenMonthsAvgSalary },
          { name: "Statutory Government Limit", val: governmentLimit },
        ];

        // Find the lowest value
        const lowest = values.reduce((prev, curr) => (curr.val < prev.val ? curr : prev));
        taxExemptAmount = Math.max(0, lowest.val);
        exemptReason = lowest.name;
      } else if (inputs.reason === "resignation") {
        // Historically, resignation leave encashment is also exempt under 10(10AA) as it is treated as retirement under tax laws.
        // Let's implement the retirement rules for resignation as well, which matches standard Indian payroll practice.
        const values = [
          { name: "Actual Encashment Received", val: actualEncashment },
          { name: "Cash Equivalent of Unavailed Leaves (Capped at 30 days/yr)", val: cashEquivalent },
          { name: "10 Months Average Salary", val: tenMonthsAvgSalary },
          { name: "Statutory Government Limit", val: governmentLimit },
        ];
        const lowest = values.reduce((prev, curr) => (curr.val < prev.val ? curr : prev));
        taxExemptAmount = Math.max(0, lowest.val);
        exemptReason = lowest.name;
      } else {
        // During service is fully taxable
        taxExemptAmount = 0;
        exemptReason = "Fully taxable during active service";
      }
    }

    // Taxable portion
    const taxableAmount = Math.max(0, grossEncashment - taxExemptAmount);

    // Marginal tax calculation
    const taxEst = estimateMarginalTax(taxableAmount, inputs.otherIncome, inputs.taxRegime);
    const estimatedTax = taxEst.tax;
    const netAmount = Math.max(0, grossEncashment - estimatedTax);

    // 3. Calculation Steps (for transparency table)
    const calculationSteps = [
      {
        label: "Monthly Salary (Basic + DA)",
        value: monthlySalary,
        formattedValue: formatINR(monthlySalary),
        formula: "Basic Salary + Dearness Allowance",
      },
      {
        label: "Daily Salary Rate",
        value: dailySalary,
        formattedValue: `${formatINR(dailySalary)} / day`,
        formula: "Monthly Salary / 30",
      },
      {
        label: "Leaves Encashed",
        value: encash,
        formattedValue: `${encash} Days`,
      },
      {
        label: "Gross Encashment Payout",
        value: grossEncashment,
        formattedValue: formatINR(grossEncashment),
        formula: "Daily Salary × Leaves Encashed",
      },
      {
        label: "Tax Exempt Portion",
        value: taxExemptAmount,
        formattedValue: formatINR(taxExemptAmount),
        formula: inputs.employmentType === "government" ? "100% Exempt" : "Least of Section 10(10AA) limits",
      },
      {
        label: "Taxable Portion",
        value: taxableAmount,
        formattedValue: formatINR(taxableAmount),
        formula: "Gross Encashment - Exempt Portion",
      },
    ];

    // Helper helper to run tax calculation for scenario table
    const getScenarioExemption = (targetReason: "retirement" | "resignation" | "during_service") => {
      if (inputs.employmentType === "government") {
        return targetReason !== "during_service" ? grossEncashment : 0;
      }
      if (targetReason === "during_service") {
        return 0;
      }
      // retirement/resignation
      const values = [actualEncashment, cashEquivalent, tenMonthsAvgSalary, governmentLimit];
      return Math.max(0, Math.min(...values));
    };

    // 4. Scenario comparisons
    const scenarioTypes: Array<"retirement" | "resignation" | "during_service"> = [
      "retirement",
      "resignation",
      "during_service",
    ];

    const scenarioLabels = {
      retirement: "Retirement / Superannuation",
      resignation: "Resignation / Exit",
      during_service: "During Active Service",
    };

    const scenarioComparison = scenarioTypes.map((scen) => {
      const exempt = getScenarioExemption(scen);
      const taxable = Math.max(0, grossEncashment - exempt);
      const taxAmount = estimateMarginalTax(taxable, inputs.otherIncome, inputs.taxRegime).tax;
      return {
        scenario: scenarioLabels[scen],
        grossAmount: grossEncashment,
        taxExempt: exempt,
        taxable,
        tax: taxAmount,
        netAmount: Math.max(0, grossEncashment - taxAmount),
        isCurrent: inputs.reason === scen,
      };
    });

    return {
      monthlySalary,
      dailySalary,
      eligibleLeave,
      grossEncashment,
      taxExemptAmount,
      taxableAmount,
      estimatedTax,
      netAmount,
      exemptionBreakdown: {
        actualEncashment,
        cashEquivalent,
        tenMonthsAvgSalary,
        governmentLimit,
        exemptReason,
      },
      calculationSteps,
      scenarioComparison,
    };
  }
);
