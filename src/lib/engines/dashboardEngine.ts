import { SalaryStore } from "@/store/salaryStore";
import { runTaxEngine } from "./tax/taxEngine";
import { runEpfEngine } from "./epfEngine";
import { runGratuityEngine } from "./gratuityEngine";
import { runOptimizationEngine } from "./optimizationEngine";

export function runDashboardEngine(store: SalaryStore) {
  // 1. Run Tax Engine
  // The tax engine expects CalculatorInputs. We map the store state to it.
  const taxInputs: any = {
    grossSalary: store.grossSalary,
    isAdvanced: true, // we have all the inputs from the store
    rentPaid: store.rentPaid,
    isMetro: store.city === "metro",
    manualHraExemption: store.manualHraExemption,
    flexiBenefits: {
      vehicleBenefitType: store.flexiBenefits.vehicleType,
      vehicleMaintenanceAmount: store.flexiBenefits.vehicleMaintenanceAmount,
      employerNps: { enabled: store.flexiBenefits.employerNps.enabled, monthlyAmount: store.flexiBenefits.employerNps.amount },
      foodCoupon: { enabled: store.flexiBenefits.mealCard.enabled, monthlyAmount: store.flexiBenefits.mealCard.amount },
      internet: { enabled: store.flexiBenefits.internet.enabled, monthlyAmount: store.flexiBenefits.internet.amount },
      mobile: { enabled: store.flexiBenefits.mobile.enabled, monthlyAmount: store.flexiBenefits.mobile.amount },
      telephone: { enabled: store.flexiBenefits.telephone.enabled, monthlyAmount: store.flexiBenefits.telephone.amount },
      fuel: { enabled: store.flexiBenefits.fuel.enabled, monthlyAmount: store.flexiBenefits.fuel.amount },
      driver: { enabled: store.flexiBenefits.driver.enabled, monthlyAmount: store.flexiBenefits.driver.amount },
      books: { enabled: store.flexiBenefits.books.enabled, monthlyAmount: store.flexiBenefits.books.amount },
      professionalMembership: { enabled: store.flexiBenefits.professionalMembership.enabled, monthlyAmount: store.flexiBenefits.professionalMembership.amount },
      giftVoucher: { enabled: store.flexiBenefits.giftVoucher.enabled, monthlyAmount: store.flexiBenefits.giftVoucher.amount },
      lta: { enabled: store.flexiBenefits.lta.enabled, monthlyAmount: store.flexiBenefits.lta.amount },
      uniform: { enabled: store.flexiBenefits.uniform.enabled, monthlyAmount: store.flexiBenefits.uniform.amount },
      newspaper: { enabled: store.flexiBenefits.newspaper.enabled, monthlyAmount: store.flexiBenefits.newspaper.amount },
      internetEquipment: { enabled: store.flexiBenefits.internetEquipment.enabled, monthlyAmount: store.flexiBenefits.internetEquipment.amount },
    },
    deductions: {
      epf: store.sec80c.epf,
      ppf: store.sec80c.ppf,
      elss: store.sec80c.elss,
      lifeInsurance: store.sec80c.lifeInsurance,
      taxSaverFd: store.sec80c.taxSaverFd,
      npsSelf: store.npsSelf,
      healthInsurance: store.sec80dHealthInsurance,
      homeLoanInterest: store.homeLoanInterest,
      educationLoan: store.educationLoan,
      donations: store.donations,
    }
  };

  const { oldRegime, newRegime, oldBenefits, newBenefits } = runTaxEngine(taxInputs);

  // 2. Run EPF Engine
  const epfInputs = {
    basicSalary: (store.grossSalary * (store.basicPercentage / 100)) / 12, // monthly basic salary!
    currentBalance: store.currentEpfBalance,
    currentAge: store.age,
    retirementAge: store.retirementAge,
    annualHike: 8, // Assuming a standard hike for projection
    epfInterest: store.expectedEpfInterestRate,
    employeePct: store.epfEmployeeValue,
    employerPct: store.epfEmployerValue,
    ignoreEpsCeiling: false,
    serviceYears: store.yearsOfService,
    withdrawalReason: "house" as any
  };
  
  const epfResult = runEpfEngine(epfInputs);

  // 3. Run Gratuity Engine
  const gratuityInputs = {
    basicSalary: (store.grossSalary * (store.basicPercentage / 100)) / 12, // monthly basic salary!
    years: store.yearsOfService,
    months: 0,
    isCovered: true,
    hikePct: 8,
    yearsToRetire: Math.max(0, store.retirementAge - store.age)
  };

  const gratuityResult = runGratuityEngine(gratuityInputs);

  // 4. Run Optimization Engine
  const optimization = runOptimizationEngine(
    store,
    oldRegime,
    newRegime,
    oldBenefits,
    newBenefits,
    epfResult,
    gratuityResult
  );

  return {
    tax: {
      oldRegime,
      newRegime,
      oldBenefits,
      newBenefits
    },
    epf: epfResult,
    gratuity: gratuityResult,
    optimization
  };
}
