import { SalaryStore } from "@/store/salaryStore";
import { runTaxEngine } from "./tax/taxEngine";
import { runEpfEngine } from "./epfEngine";
import { runGratuityEngine } from "./gratuityEngine";
import { runOptimizationEngine } from "./optimizationEngine";

export function runDashboardEngine(store: SalaryStore) {
  // 1. Run Tax Engine
  // The tax engine expects CalculatorInputs. We map the store state to it.
  const taxInputs = {
    income: store.grossSalary,
    age: store.age,
    cityType: store.cityType,
    hraDeduction: store.hraExemption,
    homeLoanInterest: store.homeLoanInterest,
    otherDeductions: store.otherDeductions,
    
    // 80C breakdown
    epf: store.sec80c.epf,
    ppf: store.sec80c.ppf,
    elss: store.sec80c.elss,
    lifeInsurance: store.sec80c.lifeInsurance,
    taxSaverFd: store.sec80c.taxSaverFd,
    
    // Other Sections
    medicalInsurance: store.sec80d,
    npsSelf: store.npsSelf,
    npsEmployer: store.flexiBenefits.employerNps.enabled ? (store.grossSalary * (store.basicPercentage / 100) * 0.1) : 0,

    // Flexi Benefits
    mealCard: store.flexiBenefits.mealCard.enabled ? (2200 * 12) : 0,
    internet: store.flexiBenefits.internet,
    fuel: store.flexiBenefits.fuel,
    books: store.flexiBenefits.books,
    driver: store.flexiBenefits.driver,
    vehicleType: store.flexiBenefits.vehicleType
  };

  const { oldRegime, newRegime, oldBenefits, newBenefits } = runTaxEngine(taxInputs);

  // 2. Run EPF Engine
  const epfInputs = {
    basicSalary: store.grossSalary * (store.basicPercentage / 100),
    currentBalance: 0, // In a full app, we'd add this to the store
    currentAge: store.age,
    retirementAge: store.retirementAge,
    annualHike: 8, // Assuming a standard hike for projection
    epfInterest: 8.25,
    employeePct: 12,
    employerPct: 12,
    ignoreEpsCeiling: false,
    serviceYears: 0,
    withdrawalReason: "house" as any
  };
  
  const epfResult = runEpfEngine(epfInputs);

  // 3. Run Gratuity Engine
  const gratuityInputs = {
    basicSalary: store.grossSalary * (store.basicPercentage / 100),
    years: 0,
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
