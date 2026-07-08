export interface EpfEngineInputs {
  basicSalary: number;
  currentBalance: number;
  currentAge: number;
  retirementAge: number;
  annualHike: number; // percentage
  epfInterest: number; // percentage
  employeePct: number; // percentage
  employerPct: number; // percentage
  ignoreEpsCeiling: boolean;
  serviceYears: number; // For pension and withdrawal
  withdrawalReason: "house" | "medical" | "education" | "marriage" | "unemployment";
}

export interface EpfYearlyProjection {
  year: number;
  contribution: number;
  interest: number;
  balance: number;
}

export interface EpfEngineResult {
  // Monthly Split
  employeeEPF: number;
  employerTotal: number;
  employerEPS: number;
  employerEPF: number;
  totalMonthlyEPF: number;

  // Projections
  projectedBalance: number;
  totalDeposited: number;
  totalInterestEarned: number;
  timeline: EpfYearlyProjection[];

  // Pension
  estimatedPension: number;

  // Withdrawals
  maxWithdrawal: number;
  isWithdrawalTaxFree: boolean;

  // Health Score
  healthScore: number;
  healthScoreText: string;
}

export function runEpfEngine(inputs: EpfEngineInputs): EpfEngineResult {
  const numBasic = Math.max(0, inputs.basicSalary);
  const numBalance = Math.max(0, inputs.currentBalance);

  // 1. Monthly Split Math
  const employeeEPF = numBasic * (inputs.employeePct / 100);
  const employerTotal = numBasic * (inputs.employerPct / 100);
  
  const epsWageCeiling = inputs.ignoreEpsCeiling ? numBasic : Math.min(numBasic, 15000);
  const employerEPS = epsWageCeiling * 0.0833;
  const employerEPF = Math.max(0, employerTotal - employerEPS);
  const totalMonthlyEPF = employeeEPF + employerEPF;

  // 2. Future Projection & Compounding Loop
  let balance = numBalance;
  let currentBasic = numBasic;
  let totalDeposited = numBalance;
  let totalInterest = 0;
  
  const timeline: EpfYearlyProjection[] = [];
  const yearsToRetire = Math.max(0, inputs.retirementAge - inputs.currentAge);

  for (let i = 1; i <= yearsToRetire; i++) {
    const yEmployeeEPF = currentBasic * (inputs.employeePct / 100);
    const yEmployerTotal = currentBasic * (inputs.employerPct / 100);
    const yEpsWageCeiling = inputs.ignoreEpsCeiling ? currentBasic : Math.min(currentBasic, 15000);
    const yEmployerEPS = yEpsWageCeiling * 0.0833;
    const yEmployerEPF = Math.max(0, yEmployerTotal - yEmployerEPS);
    const yTotalMonthly = yEmployeeEPF + yEmployerEPF;
    
    const yearlyContribution = yTotalMonthly * 12;
    const yearlyInterest = (balance + (yearlyContribution / 2)) * (inputs.epfInterest / 100);
    
    balance += yearlyContribution + yearlyInterest;
    totalDeposited += yearlyContribution;
    totalInterest += yearlyInterest;
    
    timeline.push({
      year: inputs.currentAge + i,
      contribution: yearlyContribution,
      interest: yearlyInterest,
      balance: balance
    });
    
    currentBasic *= (1 + (inputs.annualHike / 100));
  }

  // 3. EPS Pension Estimator
  const pensionableService = Math.min(35, Math.max(0, inputs.serviceYears));
  const pensionableSalary = inputs.ignoreEpsCeiling ? numBasic : Math.min(numBasic, 15000);
  const estimatedPension = inputs.serviceYears >= 10 ? (pensionableSalary * pensionableService) / 70 : 0;

  // 4. Withdrawal Rules Math
  let maxWithdrawal = 0;
  if (inputs.withdrawalReason === "house") {
    maxWithdrawal = Math.min(balance, Math.max(numBasic * 36, (employeeEPF + employerEPF) * 12 * 3));
  } else if (inputs.withdrawalReason === "medical" || inputs.withdrawalReason === "education" || inputs.withdrawalReason === "marriage") {
    maxWithdrawal = employeeEPF * 12 * inputs.serviceYears * 0.5;
  } else if (inputs.withdrawalReason === "unemployment") {
    maxWithdrawal = balance * 0.75;
  }
  
  const isWithdrawalTaxFree = inputs.serviceYears >= 5;

  // 5. EPF Health Score
  let score = 50;
  if (inputs.annualHike >= 10) score += 15;
  if (inputs.annualHike >= 5 && inputs.annualHike < 10) score += 10;
  if (inputs.employeePct >= 12) score += 10;
  if (numBalance > numBasic * 12) score += 15;
  if ((inputs.retirementAge - inputs.currentAge) >= 20) score += 10;
  
  score = Math.min(100, Math.max(0, score));
  let scoreText = "Average";
  if (score >= 80) scoreText = "Excellent";
  else if (score >= 60) scoreText = "Good";
  else if (score < 40) scoreText = "Needs Attention";

  return {
    employeeEPF,
    employerTotal,
    employerEPS,
    employerEPF,
    totalMonthlyEPF,
    projectedBalance: balance,
    totalDeposited,
    totalInterestEarned: totalInterest,
    timeline,
    estimatedPension,
    maxWithdrawal,
    isWithdrawalTaxFree,
    healthScore: score,
    healthScoreText: scoreText
  };
}
