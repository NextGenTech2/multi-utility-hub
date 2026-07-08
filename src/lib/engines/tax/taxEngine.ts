import { calculateOldRegimeTax } from "./oldRegime";
import { calculateNewRegimeTax } from "./newRegime";
import { 
  SalaryBreakdown, 
  BenefitInput, 
  BenefitResult, 
  AdvancedDeductions, 
  TaxBreakdown, 
  OptimizationSuggestion, 
  OptimizationReport 
} from "./rules";

// Import benefit engines
import { calculateMealCard } from "./benefits/mealCard";
import { calculateEmployerNps } from "./benefits/employerNps";
import { calculateFuel } from "./benefits/fuel";
import { calculateDriver } from "./benefits/driver";
import { calculateInternet } from "./benefits/internet";
import { calculateTelephone } from "./benefits/telephone";
import { calculateVehicle, VehicleBenefitInput } from "./benefits/vehicle";
import { calculateGiftVoucher } from "./benefits/giftVoucher";
import { calculateBooks } from "./benefits/books";

export interface CalculatorInputs {
  grossSalary: number;
  salaryBreakdown?: SalaryBreakdown;
  isAdvanced: boolean;
  rentPaid?: number;
  isMetro?: boolean;
  manualHraExemption?: number;
  flexiBenefits: {
    // Vehicle Category
    vehicleBenefitType: "none" | "maintenance_small" | "maintenance_large" | "combined_small" | "combined_large";
    vehicleMaintenanceAmount: number;
    // Monthly Category
    employerNps: BenefitInput;
    foodCoupon: BenefitInput;
    internet: BenefitInput;
    mobile: BenefitInput;
    telephone: BenefitInput;
    fuel: BenefitInput;
    driver: BenefitInput;
    // Annual Category
    books: BenefitInput;
    professionalMembership: BenefitInput;
    giftVoucher: BenefitInput;
    lta: BenefitInput;
    uniform: BenefitInput;
    newspaper: BenefitInput;
    internetEquipment: BenefitInput;
  };
  deductions: AdvancedDeductions;
}

