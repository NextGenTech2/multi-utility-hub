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
  skipProjection?: boolean;
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

export interface EpsPensionEstimate {
  pensionableSalary: number;      // capped at ₹15,000/month
  pensionableService: number;      // capped at 35 years
  monthlyPension: number;          // (salary × service) / 70, min ₹1,000
  isWageCeilingApplied: boolean;
}

export function estimateEpsPension(inputs: {
  monthlyBasic: number;
  yearsOfService: number;
  ignoreEpsCeiling?: boolean;
}): EpsPensionEstimate {
  const basic = Math.max(0, inputs.monthlyBasic);
  const service = Math.min(35, Math.max(0, inputs.yearsOfService));
  const cappedBasic = inputs.ignoreEpsCeiling ? basic : Math.min(basic, 15000);
  let monthlyPension = inputs.yearsOfService >= 10 ? (cappedBasic * service) / 70 : 0;
  
  if (monthlyPension > 0 && monthlyPension < 1000) {
    monthlyPension = 1000; // minimum statutory pension
  }

  return {
    pensionableSalary: cappedBasic,
    pensionableService: service,
    monthlyPension: Math.round(monthlyPension),
    isWageCeilingApplied: basic > 15000 && !inputs.ignoreEpsCeiling,
  };
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
    
    if (!inputs.skipProjection) {
      timeline.push({
        year: inputs.currentAge + i,
        contribution: yearlyContribution,
        interest: yearlyInterest,
        balance: balance
      });
    }
    
    currentBasic *= (1 + (inputs.annualHike / 100));
  }

  // 3. EPS Pension Estimator
  const pensionEstimate = estimateEpsPension({
    monthlyBasic: numBasic,
    yearsOfService: inputs.serviceYears,
    ignoreEpsCeiling: inputs.ignoreEpsCeiling
  });
  const estimatedPension = pensionEstimate.monthlyPension;

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
