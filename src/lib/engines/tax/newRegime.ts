export function calculateNewRegimeTax(taxableIncome: number) {
  let baseTax = 0;

  if (taxableIncome <= 300000) {
    baseTax = 0;
  } else if (taxableIncome <= 600000) {
    baseTax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    baseTax = 15000 + (taxableIncome - 600000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    baseTax = 15000 + 30000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    baseTax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.20;
  } else {
    baseTax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.30;
  }

  // Section 87A Rebate with Marginal Relief under New Regime
  let taxAfterRebate = baseTax;
  if (taxableIncome <= 700000) {
    taxAfterRebate = 0;
  } else {
    // Marginal relief under Section 87A (Budget 2023 onwards)
    // If taxable income is slightly above 7L, the tax liability before cess
    // cannot exceed the amount by which taxable income exceeds 7L.
    const excessIncome = taxableIncome - 700000;
    if (baseTax > excessIncome) {
      taxAfterRebate = excessIncome;
    }
  }

  // Surcharge Rates (capped at 25% under New Regime)
  let surchargeRate = 0;
  let surchargeThreshold = 0;
  if (taxableIncome > 20000000) {
    surchargeRate = 0.25;
    surchargeThreshold = 20000000;
  } else if (taxableIncome > 10000000) {
    surchargeRate = 0.15;
    surchargeThreshold = 10000000;
  } else if (taxableIncome > 5000000) {
    surchargeRate = 0.10;
    surchargeThreshold = 5000000;
  }

  let surcharge = taxAfterRebate * surchargeRate;

  // Surcharge Marginal Relief
  if (surchargeThreshold > 0) {
    // Tax on threshold limit
    const baseTaxAtThreshold = calculateBaseTaxNew(surchargeThreshold);
    const taxAfterRebateAtThreshold = surchargeThreshold <= 700000 ? 0 : baseTaxAtThreshold; // under 7L is 0
    
    // Surcharge on threshold limit
    let prevSurchargeRate = 0;
    if (surchargeThreshold === 20000000) prevSurchargeRate = 0.15;
    else if (surchargeThreshold === 10000000) prevSurchargeRate = 0.10;
    
    const surchargeAtThreshold = taxAfterRebateAtThreshold * prevSurchargeRate;
    const totalTaxAtThreshold = taxAfterRebateAtThreshold + surchargeAtThreshold;
    
    const excessIncome = taxableIncome - surchargeThreshold;
    const maxAllowedTax = totalTaxAtThreshold + excessIncome;
    
    if (taxAfterRebate + surcharge > maxAllowedTax) {
      surcharge = Math.max(0, maxAllowedTax - taxAfterRebate);
    }
  }

  const taxAndSurcharge = taxAfterRebate + surcharge;
  const cess = Math.round(taxAndSurcharge * 0.04);
  const totalTax = Math.round(taxAndSurcharge + cess);

  return {
    baseTax: Math.round(taxAfterRebate),
    surcharge: Math.round(surcharge),
    cess,
    totalTax,
  };
}

function calculateBaseTaxNew(income: number): number {
  if (income <= 300000) return 0;
  if (income <= 600000) return (income - 300000) * 0.05;
  if (income <= 900000) return 15000 + (income - 600000) * 0.10;
  if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
  if (income <= 1500000) return 90000 + (income - 1200000) * 0.20;
  return 150000 + (income - 1500000) * 0.30;
}