export function runTaxEngine(inputs: CalculatorInputs) {
  const grossSalary = inputs.grossSalary;
  
  // 1. Resolve Salary Breakdown (Basic, HRA, etc.)
  const breakdown = inputs.salaryBreakdown || {
    basic: Math.round(grossSalary * 0.45),
    hra: Math.round(grossSalary * 0.18),
    specialAllowance: Math.round(grossSalary * 0.20),
    bonus: Math.round(grossSalary * 0.05),
    performanceBonus: Math.round(grossSalary * 0.05),
    employerPf: Math.round(grossSalary * 0.054),
    gratuity: Math.round(grossSalary * 0.021),
    otherAllowances: Math.round(grossSalary * 0.045),
  };

  const basicSalary = breakdown.basic;

  // 2. Compute Employer Benefits & Exemptions for BOTH regimes
  const computeExemptions = (regime: "old" | "new") => {
    const results: BenefitResult[] = [];

    // Food Coupon (Meal Card)
    results.push(calculateMealCard(inputs.flexiBenefits.foodCoupon, basicSalary, regime));

    // Employer NPS
    results.push(calculateEmployerNps(inputs.flexiBenefits.employerNps, basicSalary, regime));

    // Fuel
    results.push(calculateFuel(inputs.flexiBenefits.fuel, basicSalary, regime));

    // Driver
    results.push(calculateDriver(inputs.flexiBenefits.driver, basicSalary, regime));

    // Internet
    results.push(calculateInternet(inputs.flexiBenefits.internet, basicSalary, regime));

    // Telephone
    results.push(calculateTelephone(inputs.flexiBenefits.telephone, basicSalary, regime));

    // Vehicle Car Benefits
    if (inputs.flexiBenefits.vehicleBenefitType !== "none") {
      const vehInput: VehicleBenefitInput = {
        enabled: true,
        monthlyAmount: inputs.flexiBenefits.vehicleMaintenanceAmount,
        vehicleType: inputs.flexiBenefits.vehicleBenefitType,
      };
      results.push(calculateVehicle(vehInput, basicSalary, regime));
    }

    // Books & Periodicals
    results.push(calculateBooks(inputs.flexiBenefits.books, basicSalary, regime));

    // Gift Voucher
    results.push(calculateGiftVoucher(inputs.flexiBenefits.giftVoucher, basicSalary, regime));

    // --- Inline implementations for other standard corporate benefits ---
    
    // Mobile Reimbursement (Exempt up to ₹1,500/month in both regimes)
    if (inputs.flexiBenefits.mobile.enabled) {
      const amount = Math.min(inputs.flexiBenefits.mobile.monthlyAmount, 1500) * 12;
      results.push({
        id: "mobile",
        name: "Mobile Reimbursement",
        eligibleAmount: 1500,
        exemptAmount: amount,
        taxImpact: 0,
        explanation: "Reimbursements of hand-held mobile device bills are tax-free under corporate guidelines.",
        proofRequired: "Mobile operator bills showing call charges.",
      });
    }

    // Professional Membership (Exempt up to ₹10,000/year in both regimes)
    if (inputs.flexiBenefits.professionalMembership.enabled) {
      const declared = inputs.flexiBenefits.professionalMembership.declaredAmount !== undefined
        ? inputs.flexiBenefits.professionalMembership.declaredAmount
        : inputs.flexiBenefits.professionalMembership.monthlyAmount * 12;
      const amount = Math.min(declared, 10000);
      results.push({
        id: "professionalMembership",
        name: "Professional Membership",
        eligibleAmount: 833, // monthly equivalent of 10000
        exemptAmount: amount,
        taxImpact: 0,
        explanation: "Corporate payment of professional association fees is tax-exempt in both regimes.",
        proofRequired: "Receipt showing fee payment to standard professional bodies.",
      });
    }

    // LTA (Exempt up to declared, max ₹1,00,000/year, only allowed in Old regime)
    if (inputs.flexiBenefits.lta.enabled && regime === "old") {
      const declared = inputs.flexiBenefits.lta.declaredAmount !== undefined
        ? inputs.flexiBenefits.lta.declaredAmount
        : inputs.flexiBenefits.lta.monthlyAmount * 12;
      const amount = Math.min(declared, 100000);
      results.push({
        id: "lta",
        name: "Leave Travel Allowance (LTA)",
        eligibleAmount: 8333,
        exemptAmount: amount,
        taxImpact: 0,
        explanation: "Exempt for domestic travel tickets twice in a block of 4 years. Only allowed in the Old Tax Regime.",
        proofRequired: "Boarding passes, train/air tickets, and travel receipts.",
      });
    }

    // Uniform Allowance (Exempt up to ₹12,000/year in both regimes)
    if (inputs.flexiBenefits.uniform.enabled) {
      const declared = inputs.flexiBenefits.uniform.declaredAmount !== undefined
        ? inputs.flexiBenefits.uniform.declaredAmount
        : inputs.flexiBenefits.uniform.monthlyAmount * 12;
      const amount = Math.min(declared, 12000);
      results.push({
        id: "uniform",
        name: "Uniform / Dress Code Allowance",
        eligibleAmount: 1000,
        exemptAmount: amount,
        taxImpact: 0,
        explanation: "Allowance for purchase/maintenance of specific work uniform is tax-free in both regimes.",
        proofRequired: "Uniform purchase cash memos.",
      });
    }

    // Newspaper Allowance (Exempt up to ₹5,000/year, allowed in Old only)
    if (inputs.flexiBenefits.newspaper.enabled && regime === "old") {
      const declared = inputs.flexiBenefits.newspaper.declaredAmount !== undefined
        ? inputs.flexiBenefits.newspaper.declaredAmount
        : inputs.flexiBenefits.newspaper.monthlyAmount * 12;
      const amount = Math.min(declared, 5000);
      results.push({
        id: "newspaper",
        name: "Newspaper Allowance",
        eligibleAmount: 417,
        exemptAmount: amount,
        taxImpact: 0,
        explanation: "Daily newspapers delivered to employee's residence are tax-exempt (Old Regime only).",
        proofRequired: "Vendor newspaper bills or statements.",
      });
    }

    // Internet Equipment (Exempt up to ₹25,000/year, allowed in Old only)
    if (inputs.flexiBenefits.internetEquipment.enabled && regime === "old") {
      const declared = inputs.flexiBenefits.internetEquipment.declaredAmount !== undefined
        ? inputs.flexiBenefits.internetEquipment.declaredAmount
        : inputs.flexiBenefits.internetEquipment.monthlyAmount * 12;
      const amount = Math.min(declared, 25000);
      results.push({
        id: "internetEquipment",
        name: "Internet Equipment (Modem/Router)",
        eligibleAmount: 2083,
        exemptAmount: amount,
        taxImpact: 0,
        explanation: "Employer-provided hardware assets like routers/modems are exempt (Old Regime only).",
        proofRequired: "Hardware retail tax invoices.",
      });
    }

    return results;
  };

  // Compute exemptions for both regimes
  const oldBenefits = computeExemptions("old");
  const newBenefits = computeExemptions("new");

  // HRA Exemption calculation (Section 10(13A))
  let hraExemption = 0;
  if (inputs.manualHraExemption !== undefined) {
    hraExemption = inputs.manualHraExemption;
  } else if (inputs.isAdvanced && breakdown.hra > 0) {
    const rentPaidVal = inputs.rentPaid || 0;
    const basicVal = breakdown.basic;
    const isMetroVal = inputs.isMetro || false;
    
    const capPercent = isMetroVal ? 0.50 : 0.40;
    const limit1 = breakdown.hra;
    const limit2 = Math.max(0, rentPaidVal - (basicVal * 0.10));
    const limit3 = basicVal * capPercent;
    
    hraExemption = Math.min(limit1, limit2, limit3);
  }

  const totalExemptOld = oldBenefits.reduce((acc, curr) => acc + curr.exemptAmount, 0) + hraExemption;
  const totalExemptNew = newBenefits.reduce((acc, curr) => acc + curr.exemptAmount, 0);

  // 3. Resolve Deductions (Old Regime only)
  // standard deduction is applied to both
  const standardDeductionOld = 50000;
  const standardDeductionNew = 75000;

  // Capped Deductions for Old regime
  const section80C = Math.min(
    150000,
    inputs.deductions.ppf +
      inputs.deductions.epf +
      inputs.deductions.elss +
      inputs.deductions.lifeInsurance +
      inputs.deductions.taxSaverFd
  );

  const section80CCD1B = Math.min(50000, inputs.deductions.npsSelf);
  const section80D = Math.min(75000, inputs.deductions.healthInsurance);
  const section24b = Math.min(200000, inputs.deductions.homeLoanInterest);
  const section80E = inputs.deductions.educationLoan;
  const section80G = inputs.deductions.donations;

  const totalDeductionsOldRegime = 
    section80C + section80CCD1B + section80D + section24b + section80E + section80G;

  // 4. Calculate Final Taxable Income and Taxes
  const oldTaxable = Math.max(0, grossSalary - totalExemptOld - standardDeductionOld - totalDeductionsOldRegime);
  const oldTaxResult = calculateOldRegimeTax(oldTaxable);

  const newTaxable = Math.max(0, grossSalary - totalExemptNew - standardDeductionNew);
  const newTaxResult = calculateNewRegimeTax(newTaxable);

  // 5. Calculate Taxes WITHOUT Flexi Benefits (for savings card computation)
  const oldTaxableNoFlexi = Math.max(0, grossSalary - standardDeductionOld - totalDeductionsOldRegime);
  const oldTaxNoFlexi = calculateOldRegimeTax(oldTaxableNoFlexi).totalTax;

  const newTaxableNoFlexi = Math.max(0, grossSalary - standardDeductionNew);
  const newTaxNoFlexi = calculateNewRegimeTax(newTaxableNoFlexi).totalTax;

  const oldFlexiSavings = Math.max(0, oldTaxNoFlexi - oldTaxResult.totalTax);
  const newFlexiSavings = Math.max(0, newTaxNoFlexi - newTaxResult.totalTax);

  // Populate taxImpact for each benefit item based on incremental tax saved
  // For New Regime:
  newBenefits.forEach((b) => {
    if (b.exemptAmount > 0) {
      // Calculate tax if this specific benefit was disabled
      const reducedExempt = totalExemptNew - b.exemptAmount;
      const tIncome = Math.max(0, grossSalary - reducedExempt - standardDeductionNew);
      const taxWithoutB = calculateNewRegimeTax(tIncome).totalTax;
      b.taxImpact = Math.max(0, taxWithoutB - newTaxResult.totalTax);
    }
  });

  // For Old Regime:
  oldBenefits.forEach((b) => {
    if (b.exemptAmount > 0) {
      const reducedExempt = totalExemptOld - b.exemptAmount;
      const tIncome = Math.max(0, grossSalary - reducedExempt - standardDeductionOld - totalDeductionsOldRegime);
      const taxWithoutB = calculateOldRegimeTax(tIncome).totalTax;
      b.taxImpact = Math.max(0, taxWithoutB - oldTaxResult.totalTax);
    }
  });

  // Recommended Regime
  let recommendedRegime: "old" | "new" | "equal" = "equal";
  let savings = 0;
  if (oldTaxResult.totalTax < newTaxResult.totalTax) {
    recommendedRegime = "old";
    savings = newTaxResult.totalTax - oldTaxResult.totalTax;
  } else if (newTaxResult.totalTax < oldTaxResult.totalTax) {
    recommendedRegime = "new";
    savings = oldTaxResult.totalTax - newTaxResult.totalTax;
  }

  // 6. Generate Dynamic Salary Optimization Suggestions (Focus on New Regime)
  const suggestions: OptimizationSuggestion[] = [];

  const checkAndAddSuggestion = (
    id: string,
    name: string,
    enabled: boolean,
    monthlyPotential: number,
    difficulty: "Easy" | "Medium" | "Advanced",
    requiresHrApproval: boolean,
    explanation: string
  ) => {
    if (!enabled && grossSalary > 700000) {
      // Calculate potential savings in New Regime if this benefit is enabled at standard potential
      const newExemptAmount = totalExemptNew + (monthlyPotential * 12);
      const testTaxable = Math.max(0, grossSalary - newExemptAmount - standardDeductionNew);
      const testTax = calculateNewRegimeTax(testTaxable).totalTax;
      const potentialSaved = Math.max(0, newTaxResult.totalTax - testTax);
      
      if (potentialSaved > 0) {
        suggestions.push({
          id,
          benefitName: name,
          potentialSaving: potentialSaved,
          difficulty,
          requiresHrApproval,
          explanation,
        });
      }
    }
  };

  // Check NPS
  checkAndAddSuggestion(
    "employerNps",
    "Employer NPS Contribution",
    inputs.flexiBenefits.employerNps.enabled,
    Math.round((basicSalary / 12) * 0.10),
    "Medium",
    true,
    "Investing in NPS via your employer lowers your taxable income directly under Section 80CCD(2)."
  );

  // Check Food Coupon
  checkAndAddSuggestion(
    "foodCoupon",
    "Food Coupon (Meal Card)",
    inputs.flexiBenefits.foodCoupon.enabled,
    8800,
    "Easy",
    false,
    "Opt for meal vouchers (e.g. Pluxee/Sodexo) to save tax on food expenses up to ₹1,05,600 per year."
  );

  // Check Vehicle
  checkAndAddSuggestion(
    "vehicle",
    "Vehicle Car Maintenance",
    inputs.flexiBenefits.vehicleBenefitType !== "none",
    7000,
    "Advanced",
    true,
    "Restructure your CTC to include car maintenance allowances of up to ₹84,000/year (₹7,000/month) if you own/commute by car (Old Regime only)."
  );

  // Check Internet
  checkAndAddSuggestion(
    "internet",
    "Internet & Broadband Reimbursement",
    inputs.flexiBenefits.internet.enabled,
    1500,
    "Easy",
    false,
    "Claim broadband and telephone reimbursements if you work remotely or commute online."
  );

  // Check Books
  checkAndAddSuggestion(
    "books",
    "Books & Journals Reimbursement",
    inputs.flexiBenefits.books.enabled,
    1250,
    "Easy",
    false,
    "Submit invoices for magazines, journals, or technical books used for professional skill-building."
  );

  // 7. Calculate Optimization Score
  // Max score is 100. Base score is 40. Each checked benefit adds points.
  let points = 40;
  const listChecks = [
    inputs.flexiBenefits.employerNps.enabled,
    inputs.flexiBenefits.foodCoupon.enabled,
    inputs.flexiBenefits.internet.enabled,
    inputs.flexiBenefits.mobile.enabled || inputs.flexiBenefits.telephone.enabled,
    inputs.flexiBenefits.fuel.enabled || inputs.flexiBenefits.vehicleBenefitType !== "none",
    inputs.flexiBenefits.books.enabled,
    inputs.flexiBenefits.giftVoucher.enabled,
    inputs.flexiBenefits.professionalMembership.enabled,
  ];
  
  const checkedCount = listChecks.filter(Boolean).length;
  points += checkedCount * 7.5; // Up to 60 points for 8 items
  const optimizationScore = Math.min(100, Math.round(points));

  // 8. Compile Surcharges & Cess details
  const taxBreakdownOld: TaxBreakdown = {
    regime: "old",
    grossSalary,
    totalBenefitsExempt: totalExemptOld - hraExemption,
    taxableIncome: oldTaxable,
    baseTax: oldTaxResult.baseTax,
    surcharge: oldTaxResult.surcharge,
    cess: oldTaxResult.cess,
    totalTax: oldTaxResult.totalTax,
    monthlyTds: Math.round(oldTaxResult.totalTax / 12),
    takeHomeSalary: Math.max(0, grossSalary - oldTaxResult.totalTax),
    effectiveTaxRate: parseFloat(((oldTaxResult.totalTax / grossSalary) * 100).toFixed(2)) || 0,
    averageTaxRate: parseFloat(((oldTaxResult.baseTax / (oldTaxable || 1)) * 100).toFixed(2)) || 0,
  };

  const taxBreakdownNew: TaxBreakdown = {
    regime: "new",
    grossSalary,
    totalBenefitsExempt: totalExemptNew,
    taxableIncome: newTaxable,
    baseTax: newTaxResult.baseTax,
    surcharge: newTaxResult.surcharge,
    cess: newTaxResult.cess,
    totalTax: newTaxResult.totalTax,
    monthlyTds: Math.round(newTaxResult.totalTax / 12),
    takeHomeSalary: Math.max(0, grossSalary - newTaxResult.totalTax),
    effectiveTaxRate: parseFloat(((newTaxResult.totalTax / grossSalary) * 100).toFixed(2)) || 0,
    averageTaxRate: parseFloat(((newTaxResult.baseTax / (newTaxable || 1)) * 100).toFixed(2)) || 0,
  };

  const activeBreakdown = recommendedRegime === "old" ? taxBreakdownOld : taxBreakdownNew;

  // Unused benefits count
  const totalPotentialBenefitsCount = 14;
  const benefitsUsedCount = checkedCount;
  const unusedBenefitsCount = Math.max(0, totalPotentialBenefitsCount - benefitsUsedCount);

  // Total potential additional savings
  const potentialAdditionalSaving = suggestions.reduce((acc, curr) => acc + curr.potentialSaving, 0);

  const report: OptimizationReport = {
    ctc: grossSalary,
    employerBenefitsUsed: totalExemptNew,
    unusedBenefits: unusedBenefitsCount,
    potentialAdditionalSaving,
    recommendedRegime,
    optimizationScore,
  };

  return {
    oldRegime: taxBreakdownOld,
    newRegime: taxBreakdownNew,
    oldBenefits,
    newBenefits,
    oldFlexiSavings,
    newFlexiSavings,
    recommendedRegime,
    savings,
    suggestions,
    score: optimizationScore,
    report,
    breakdown,
    hraExemption,
  };
}
