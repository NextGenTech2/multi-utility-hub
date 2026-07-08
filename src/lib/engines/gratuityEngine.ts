export interface GratuityEngineInputs {
  basicSalary: number;
  years: number;
  months: number;
  isCovered: boolean;
  hikePct: number;
  yearsToRetire: number;
}

export interface GratuityTimelineItem {
  year: number;
  amount: number;
}

export interface GratuityEngineResult {
  roundedYears: number;
  divisor: number;
  isEligible: boolean;
  gratuityAmount: number;
  projectedGratuity: number;
  timeline: GratuityTimelineItem[];
  monthsNeeded: number;
  scenarioAmount: number;
}

export function runGratuityEngine(inputs: GratuityEngineInputs): GratuityEngineResult {
  const salary = Math.max(0, inputs.basicSalary);
  
  // Gratuity Rules
  // Covered: 15/26, fractions >= 6 months count as 1 year
  // Not Covered: 15/30, fractions completely ignored
  const divisor = inputs.isCovered ? 26 : 30;
  let roundedYears = inputs.years;
  
  if (inputs.isCovered && inputs.months >= 6) {
    roundedYears += 1;
  }
  
  const isEligible = roundedYears >= 5;
  const gratuityAmount = (salary * 15 * roundedYears) / divisor;

  // Projection Logic
  let projectedSalary = salary;
  for (let i = 0; i < inputs.yearsToRetire; i++) {
    projectedSalary *= (1 + (inputs.hikePct / 100));
  }
  const projectedYears = roundedYears + inputs.yearsToRetire;
  const projectedGratuity = (projectedSalary * 15 * projectedYears) / divisor;

  // Timeline (Next 5 years)
  const timeline: GratuityTimelineItem[] = [];
  const startYear = Math.max(5, roundedYears);
  for (let y = startYear; y <= startYear + 5; y++) {
    timeline.push({
      year: y,
      amount: (salary * 15 * y) / divisor
    });
  }

  // Resignation Scenario
  const monthsOfService = (inputs.years * 12) + inputs.months;
  const targetMonths = inputs.isCovered ? (4 * 12) + 6 : (5 * 12); // 4y 6m for covered, 5y for not covered
  const monthsNeeded = Math.max(0, targetMonths - monthsOfService);
  const scenarioAmount = (salary * 15 * Math.max(5, roundedYears)) / divisor;

  return {
    roundedYears,
    divisor,
    isEligible,
    gratuityAmount,
    projectedGratuity,
    timeline,
    monthsNeeded,
    scenarioAmount
  };
}
