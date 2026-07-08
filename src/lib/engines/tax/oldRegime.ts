export function calculateOldRegimeTax(taxableIncome: number) {
  let baseTax = 0;

  if (taxableIncome <= 250000) {
    baseTax = 0;
  } else if (taxableIncome <= 500000) {
    baseTax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    baseTax = 12500 + (taxableIncome - 500000) * 0.20;
  } else {
    baseTax = 112500 + (taxableIncome - 1000000) * 0.30;
  }

  // Section 87A Rebate (up to ₹12,500 for income <= ₹5,00,000)
  let rebate = 0;
  if (taxableIncome <= 500000) {
    rebate = baseTax;
  }
  let taxAfterRebate = Math.max(0, baseTax - rebate);

  // Surcharge Rates
  let surchargeRate = 0;
  let surchargeThreshold = 0;
  if (taxableIncome > 50000000) {
    surchargeRate = 0.37;
    surchargeThreshold = 50000000;
  } else if (taxableIncome > 20000000) {
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

  // Marginal Relief for Surcharge
  if (surchargeThreshold > 0) {
    // Tax on threshold limit
    const baseTaxAtThreshold = calculateBaseTaxOld(surchargeThreshold);
    const prevRebate = surchargeThreshold <= 500000 ? baseTaxAtThreshold : 0;
    const taxAfterRebateAtThreshold = baseTaxAtThreshold - prevRebate;
    
    // Surcharge on threshold limit
    let prevSurchargeRate = 0;
    if (surchargeThreshold === 50000000) prevSurchargeRate = 0.25;
    else if (surchargeThreshold === 20000000) prevSurchargeRate = 0.15;
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

function calculateBaseTaxOld(income: number): number {
  if (income <= 250000) return 0;
  if (income <= 500000) return (income - 250000) * 0.05;
  if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
  return 112500 + (income - 1000000) * 0.30;
}
