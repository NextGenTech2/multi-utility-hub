"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileText, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Printer, 
  Download, 
  ArrowRight,
  HelpCircle,
  ChevronRight,
  Zap,
  History,
  Copy,
  MessageCircle
} from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { useCurrency } from "@/context/CurrencyContext";
import { FinancialDisclaimer } from "@/components/FinancialDisclaimer";
import { FAQAccordion } from "@/components/FAQAccordion";
import { INCOME_TAX_FAQS } from "@/data/financeFaqs";
import { useSalaryStore } from "@/store/salaryStore";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { runTaxEngine, type CalculatorInputs } from "@/lib/engines/tax/taxEngine";
import { 
  generateSalaryStructure,
  type SalaryBreakdown, 
  type BenefitInput,
  type AdvancedDeductions
} from "@/lib/engines/tax/rules";

export function IncomeTaxClient() {
  const store = useSalaryStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromDashboard = searchParams.get("from") === "dashboard";

  // Strictly format in INR since Indian Income Tax slabs are in Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Basic States
  const [income, setIncome] = useState<number | "">(1200000);
  const [deductions, setDeductions] = useState<number | "">(150000);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [selectedRegime, setSelectedRegime] = useState<"auto" | "old" | "new">("auto");
  const [rentPaid, setRentPaid] = useState<number | "">(0);
  const [isMetro, setIsMetro] = useState(false);
  const [financialYear, setFinancialYear] = useState<"FY 2024-25" | "FY 2025-26" | "FY 2026-27">("FY 2025-26");

  // Pre-populate from Zustand store on mount if grossSalary exists
  useEffect(() => {
    if (store.grossSalary) {
      setIncome(store.grossSalary);
      setRentPaid(store.rentPaid || 0);
      setIsMetro(store.city === "metro");
      
      // Auto enable advanced mode since Dashboard profile contains advanced info
      setIsAdvanced(true);

      // Deductions
      setDeductionsAdvanced({
        ppf: store.sec80c.ppf,
        epf: store.sec80c.epf,
        elss: store.sec80c.elss,
        lifeInsurance: store.sec80c.lifeInsurance,
        taxSaverFd: store.sec80c.taxSaverFd,
        npsSelf: store.npsSelf,
        healthInsurance: store.sec80dHealthInsurance,
        homeLoanInterest: store.homeLoanInterest,
        educationLoan: store.educationLoan,
        donations: store.donations,
      });

      // Flexi
      setBenefitEmployerNps(store.flexiBenefits.employerNps.enabled);
      setBenefitEmployerNpsVal(store.flexiBenefits.employerNps.amount);
      setBenefitFoodCoupon(store.flexiBenefits.mealCard.enabled);
      setBenefitFoodCouponVal(store.flexiBenefits.mealCard.amount);
      setBenefitInternet(store.flexiBenefits.internet.enabled);
      setBenefitInternetVal(store.flexiBenefits.internet.amount);
      setBenefitMobile(store.flexiBenefits.mobile.enabled);
      setBenefitMobileVal(store.flexiBenefits.mobile.amount);
      setBenefitTelephone(store.flexiBenefits.telephone.enabled);
      setBenefitTelephoneVal(store.flexiBenefits.telephone.amount);
      setBenefitFuel(store.flexiBenefits.fuel.enabled);
      setBenefitFuelVal(store.flexiBenefits.fuel.amount);
      setBenefitDriver(store.flexiBenefits.driver.enabled);
      setBenefitDriverVal(store.flexiBenefits.driver.amount);
      setBenefitBooks(store.flexiBenefits.books.enabled);
      setBenefitBooksVal(store.flexiBenefits.books.amount);
      setBenefitProfMember(store.flexiBenefits.professionalMembership.enabled);
      setBenefitProfMemberVal(store.flexiBenefits.professionalMembership.amount);
      setBenefitGiftVoucher(store.flexiBenefits.giftVoucher.enabled);
      setBenefitGiftVoucherVal(store.flexiBenefits.giftVoucher.amount);
      setBenefitLta(store.flexiBenefits.lta.enabled);
      setBenefitLtaVal(store.flexiBenefits.lta.amount);
      setBenefitUniform(store.flexiBenefits.uniform.enabled);
      setBenefitUniformVal(store.flexiBenefits.uniform.amount);
      setBenefitNewspaper(store.flexiBenefits.newspaper.enabled);
      setBenefitNewspaperVal(store.flexiBenefits.newspaper.amount);
      setBenefitInternetEquip(store.flexiBenefits.internetEquipment.enabled);
      setBenefitInternetEquipVal(store.flexiBenefits.internetEquipment.amount);
      setVehicleBenefitType(store.flexiBenefits.vehicleType);
      setVehicleMaintenanceAmount(store.flexiBenefits.vehicleMaintenanceAmount);
    }
  }, [store.grossSalary]);

  // History State
  const [history, setHistory] = useState<any[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("taxCalcHistory");
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Advanced State – Salary Breakdown
  const [salaryBreakdown, setSalaryBreakdown] = useState<SalaryBreakdown>(generateSalaryStructure(1200000));

  // Advanced State – Flexi Benefits
  const [vehicleBenefitType, setVehicleBenefitType] = useState<"none" | "maintenance_small" | "maintenance_large" | "combined_small" | "combined_large">("none");
  const [vehicleMaintenanceAmount, setVehicleMaintenanceAmount] = useState<number>(0);

  // Monthly Benefits states
  const [benefitEmployerNps, setBenefitEmployerNps] = useState(false);
  const [benefitEmployerNpsVal, setBenefitEmployerNpsVal] = useState(6300);

  const [benefitFoodCoupon, setBenefitFoodCoupon] = useState(false);
  const [benefitFoodCouponVal, setBenefitFoodCouponVal] = useState(8800);

  const [benefitInternet, setBenefitInternet] = useState(false);
  const [benefitInternetVal, setBenefitInternetVal] = useState(1500);

  const [benefitMobile, setBenefitMobile] = useState(false);
  const [benefitMobileVal, setBenefitMobileVal] = useState(1000);

  const [benefitTelephone, setBenefitTelephone] = useState(false);
  const [benefitTelephoneVal, setBenefitTelephoneVal] = useState(1000);

  const [benefitFuel, setBenefitFuel] = useState(false);
  const [benefitFuelVal, setBenefitFuelVal] = useState(3000);

  const [benefitDriver, setBenefitDriver] = useState(false);
  const [benefitDriverVal, setBenefitDriverVal] = useState(10000);

  // Annual Benefits states
  const [benefitBooks, setBenefitBooks] = useState(false);
  const [benefitBooksVal, setBenefitBooksVal] = useState(10000);

  const [benefitProfMember, setBenefitProfMember] = useState(false);
  const [benefitProfMemberVal, setBenefitProfMemberVal] = useState(5000);

  const [benefitGiftVoucher, setBenefitGiftVoucher] = useState(false);
  const [benefitGiftVoucherVal, setBenefitGiftVoucherVal] = useState(5000);

  const [benefitLta, setBenefitLta] = useState(false);
  const [benefitLtaVal, setBenefitLtaVal] = useState(50000);

  const [benefitUniform, setBenefitUniform] = useState(false);
  const [benefitUniformVal, setBenefitUniformVal] = useState(6000);

  const [benefitNewspaper, setBenefitNewspaper] = useState(false);
  const [benefitNewspaperVal, setBenefitNewspaperVal] = useState(3000);

  const [benefitInternetEquip, setBenefitInternetEquip] = useState(false);
  const [benefitInternetEquipVal, setBenefitInternetEquipVal] = useState(15000);

  // Advanced State – Deductions
  const [deductionsAdvanced, setDeductionsAdvanced] = useState<AdvancedDeductions>({
    ppf: 50000,
    epf: 50000,
    elss: 20000,
    lifeInsurance: 30000,
    taxSaverFd: 0,
    npsSelf: 0,
    healthInsurance: 15000,
    homeLoanInterest: 0,
    educationLoan: 0,
    donations: 0
  });

  // Engine Results
  const [results, setResults] = useState<any>(null);
  const [doubleDippingWarning, setDoubleDippingWarning] = useState("");
  const [whatIfSalaryTarget, setWhatIfSalaryTarget] = useState<number | "">(1700000);
  const [whatIfResults, setWhatIfResults] = useState<any>(null);

  // Sync basic inputs to advanced when Gross Salary changes
  useEffect(() => {
    const gSalary = Number(income) || 0;
    const currentSum = 
      salaryBreakdown.basic + 
      salaryBreakdown.hra + 
      salaryBreakdown.specialAllowance + 
      salaryBreakdown.bonus + 
      salaryBreakdown.performanceBonus + 
      salaryBreakdown.employerPf + 
      salaryBreakdown.gratuity + 
      salaryBreakdown.otherAllowances;

    if (Math.abs(currentSum - gSalary) > 10) {
      setSalaryBreakdown(generateSalaryStructure(gSalary));
    }

    // Ensure What-If salary target is always logically higher than current salary
    setWhatIfSalaryTarget((prev) => {
      const currentTarget = Number(prev) || 0;
      if (currentTarget <= gSalary) {
        return gSalary + (gSalary >= 2000000 ? 1000000 : 500000);
      }
      return prev;
    });
  }, [income]);

  // Keep Employee PF dynamically matched to Employer PF
  useEffect(() => {
    setDeductionsAdvanced(prev => ({
      ...prev,
      epf: salaryBreakdown.employerPf
    }));
  }, [salaryBreakdown.employerPf]);

  // Keep NPS default value updated to 14% of basic salary unless manually changed
  useEffect(() => {
    if (!benefitEmployerNps) {
      setBenefitEmployerNpsVal(Math.round((salaryBreakdown.basic / 12) * 0.14));
    }
  }, [salaryBreakdown.basic, benefitEmployerNps]);

  // Run the tax engine dynamically on state changes
  useEffect(() => {
    const grossSalary = Number(income) || 0;

    // Build standard inputs
    const inputs: CalculatorInputs = {
      grossSalary,
      isAdvanced,
      rentPaid: Number(rentPaid) || 0,
      isMetro,
      salaryBreakdown,
      flexiBenefits: {
        vehicleBenefitType,
        vehicleMaintenanceAmount,
        employerNps: { enabled: benefitEmployerNps, monthlyAmount: benefitEmployerNpsVal },
        foodCoupon: { enabled: benefitFoodCoupon, monthlyAmount: benefitFoodCouponVal },
        internet: { enabled: benefitInternet, monthlyAmount: benefitInternetVal },
        mobile: { enabled: benefitMobile, monthlyAmount: benefitMobileVal },
        telephone: { enabled: benefitTelephone, monthlyAmount: benefitTelephoneVal },
        fuel: { enabled: benefitFuel, monthlyAmount: benefitFuelVal },
        driver: { enabled: benefitDriver, monthlyAmount: benefitDriverVal },
        books: { enabled: benefitBooks, declaredAmount: benefitBooksVal, monthlyAmount: 0 },
        professionalMembership: { enabled: benefitProfMember, declaredAmount: benefitProfMemberVal, monthlyAmount: 0 },
        giftVoucher: { enabled: benefitGiftVoucher, declaredAmount: benefitGiftVoucherVal, monthlyAmount: 0 },
        lta: { enabled: benefitLta, declaredAmount: benefitLtaVal, monthlyAmount: 0 },
        uniform: { enabled: benefitUniform, declaredAmount: benefitUniformVal, monthlyAmount: 0 },
        newspaper: { enabled: benefitNewspaper, declaredAmount: benefitNewspaperVal, monthlyAmount: 0 },
        internetEquipment: { enabled: benefitInternetEquip, declaredAmount: benefitInternetEquipVal, monthlyAmount: 0 },
      },
      deductions: isAdvanced ? deductionsAdvanced : {
        ppf: Number(deductions) || 0,
        epf: 0,
        elss: 0,
        lifeInsurance: 0,
        taxSaverFd: 0,
        npsSelf: 0,
        healthInsurance: 0,
        homeLoanInterest: 0,
        educationLoan: 0,
        donations: 0
      }
    };

    // Conflict checking: allowances pool validation to prevent double-dipping
    if (isAdvanced) {
      const allowancesPool = salaryBreakdown.specialAllowance + salaryBreakdown.otherAllowances + salaryBreakdown.hra;
      
      // Calculate claimed flexi benefits
      let claimedAnnual = 0;
      if (benefitEmployerNps) claimedAnnual += benefitEmployerNpsVal * 12;
      if (benefitFoodCoupon) claimedAnnual += benefitFoodCouponVal * 12;
      if (benefitInternet) claimedAnnual += benefitInternetVal * 12;
      if (benefitMobile) claimedAnnual += benefitMobileVal * 12;
      if (benefitTelephone) claimedAnnual += benefitTelephoneVal * 12;
      if (benefitFuel) claimedAnnual += benefitFuelVal * 12;
      if (benefitDriver) claimedAnnual += benefitDriverVal * 12;
      if (vehicleBenefitType !== "none") claimedAnnual += vehicleMaintenanceAmount * 12;
      if (benefitBooks) claimedAnnual += benefitBooksVal;
      if (benefitProfMember) claimedAnnual += benefitProfMemberVal;
      if (benefitGiftVoucher) claimedAnnual += benefitGiftVoucherVal;
      if (benefitLta) claimedAnnual += benefitLtaVal;
      if (benefitUniform) claimedAnnual += benefitUniformVal;
      if (benefitNewspaper) claimedAnnual += benefitNewspaperVal;
      if (benefitInternetEquip) claimedAnnual += benefitInternetEquipVal;

      if (claimedAnnual > allowancesPool) {
        setDoubleDippingWarning(
          `⚠️ Double-Dipping Conflict: Total flexi-benefit claims (${formatCurrency(claimedAnnual)}) exceed your available HRA, Special, and Other allowances pool (${formatCurrency(allowancesPool)}). Claims are capped at the pool limit.`
        );
        // Apply manual scaling/cap to exempt benefits
        const scaleFactor = allowancesPool / claimedAnnual;
        inputs.flexiBenefits.employerNps.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.foodCoupon.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.internet.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.mobile.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.telephone.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.fuel.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.driver.monthlyAmount *= scaleFactor;
        inputs.flexiBenefits.books.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.professionalMembership.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.giftVoucher.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.lta.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.uniform.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.newspaper.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.internetEquipment.declaredAmount! *= scaleFactor;
        inputs.flexiBenefits.vehicleMaintenanceAmount *= scaleFactor;
      } else {
        setDoubleDippingWarning("");
      }
    } else {
      setDoubleDippingWarning("");
    }

    const calculated = runTaxEngine(inputs);
    setResults(calculated);

    // Calculate exact What-If simulation using full engine
    const targetSalary = Number(whatIfSalaryTarget) || 0;
    if (targetSalary > grossSalary) {
      const whatIfInputs = JSON.parse(JSON.stringify(inputs));
      whatIfInputs.grossSalary = targetSalary;
      
      const ratio = targetSalary / grossSalary;
      if (!isAdvanced) {
        whatIfInputs.salaryBreakdown = generateSalaryStructure(targetSalary);
        if (whatIfInputs.flexiBenefits.employerNps.enabled) {
          whatIfInputs.flexiBenefits.employerNps.monthlyAmount = Math.round((whatIfInputs.salaryBreakdown.basic / 12) * 0.14);
        }
      } else {
        whatIfInputs.salaryBreakdown = {
          basic: (inputs.salaryBreakdown?.basic || 0) * ratio,
          hra: (inputs.salaryBreakdown?.hra || 0) * ratio,
          specialAllowance: (inputs.salaryBreakdown?.specialAllowance || 0) * ratio,
          bonus: (inputs.salaryBreakdown?.bonus || 0) * ratio,
          performanceBonus: (inputs.salaryBreakdown?.performanceBonus || 0) * ratio,
          employerPf: (inputs.salaryBreakdown?.employerPf || 0) * ratio,
          gratuity: (inputs.salaryBreakdown?.gratuity || 0) * ratio,
          otherAllowances: (inputs.salaryBreakdown?.otherAllowances || 0) * ratio
        };
        if (whatIfInputs.flexiBenefits.employerNps.enabled) {
          whatIfInputs.flexiBenefits.employerNps.monthlyAmount *= ratio;
        }
        whatIfInputs.deductions.epf *= ratio;
      }
      setWhatIfResults(runTaxEngine(whatIfInputs));
    } else {
      setWhatIfResults(null);
    }

    // Debounce saving history (only save if income > 300000 and is somewhat stable)
    const activeRegime = selectedRegime === "auto" ? calculated.recommendedRegime : selectedRegime;
    const historyEntry = {
      income: grossSalary,
      regime: activeRegime,
      tax: activeRegime === "old" ? calculated.oldRegime.totalTax : calculated.newRegime.totalTax,
      takeHome: activeRegime === "old" ? calculated.oldRegime.takeHomeSalary : calculated.newRegime.takeHomeSalary,
      timestamp: new Date().toISOString()
    };
    
    // Save to history (avoid consecutive duplicates of same income)
    setHistory(prev => {
      if (prev.length > 0 && prev[0].income === historyEntry.income) return prev;
      const newHistory = [historyEntry, ...prev].slice(0, 5);
      try { localStorage.setItem("taxCalcHistory", JSON.stringify(newHistory)); } catch(e) {}
      return newHistory;
    });

  }, [
    income,
    deductions,
    isAdvanced,
    salaryBreakdown,
    vehicleBenefitType,
    vehicleMaintenanceAmount,
    benefitEmployerNps,
    benefitEmployerNpsVal,
    benefitFoodCoupon,
    benefitFoodCouponVal,
    benefitInternet,
    benefitInternetVal,
    benefitMobile,
    benefitMobileVal,
    benefitTelephone,
    benefitTelephoneVal,
    benefitFuel,
    benefitFuelVal,
    benefitDriver,
    benefitDriverVal,
    benefitBooks,
    benefitBooksVal,
    benefitProfMember,
    benefitProfMemberVal,
    benefitGiftVoucher,
    benefitGiftVoucherVal,
    benefitLta,
    benefitLtaVal,
    benefitUniform,
    benefitUniformVal,
    benefitNewspaper,
    benefitNewspaperVal,
    benefitInternetEquip,
    benefitInternetEquipVal,
    deductionsAdvanced,
    rentPaid,
    isMetro,
    whatIfSalaryTarget
  ]);

  const handleReset = () => {
    setIncome(1200000);
    setDeductions(150000);
    setIsAdvanced(false);
    setVehicleBenefitType("none");
    setVehicleMaintenanceAmount(0);
    setBenefitEmployerNps(false);
    setBenefitEmployerNpsVal(4500);
    setBenefitFoodCoupon(false);
    setBenefitFoodCouponVal(8800);
    setBenefitInternet(false);
    setBenefitInternetVal(1500);
    setBenefitMobile(false);
    setBenefitMobileVal(1000);
    setBenefitTelephone(false);
    setBenefitTelephoneVal(1000);
    setBenefitFuel(false);
    setBenefitFuelVal(3000);
    setBenefitDriver(false);
    setBenefitDriverVal(10000);
    setBenefitBooks(false);
    setBenefitBooksVal(10000);
    setBenefitProfMember(false);
    setBenefitProfMemberVal(5000);
    setBenefitGiftVoucher(false);
    setBenefitGiftVoucherVal(5000);
    setBenefitLta(false);
    setBenefitLtaVal(50000);
    setBenefitUniform(false);
    setBenefitUniformVal(6000);
    setBenefitNewspaper(false);
    setBenefitNewspaperVal(3000);
    setBenefitInternetEquip(false);
    setBenefitInternetEquipVal(15000);
    setDeductionsAdvanced({
      ppf: 50000,
      epf: 50000,
      elss: 20000,
      lifeInsurance: 30000,
      taxSaverFd: 0,
      npsSelf: 0,
      healthInsurance: 15000,
      homeLoanInterest: 0,
      educationLoan: 0,
      donations: 0
    });
    setRentPaid(0);
    setIsMetro(false);
  };

  const generateEstStructure = () => {
    const gross = Number(income) || 0;
    setSalaryBreakdown(generateSalaryStructure(gross));
  };

  // Sync individual breakdown inputs back to Gross Salary total
  const handleBreakdownChange = (field: keyof SalaryBreakdown, value: number) => {
    const updated = { ...salaryBreakdown, [field]: value };
    setSalaryBreakdown(updated);
    const newTotal = 
      updated.basic + 
      updated.hra + 
      updated.specialAllowance + 
      updated.bonus + 
      updated.performanceBonus + 
      updated.employerPf + 
      updated.gratuity + 
      updated.otherAllowances;
    setIncome(newTotal);
  };

  // Sync individual deductions back to main deductions state
  const handleDeductionChange = (field: keyof AdvancedDeductions, value: number) => {
    const updated = { ...deductionsAdvanced, [field]: value };
    setDeductionsAdvanced(updated);
    
    // total 80C is capped at 1.5L
    const total80C = Math.min(150000, updated.ppf + updated.epf + updated.elss + updated.lifeInsurance + updated.taxSaverFd);
    const sumAll = total80C + Math.min(50000, updated.npsSelf) + Math.min(75000, updated.healthInsurance) + updated.homeLoanInterest + updated.educationLoan + updated.donations;
    setDeductions(sumAll);
  };

  // Print layout action
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Quick apply suggestion values
  const quickApply = (id: string, potentialSaved: number) => {
    setIsAdvanced(true);
    switch (id) {
      case "employerNps":
        setBenefitEmployerNps(true);
        const estBasic = salaryBreakdown.basic;
        setBenefitEmployerNpsVal(Math.round((estBasic / 12) * 0.14));
        break;
      case "foodCoupon":
        setBenefitFoodCoupon(true);
        setBenefitFoodCouponVal(8800);
        break;
      case "internet":
        setBenefitInternet(true);
        setBenefitInternetVal(1500);
        break;
      case "books":
        setBenefitBooks(true);
        setBenefitBooksVal(15000);
        break;
      case "vehicle":
        setVehicleBenefitType("maintenance_large");
        setVehicleMaintenanceAmount(7000);
        break;
    }
  };

  if (!results) return null;

  const { oldRegime, newRegime, oldFlexiSavings, newFlexiSavings, recommendedRegime, savings, suggestions, score, report } = results;

  const grossSalary = Number(income) || 0;
  const standardDeduction = 50000;
  const totalDeductionsOldRegime = Number(deductions) || 0;

  const maxTax = Math.max(oldRegime.totalTax, newRegime.totalTax, 1);
  const oldTaxPercent = (oldRegime.totalTax / maxTax) * 100;
  const newTaxPercent = (newRegime.totalTax / maxTax) * 100;

  const activeRegime = selectedRegime === "auto" 
    ? (recommendedRegime === "equal" ? "new" : recommendedRegime) 
    : selectedRegime;
  const activeRegimeData = activeRegime === "old" ? oldRegime : newRegime;
  const annualSavings = savings;
  const monthlySavings = Math.round(savings / 12);
  const flexiSavings = activeRegime === "old" ? oldFlexiSavings : newFlexiSavings;

  const handleUpdateDashboard = () => {
    store.updateField("grossSalary", Number(income) || 0);
    store.updateField("rentPaid", Number(rentPaid) || 0);
    store.updateField("city", isMetro ? "metro" : "non-metro");
    
    // Deductions
    store.updateField("sec80c.ppf", deductionsAdvanced.ppf);
    store.updateField("sec80c.epf", deductionsAdvanced.epf);
    store.updateField("sec80c.elss", deductionsAdvanced.elss);
    store.updateField("sec80c.lifeInsurance", deductionsAdvanced.lifeInsurance);
    store.updateField("sec80c.taxSaverFd", deductionsAdvanced.taxSaverFd);
    store.updateField("npsSelf", deductionsAdvanced.npsSelf);
    store.updateField("sec80dHealthInsurance", deductionsAdvanced.healthInsurance);
    store.updateField("homeLoanInterest", deductionsAdvanced.homeLoanInterest);
    store.updateField("educationLoan", deductionsAdvanced.educationLoan);
    store.updateField("donations", deductionsAdvanced.donations);
    
    // Flexi benefits
    store.updateField("flexiBenefits.employerNps.enabled", benefitEmployerNps);
    store.updateField("flexiBenefits.employerNps.amount", benefitEmployerNpsVal);
    store.updateField("flexiBenefits.mealCard.enabled", benefitFoodCoupon);
    store.updateField("flexiBenefits.mealCard.amount", benefitFoodCouponVal);
    store.updateField("flexiBenefits.internet.enabled", benefitInternet);
    store.updateField("flexiBenefits.internet.amount", benefitInternetVal);
    store.updateField("flexiBenefits.mobile.enabled", benefitMobile);
    store.updateField("flexiBenefits.mobile.amount", benefitMobileVal);
    store.updateField("flexiBenefits.telephone.enabled", benefitTelephone);
    store.updateField("flexiBenefits.telephone.amount", benefitTelephoneVal);
    store.updateField("flexiBenefits.fuel.enabled", benefitFuel);
    store.updateField("flexiBenefits.fuel.amount", benefitFuelVal);
    store.updateField("flexiBenefits.driver.enabled", benefitDriver);
    store.updateField("flexiBenefits.driver.amount", benefitDriverVal);
    store.updateField("flexiBenefits.books.enabled", benefitBooks);
    store.updateField("flexiBenefits.books.amount", benefitBooksVal);
    store.updateField("flexiBenefits.professionalMembership.enabled", benefitProfMember);
    store.updateField("flexiBenefits.professionalMembership.amount", benefitProfMemberVal);
    store.updateField("flexiBenefits.giftVoucher.enabled", benefitGiftVoucher);
    store.updateField("flexiBenefits.giftVoucher.amount", benefitGiftVoucherVal);
    store.updateField("flexiBenefits.lta.enabled", benefitLta);
    store.updateField("flexiBenefits.lta.amount", benefitLtaVal);
    store.updateField("flexiBenefits.uniform.enabled", benefitUniform);
    store.updateField("flexiBenefits.uniform.amount", benefitUniformVal);
    store.updateField("flexiBenefits.newspaper.enabled", benefitNewspaper);
    store.updateField("flexiBenefits.newspaper.amount", benefitNewspaperVal);
    store.updateField("flexiBenefits.internetEquipment.enabled", benefitInternetEquip);
    store.updateField("flexiBenefits.internetEquipment.amount", benefitInternetEquipVal);
    store.updateField("flexiBenefits.vehicleType", vehicleBenefitType);
    store.updateField("flexiBenefits.vehicleMaintenanceAmount", vehicleMaintenanceAmount);

    router.push("/dashboard");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {isFromDashboard && (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print mb-4">
          <div className="text-sm">
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Dashboard</Link>
            <span className="mx-2 text-muted-foreground font-mono">&gt;</span>
            <span className="font-semibold text-foreground">Income Tax Calculator</span>
            <span className="ml-2.5 text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Editing Dashboard Profile</span>
          </div>
        </div>
      )}
      {/* Header Info */}
      <div className="flex flex-col gap-3 border-b border-border pb-5 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Income Tax Calculator & Salary Optimizer
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value as any)}
              className="text-xs font-semibold py-1.5 px-2 rounded-md border border-border bg-card text-foreground cursor-pointer focus:outline-none"
            >
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2026-27">FY 2026-27</option>
            </select>
            
            <button
              onClick={() => {
                const url = window.location.href.split('?')[0] + `?salary=${income}`;
                navigator.clipboard.writeText(url);
                alert("Link copied with your salary!");
              }}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
              title="Copy Link"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <button
              onClick={() => {
                const text = `I just calculated my taxes for a ₹${(Number(income)/100000).toFixed(2)}L salary! Take-home is ${formatCurrency(activeRegimeData.takeHomeSalary)}. Check it out at ApexToolHub.`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
              title="Share on WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </button>

            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            {isFromDashboard && (
              <>
                <button
                  onClick={handleUpdateDashboard}
                  className="text-xs flex items-center gap-1.5 bg-foreground text-background font-bold transition-all cursor-pointer py-1.5 px-4 rounded-md hover:opacity-90 min-h-[36px]"
                >
                  Update Dashboard Profile
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground transition-colors cursor-pointer py-1.5 px-3 rounded-md border border-border bg-card hover:bg-muted/10 min-h-[36px]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-muted">
          Estimate your taxes and find salary structure adjustments to save taxes. Complete client-side tax computation under {financialYear}.
        </p>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 space-y-6 no-print">
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 border-b border-border/60 pb-3">
              <Calculator className="h-4.5 w-4.5 text-zinc-500" />
              Quick Tax Calculator
            </h2>

            {/* Calculator History */}
            {history.length > 0 && (
              <div className="flex flex-col gap-1.5 border-b border-border/60 pb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1">
                  <History className="h-3 w-3" /> Recent Calculations
                </span>
                <div className="flex flex-wrap gap-2">
                  {history.map((h, i) => (
                    <button 
                      key={i} 
                      onClick={() => setIncome(h.income)}
                      className="text-[10px] bg-muted/20 hover:bg-muted/40 border border-border px-2 py-1 rounded text-muted-foreground font-mono transition-colors"
                      title={`Calculated on ${new Date(h.timestamp).toLocaleDateString()}`}
                    >
                      {formatCurrency(h.income)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gross Annual Salary */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground">Gross Annual Salary (CTC)</label>
                <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                  <span className="text-muted text-sm mr-1">₹</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : "")}
                    className="w-28 text-right bg-transparent text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="300000"
                max="10000000"
                step="50000"
                value={Number(income) || 0}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
              />
              <div className="flex justify-between text-[10px] text-muted mb-2">
                <span>₹3L</span>
                <span>₹1Cr</span>
              </div>
              
              {/* Live Metrics Strip */}
              <div className="flex justify-between items-center border border-border bg-muted/10 p-2.5 rounded-lg text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase">Est. Tax</span>
                  <span className="font-mono font-semibold text-rose-500 dark:text-rose-400">{formatCurrency(activeRegime === "old" ? oldRegime.totalTax : newRegime.totalTax)}</span>
                </div>
                <div className="flex flex-col border-l border-r border-border px-3 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase">Take Home</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(activeRegime === "old" ? oldRegime.takeHomeSalary : newRegime.takeHomeSalary)}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-muted-foreground uppercase">Effective Rate</span>
                  <span className="font-mono font-semibold text-foreground">{((activeRegime === "old" ? oldRegime.totalTax : newRegime.totalTax) / (Number(income) || 1) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Simple Deductions slider (Only applies to Old Regime) */}
            {!isAdvanced && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Total Deductions (80C, HRA, etc.)</label>
                  <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                    <span className="text-muted text-sm mr-1">₹</span>
                    <input
                      type="number"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value ? Number(e.target.value) : "")}
                      className="w-24 text-right bg-transparent text-sm font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={Number(deductions) || 0}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
                />
                <p className="text-xs text-muted">Standard deduction of ₹50,000 is automatically applied to both regimes.</p>
              </div>
            )}

            {/* Collapsible Advanced Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAdvanced(!isAdvanced)}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/10 transition-colors text-sm font-bold text-foreground cursor-pointer"
              >
                <span>Advanced Tax Optimization</span>
                {isAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Conflict checks warning */}
            {doubleDippingWarning && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <p className="leading-normal">{doubleDippingWarning}</p>
              </div>
            )}
          </div>

          {/* Collapsible Advanced Sections */}
          {isAdvanced && (
            <div className="space-y-6 animate-in slide-in-from-top duration-300">
              
              {/* Section 1: Salary Breakdown */}
              <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-border/60 pb-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-zinc-500" />
                    Salary Breakdown
                  </h3>
                  <button
                    onClick={generateEstStructure}
                    className="text-[11px] py-1 px-2 border border-border rounded bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Generate Typical Structure
                  </button>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex w-full h-3 rounded-full overflow-hidden bg-muted">
                    <div style={{ width: `${(salaryBreakdown.basic / (Number(income) || 1)) * 100}%` }} className="bg-blue-500 dark:bg-blue-600" title="Basic"></div>
                    <div style={{ width: `${(salaryBreakdown.hra / (Number(income) || 1)) * 100}%` }} className="bg-emerald-500 dark:bg-emerald-600" title="HRA"></div>
                    <div style={{ width: `${(salaryBreakdown.specialAllowance / (Number(income) || 1)) * 100}%` }} className="bg-amber-500 dark:bg-amber-600" title="Special"></div>
                    <div style={{ width: `${((salaryBreakdown.bonus + salaryBreakdown.performanceBonus) / (Number(income) || 1)) * 100}%` }} className="bg-purple-500 dark:bg-purple-600" title="Bonus"></div>
                    <div style={{ width: `${(salaryBreakdown.employerPf / (Number(income) || 1)) * 100}%` }} className="bg-rose-500 dark:bg-rose-600" title="PF"></div>
                    <div style={{ width: `${((salaryBreakdown.gratuity + salaryBreakdown.otherAllowances) / (Number(income) || 1)) * 100}%` }} className="bg-zinc-400 dark:bg-zinc-500" title="Other"></div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground mt-2 font-medium">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-600"></div> Basic</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-600"></div> HRA</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-600"></div> Special</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-600"></div> Bonus</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-600"></div> PF</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500"></div> Other</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(salaryBreakdown).map(([key, val]) => {
                    const labelMap: Record<string, string> = {
                      basic: "Basic Salary (Annual)",
                      hra: "HRA (House Rent Allowance) (Annual)",
                      specialAllowance: "Special Allowance (Annual)",
                      bonus: "Annual Bonus",
                      performanceBonus: "Performance Bonus (Annual)",
                      employerPf: "Employer PF Contribution (Annual)",
                      gratuity: "Estimated Gratuity contribution (Annual)",
                      otherAllowances: "Other Allowances (Annual)"
                    };
                    return (
                      <div key={key} className="space-y-1 text-left">
                        <label className="text-xs font-semibold text-muted">{labelMap[key] || key}</label>
                        <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                          <span className="text-muted-foreground text-xs mr-1">₹</span>
                          <input
                            type="number"
                            value={val}
                            onChange={(e) => handleBreakdownChange(key as keyof SalaryBreakdown, Number(e.target.value) || 0)}
                            className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Rent Paid & Metro Toggle */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-muted">Annual Rent Paid (for HRA Exemption)</label>
                    <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                      <span className="text-muted-foreground text-xs mr-1">₹</span>
                      <input
                        type="number"
                        value={rentPaid}
                        onChange={(e) => setRentPaid(e.target.value ? Number(e.target.value) : "")}
                        className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                        placeholder="Enter annual rent paid"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/5">
                    <label className="text-xs font-semibold text-foreground cursor-pointer select-none">
                      Living in a Metro City?
                      <span className="text-[10px] text-muted block font-normal">Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, Ahmedabad (50% HRA cap)</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={isMetro}
                      onChange={(e) => setIsMetro(e.target.checked)}
                      className="rounded border-border focus:ring-zinc-700 h-4 w-4 shrink-0"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Employer Salary Benefits */}
              <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6 text-left">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
                  <TrendingDown className="h-4 w-4 text-zinc-500" />
                  Employer Salary Benefits (Flexi-Basket)
                </h3>

                {/* Category 1: Vehicle Benefits */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">Vehicle Benefits</h4>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-foreground">Select Car Allowance Scheme</label>
                    <select
                      value={vehicleBenefitType}
                      onChange={(e) => {
                        const type = e.target.value as any;
                        setVehicleBenefitType(type);
                        if (type === "none") setVehicleMaintenanceAmount(0);
                        else if (type === "maintenance_small") setVehicleMaintenanceAmount(5000);
                        else if (type === "maintenance_large") setVehicleMaintenanceAmount(7000);
                        else if (type === "combined_small") setVehicleMaintenanceAmount(8000);
                        else if (type === "combined_large") setVehicleMaintenanceAmount(10000);
                      }}
                      className="w-full p-2 text-xs border border-border rounded bg-background text-foreground"
                    >
                      <option value="none">No vehicle benefits claimed</option>
                      <option value="maintenance_small">Vehicle Maintenance Less Than 1600CC (FBP component)</option>
                      <option value="maintenance_large">Vehicle Maintenance More Than 1600CC (FBP component)</option>
                      <option value="combined_small">VM Less Than 1600CC Plus Driver Salary (FBP component)</option>
                      <option value="combined_large">VM More Than 1600CC Plus Driver Salary (FBP component)</option>
                    </select>

                    {vehicleBenefitType !== "none" && (
                      <div className="flex gap-4 p-3 bg-muted/10 border border-border/60 rounded-lg animate-in slide-in-from-top-2">
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[11px] font-semibold text-muted">Monthly Maintenance Claim (₹)</label>
                          <input
                            type="number"
                            value={vehicleMaintenanceAmount}
                            onChange={(e) => setVehicleMaintenanceAmount(Number(e.target.value) || 0)}
                            className="w-full p-1.5 text-xs font-mono border border-border rounded bg-background text-foreground text-right"
                          />
                        </div>
                        <div className="flex-1 text-[10px] text-muted-foreground leading-relaxed">
                          <p className="font-semibold text-foreground">Exemption Rule:</p>
                          <p>Capped at ₹{vehicleBenefitType === "combined_large" ? "10,000" : vehicleBenefitType === "combined_small" ? "8,000" : vehicleBenefitType === "maintenance_large" ? "7,000" : "5,000"}/month.</p>
                          <p className="mt-1 text-red-500 dark:text-red-400">Only allowed in Old Tax Regime.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category 2: Monthly Benefits */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted border-t border-border/40 pt-3">Monthly Reimbursements</h4>
                  
                  {/* NPS, Meal, Internet, Telephone, Mobile, Fuel, Driver */}
                  <div className="space-y-3.5">
                    {[
                      { id: "employerNps", label: "Employer NPS Contribution (80CCD(2))", enabled: benefitEmployerNps, setEnabled: setBenefitEmployerNps, val: benefitEmployerNpsVal, setVal: setBenefitEmployerNpsVal, tooltip: "Tax-free up to 14% of Basic salary contributed by employer to NPS.", proof: "Employer NPS report.", regimeInfo: "Both Regimes" },
                      { id: "foodCoupon", label: "Food Coupons (Meal Card)", enabled: benefitFoodCoupon, setEnabled: setBenefitFoodCoupon, val: benefitFoodCouponVal, setVal: setBenefitFoodCouponVal, tooltip: "Tax-free meal cards (e.g. Pluxee/Sodexo) up to ₹8,800/month (₹200/meal, up to ₹1,05,600/year).", proof: "None (declared).", regimeInfo: "Both Regimes" },
                      { id: "internet", label: "Internet & Broadband Reimbursement", enabled: benefitInternet, setEnabled: setBenefitInternet, val: benefitInternetVal, setVal: setBenefitInternetVal, tooltip: "Exempt based on actual Wi-Fi broadband bills.", proof: "Internet Bills.", regimeInfo: "Both Regimes" },
                      { id: "mobile", label: "Mobile Device Reimbursement", enabled: benefitMobile, setEnabled: setBenefitMobile, val: benefitMobileVal, setVal: setBenefitMobileVal, tooltip: "Exempt for mobile device bill reimbursements up to ₹1,500/month.", proof: "Mobile bill statement.", regimeInfo: "Both Regimes" },
                      { id: "telephone", label: "Telephone (Landline) Reimbursement", enabled: benefitTelephone, setEnabled: setBenefitTelephone, val: benefitTelephoneVal, setVal: setBenefitTelephoneVal, tooltip: "Exempt for telephone/landline bills.", proof: "Telephone bills.", regimeInfo: "Both Regimes" },
                      { id: "fuel", label: "Fuel Expenses Reimbursement", enabled: benefitFuel, setEnabled: setBenefitFuel, val: benefitFuelVal, setVal: setBenefitFuelVal, tooltip: "Exempt for actual fuel purchases up to ₹5,000/month for mixed-use.", proof: "Fuel bills.", regimeInfo: "Both Regimes" },
                      { id: "driver", label: "Driver Salary Reimbursement", enabled: benefitDriver, setEnabled: setBenefitDriver, val: benefitDriverVal, setVal: setBenefitDriverVal, tooltip: "Exempt for driver salary reimbursements up to ₹15,000/month.", proof: "Signed driver payment receipt.", regimeInfo: "Both Regimes" }
                    ].map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 p-2.5 rounded-lg border border-border/40 hover:bg-muted/5 transition-all">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={(e) => item.setEnabled(e.target.checked)}
                              className="rounded border-border focus:ring-zinc-700"
                            />
                            {item.label}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${item.regimeInfo.includes("Both") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>
                              {item.regimeInfo}
                            </span>
                            <div className="group relative">
                              <HelpCircle className="h-3.5 w-3.5 text-zinc-400 hover:text-foreground cursor-pointer" />
                              <div className="pointer-events-none absolute bottom-full right-0 mb-2 rounded-md bg-zinc-950 border border-zinc-800 p-2 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity w-44 z-50">
                                <p>{item.tooltip}</p>
                                <p className="mt-1 font-semibold text-foreground">Proof Required: {item.proof}</p>
                                <p className="mt-0.5 text-[9px] text-amber-500/90 italic">Subject to your company's flexi-benefit policy and proof of expenditure.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {item.enabled && (
                          <div className="flex items-center justify-between gap-4 pl-6 animate-in zoom-in-95 duration-150">
                            <span className="text-[11px] text-muted">Claimed Monthly Amount (₹)</span>
                            <input
                              type="number"
                              value={item.val}
                              onChange={(e) => item.setVal(Number(e.target.value) || 0)}
                              className="w-24 p-1 text-xs border border-border rounded bg-background text-foreground font-mono text-right"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category 3: Annual Benefits */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted border-t border-border/40 pt-3">Annual Allowances</h4>
                  
                  <div className="space-y-3.5">
                    {[
                      { id: "books", label: "Books & Periodicals", enabled: benefitBooks, setEnabled: setBenefitBooks, val: benefitBooksVal, setVal: setBenefitBooksVal, tooltip: "Reimbursement of technical books and periodicals up to ₹15,000/year.", proof: "Technical book bills.", regimeInfo: "Both Regimes" },
                      { id: "professionalMembership", label: "Professional Membership", enabled: benefitProfMember, setEnabled: setBenefitProfMember, val: benefitProfMemberVal, setVal: setBenefitProfMemberVal, tooltip: "Reimbursement for memberships in professional networks up to ₹10,000/year.", proof: "Membership receipts.", regimeInfo: "Both Regimes" },
                      { id: "uniform", label: "Uniform Allowance", enabled: benefitUniform, setEnabled: setBenefitUniform, val: benefitUniformVal, setVal: setBenefitUniformVal, tooltip: "Exempt for purchasing work uniforms up to ₹12,000/year.", proof: "Purchase receipts.", regimeInfo: "Both Regimes" },
                      { id: "lta", label: "Leave Travel Allowance (LTA)", enabled: benefitLta, setEnabled: setBenefitLta, val: benefitLtaVal, setVal: setBenefitLtaVal, tooltip: "Exempt travel tickets capped at ₹1,00,000/year. Only allowed in Old regime.", proof: "Travel boarding passes & tickets.", regimeInfo: "Old Regime Only" },
                      { id: "giftVoucher", label: "Gift Voucher / Vouchers", enabled: benefitGiftVoucher, setEnabled: setBenefitGiftVoucher, val: benefitGiftVoucherVal, setVal: setBenefitGiftVoucherVal, tooltip: "Tax-free up to ₹5,000/year for gifts in kind from employer. Only allowed in Old regime.", proof: "Voucher details ledger.", regimeInfo: "Old Regime Only" },
                      { id: "newspaper", label: "Newspaper Reimbursement", enabled: benefitNewspaper, setEnabled: setBenefitNewspaper, val: benefitNewspaperVal, setVal: setBenefitNewspaperVal, tooltip: "Exempt up to ₹5,000/year for newspapers. Only allowed in Old regime.", proof: "Newspaper vendor bills.", regimeInfo: "Old Regime Only" },
                      { id: "internetEquipment", label: "Internet Hardware Assets", enabled: benefitInternetEquip, setEnabled: setBenefitInternetEquip, val: benefitInternetEquipVal, setVal: setBenefitInternetEquipVal, tooltip: "Hardware assets provided for work up to ₹25,000/year. Only allowed in Old regime.", proof: "Equipment cash memos.", regimeInfo: "Old Regime Only" }
                    ].map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 p-2.5 rounded-lg border border-border/40 hover:bg-muted/5 transition-all">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={(e) => item.setEnabled(e.target.checked)}
                              className="rounded border-border focus:ring-zinc-700"
                            />
                            {item.label}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${item.regimeInfo.includes("Both") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>
                              {item.regimeInfo}
                            </span>
                            <div className="group relative">
                              <HelpCircle className="h-3.5 w-3.5 text-zinc-400 hover:text-foreground cursor-pointer" />
                              <div className="pointer-events-none absolute bottom-full right-0 mb-2 rounded-md bg-zinc-950 border border-zinc-800 p-2 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity w-44 z-50">
                                <p>{item.tooltip}</p>
                                <p className="mt-1 font-semibold text-foreground">Proof Required: {item.proof}</p>
                                <p className="mt-0.5 text-[9px] text-amber-500/90 italic">Subject to your company's flexi-benefit policy and proof of expenditure.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {item.enabled && (
                          <div className="flex items-center justify-between gap-4 pl-6 animate-in zoom-in-95 duration-150">
                            <span className="text-[11px] text-muted">Claimed Annual Amount (₹)</span>
                            <input
                              type="number"
                              value={item.val}
                              onChange={(e) => item.setVal(Number(e.target.value) || 0)}
                              className="w-24 p-1 text-xs border border-border rounded bg-background text-foreground font-mono text-right"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Tax Deductions */}
              <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6 text-left">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
                  <Calculator className="h-4 w-4 text-zinc-500" />
                  Tax Deductions (Old Regime Slabs)
                </h3>

                {/* 80C Deductions */}
                <div className="space-y-3.5 border-b border-border/40 pb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">Section 80C (EPF, PPF, Insurance etc.)</h4>
                    <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 border border-border rounded py-0.5 px-2 text-foreground/80 font-mono">
                      Capped at ₹1,50,000
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { key: "ppf", label: "PPF (Public Provident Fund)" },
                      { key: "epf", label: "EPF (Employee PF)" },
                      { key: "elss", label: "ELSS Mutual Funds" },
                      { key: "lifeInsurance", label: "Life Insurance Premiums" },
                      { key: "taxSaverFd", label: "Tax Saver Fixed Deposits" }
                    ].map((ded) => (
                      <div key={ded.key} className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted">{ded.label}</label>
                        <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                          <span className="text-muted-foreground text-xs mr-1">₹</span>
                          <input
                            type="number"
                            value={deductionsAdvanced[ded.key as keyof AdvancedDeductions]}
                            onChange={(e) => handleDeductionChange(ded.key as keyof AdvancedDeductions, Number(e.target.value) || 0)}
                            className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Remaining 80C Eligibility info */}
                  {(() => {
                    const current80C = deductionsAdvanced.ppf + deductionsAdvanced.epf + deductionsAdvanced.elss + deductionsAdvanced.lifeInsurance + deductionsAdvanced.taxSaverFd;
                    const remaining = Math.max(0, 150000 - current80C);
                    return (
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Current 80C claims: {formatCurrency(current80C)}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {remaining > 0 ? `Remaining 80C Limit: ${formatCurrency(remaining)}` : "Max 80C Limit Reached! ✓"}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Other Deductions */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted">Other Sections</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* NPS Self */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted flex items-center justify-between">
                        <span>Section 80CCD(1B) - NPS</span>
                        <span className="text-[9px] font-semibold opacity-75">(Max ₹50,000)</span>
                      </label>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <span className="text-muted-foreground text-xs mr-1">₹</span>
                        <input
                          type="number"
                          value={deductionsAdvanced.npsSelf}
                          onChange={(e) => handleDeductionChange("npsSelf", Number(e.target.value) || 0)}
                          className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Health Insurance */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted flex items-center justify-between">
                        <span>Section 80D - Health Insurance</span>
                        <span className="text-[9px] font-semibold opacity-75">(Max ₹75,000)</span>
                      </label>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <span className="text-muted-foreground text-xs mr-1">₹</span>
                        <input
                          type="number"
                          value={deductionsAdvanced.healthInsurance}
                          onChange={(e) => handleDeductionChange("healthInsurance", Number(e.target.value) || 0)}
                          className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Home Loan Interest */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted flex items-center justify-between">
                        <span>Section 24b - Home Loan Interest</span>
                        <span className="text-[9px] font-semibold opacity-75">(Max ₹2,00,000)</span>
                      </label>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <span className="text-muted-foreground text-xs mr-1">₹</span>
                        <input
                          type="number"
                          value={deductionsAdvanced.homeLoanInterest}
                          onChange={(e) => handleDeductionChange("homeLoanInterest", Number(e.target.value) || 0)}
                          className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Education Loan Interest */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted">Section 80E - Education Loan Interest</label>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <span className="text-muted-foreground text-xs mr-1">₹</span>
                        <input
                          type="number"
                          value={deductionsAdvanced.educationLoan}
                          onChange={(e) => handleDeductionChange("educationLoan", Number(e.target.value) || 0)}
                          className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Donations */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-muted">Section 80G - Tax Deductible Donations</label>
                      <div className="flex items-center border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground">
                        <span className="text-muted-foreground text-xs mr-1">₹</span>
                        <input
                          type="number"
                          value={deductionsAdvanced.donations}
                          onChange={(e) => handleDeductionChange("donations", Number(e.target.value) || 0)}
                          className="w-full text-right bg-transparent text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right Output Dashboard Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Section 4: Results Dashboard */}
          <div className="border border-border bg-card rounded-xl p-5 shadow-sm space-y-6 flex flex-col h-full print:border-none print:shadow-none">
            <div className="flex justify-between items-center border-b border-border/60 pb-3 no-print">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Calculator className="h-4.5 w-4.5 text-zinc-500" />
                Tax Optimization Dashboard
              </h2>
              <button
                onClick={handlePrint}
                className="text-xs flex items-center gap-1.5 text-muted hover:text-foreground border border-border bg-card hover:bg-muted/10 py-1.5 px-3 rounded cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print/PDF Report
              </button>
            </div>

            {/* Print Header banner */}
            <div className="hidden print:block border-b border-zinc-300 pb-4 text-left">
              <h1 className="text-2xl font-bold">ApexToolHub Tax Optimization Report</h1>
              <p className="text-xs text-zinc-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {/* Main recommendation banner */}
            <div className={`p-4 rounded-lg border flex items-start gap-3 text-left ${
              recommendedRegime === "new" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" :
              recommendedRegime === "old" ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400" :
              "bg-muted/20 border-border text-foreground"
            }`}>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-base">
                  {recommendedRegime === "new" && "New Tax Regime is recommended!"}
                  {recommendedRegime === "old" && "Old Tax Regime is recommended!"}
                  {recommendedRegime === "equal" && "Both regimes result in the same tax"}
                </h4>
                {annualSavings > 0 && (
                  <p className="text-xs opacity-90 leading-relaxed">
                    You save <strong>{formatCurrency(annualSavings)}</strong> annually (or <strong>{formatCurrency(monthlySavings)}/month</strong>) by choosing the **{recommendedRegime === "new" ? "New" : "Old"} Tax Regime**.
                  </p>
                )}
              </div>
            </div>

            {/* Regime Selector Toggle */}
            <div className="flex items-center justify-between gap-3 p-1 bg-muted/20 border border-border rounded-lg no-print">
              <span className="text-xs font-semibold text-muted-foreground pl-2">View details for:</span>
              <div className="flex bg-zinc-900/40 dark:bg-zinc-950/40 p-0.5 rounded-md border border-border/40">
                {[
                  { id: "auto", label: "Recommended" },
                  { id: "old", label: "Old Regime" },
                  { id: "new", label: "New Regime" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedRegime(tab.id as any)}
                    className={`text-[11px] font-bold py-1 px-2.5 rounded transition-all cursor-pointer ${
                      selectedRegime === tab.id
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "auto" && recommendedRegime !== "equal" && (
                      <span className="ml-1 text-[9px] opacity-75 font-normal">
                        ({recommendedRegime === "new" ? "New" : "Old"})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Dashboard Grid */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="border border-border/60 bg-muted/5 rounded-lg p-3">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Annual Tax Liability</span>
                <p className="text-lg font-extrabold font-mono mt-1 text-foreground">
                  {formatCurrency(activeRegimeData.totalTax)}
                </p>
                <span className="text-[9px] text-muted block mt-0.5">Includes surcharge &amp; cess</span>
              </div>
              <div className="border border-border/60 bg-muted/5 rounded-lg p-3">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Monthly TDS</span>
                <p className="text-lg font-extrabold font-mono mt-1 text-foreground">
                  {formatCurrency(activeRegimeData.monthlyTds)}
                </p>
                <span className="text-[9px] text-muted block mt-0.5">Estimated salary deduction</span>
              </div>
              <div className="border border-border/60 bg-muted/5 rounded-lg p-3">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Net Take-Home Salary</span>
                <p className="text-lg font-extrabold font-mono mt-1 text-foreground">
                  {formatCurrency(activeRegimeData.takeHomeSalary)}
                </p>
                <span className="text-[9px] text-muted block mt-0.5">Annual net cash in hand</span>
              </div>
              <div className="border border-border/60 bg-muted/5 rounded-lg p-3">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Effective Tax Rate</span>
                <p className="text-lg font-extrabold font-mono mt-1 text-foreground">
                  {activeRegimeData.effectiveTaxRate}%
                </p>
                <span className="text-[9px] text-muted block mt-0.5">Tax paid over CTC</span>
              </div>
            </div>

            {/* === TAX WATERFALL TIMELINE === */}
            {(() => {
              const stdDed = activeRegime === "new" ? 75000 : 50000;
              const hraExempt = activeRegime === "old" ? (results.hraExemption || 0) : 0;
              const flexiExempt = activeRegimeData.totalBenefitsExempt;
              // Old regime deductions breakdown
              const sec80C = Math.min(150000, (deductionsAdvanced.ppf || 0) + (deductionsAdvanced.epf || 0) + (deductionsAdvanced.elss || 0) + (deductionsAdvanced.lifeInsurance || 0) + (deductionsAdvanced.taxSaverFd || 0));
              const sec80D = activeRegime === "old" ? Math.min(75000, deductionsAdvanced.healthInsurance || 0) : 0;
              const sec24b = activeRegime === "old" ? Math.min(200000, deductionsAdvanced.homeLoanInterest || 0) : 0;
              const secNps = activeRegime === "old" ? Math.min(50000, deductionsAdvanced.npsSelf || 0) : 0;
              const secOther = activeRegime === "old" ? ((deductionsAdvanced.educationLoan || 0) + (deductionsAdvanced.donations || 0)) : 0;

              const steps: { label: string; amount: number; type: "neutral" | "deduct" | "add" | "result" | "finalresult" }[] = [
                { label: "Gross Salary (CTC)", amount: grossSalary, type: "neutral" },
                ...(flexiExempt > 0 ? [{ label: "Employer Flexi Benefits", amount: -flexiExempt, type: "deduct" as const }] : []),
                ...(hraExempt > 0 ? [{ label: "HRA Exemption (Sec 10)", amount: -hraExempt, type: "deduct" as const }] : []),
                { label: `Standard Deduction (${activeRegime === "new" ? "₹75K" : "₹50K"})`, amount: -stdDed, type: "deduct" },
                ...(sec80C > 0 && activeRegime === "old" ? [{ label: "Section 80C (PPF/ELSS)", amount: -sec80C, type: "deduct" as const }] : []),
                ...(sec80D > 0 ? [{ label: "Section 80D (Health Ins.)", amount: -sec80D, type: "deduct" as const }] : []),
                ...(secNps > 0 ? [{ label: "Sec 80CCD(1B) NPS Self", amount: -secNps, type: "deduct" as const }] : []),
                ...(sec24b > 0 ? [{ label: "Section 24b (Home Loan)", amount: -sec24b, type: "deduct" as const }] : []),
                ...(secOther > 0 ? [{ label: "Other Deductions (80E/80G)", amount: -secOther, type: "deduct" as const }] : []),
                { label: "Net Taxable Income", amount: activeRegimeData.taxableIncome, type: "result" },
                { label: "Income Tax (after 87A rebate)", amount: activeRegimeData.baseTax, type: "add" },
                ...(activeRegimeData.surcharge > 0 ? [{ label: "Surcharge", amount: activeRegimeData.surcharge, type: "add" as const }] : []),
                { label: "Health & Education Cess (4%)", amount: activeRegimeData.cess, type: "add" },
                { label: "Final Tax Payable", amount: activeRegimeData.totalTax, type: "finalresult" },
              ];

              return (
                <div className="border border-border rounded-xl overflow-hidden text-left no-print animate-in fade-in duration-300">
                  <div className="bg-muted/10 border-b border-border px-4 py-2.5 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      Tax Breakdown Timeline
                    </h3>
                    <span className="text-[10px] text-muted capitalize">{activeRegime} Regime</span>
                  </div>
                  <div className="divide-y divide-border/40">
                    {steps.map((step, i) => (
                      <div key={i} className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                        step.type === "finalresult" ? "bg-foreground/5 border-t-2 border-foreground/20" :
                        step.type === "result" ? "bg-emerald-500/5" :
                        step.type === "deduct" ? "hover:bg-emerald-500/5" :
                        step.type === "add" ? "hover:bg-red-500/5" : ""
                      }`}>
                        <div className="flex items-center gap-2">
                          {step.type === "deduct" && <span className="text-emerald-500 text-[10px] font-black shrink-0">−</span>}
                          {step.type === "add" && <span className="text-red-500 text-[10px] font-black shrink-0">+</span>}
                          {(step.type === "result" || step.type === "finalresult" || step.type === "neutral") && <ChevronRight className="h-3 w-3 text-muted shrink-0" />}
                          <span className={`text-xs ${
                            step.type === "finalresult" ? "font-extrabold text-foreground" :
                            step.type === "result" ? "font-bold text-emerald-700 dark:text-emerald-400" :
                            step.type === "neutral" ? "font-semibold text-foreground" :
                            "text-muted-foreground"
                          }`}>{step.label}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold tabular-nums ${
                          step.type === "finalresult" ? "text-foreground text-sm" :
                          step.type === "result" ? "text-emerald-700 dark:text-emerald-400" :
                          step.type === "deduct" ? "text-emerald-600 dark:text-emerald-400" :
                          step.type === "add" ? "text-red-600 dark:text-red-400" :
                          "text-foreground"
                        }`}>
                          {step.type === "deduct" ? `-${formatCurrency(Math.abs(step.amount))}` : formatCurrency(step.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Savings from Flexi-Benefits Summary Card */}
            {isAdvanced && flexiSavings > 0 && (
              <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-400 rounded-lg text-left text-xs animate-in zoom-in-95">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-500" />
                  Tax Savings from Flexi-Benefits: {formatCurrency(flexiSavings)}/year
                </p>
                <p className="opacity-90 leading-relaxed mt-1">
                  By restructuring allowances and submitting bills for your Meal Card, Phone, Internet, and Fuel, you successfully reduced your tax liability by <strong>{formatCurrency(flexiSavings)}</strong>.
                </p>
              </div>
            )}

            {/* Slabs Side-by-Side Comparison details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted text-left border-t border-border/40 pt-4">Regime Comparison Breakdown</h3>
              
              <div className="space-y-3.5">
                {/* Old Regime bar */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold text-muted">Old Regime Tax</span>
                    <span className="text-sm font-bold font-mono text-foreground">{formatCurrency(oldRegime.totalTax)}</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${oldTaxPercent}%` }}
                    />
                  </div>
                </div>

                {/* New Regime bar */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold text-muted">New Regime Tax</span>
                    <span className="text-sm font-bold font-mono text-foreground">{formatCurrency(newRegime.totalTax)}</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${newTaxPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tax components table */}
              <div className="border border-border rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/15 border-b border-border font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                      <th className="p-2 border-r border-border">Component</th>
                      <th className="p-2 border-r border-border text-right">Old Regime</th>
                      <th className="p-2 text-right">New Regime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="p-2 border-r border-border font-medium">Gross Annual CTC</td>
                      <td className="p-2 border-r border-border text-right font-mono">{formatCurrency(grossSalary)}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(grossSalary)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-border font-medium text-emerald-600 dark:text-emerald-400">Flexi-Exemptions</td>
                      <td className="p-2 border-r border-border text-right font-mono text-emerald-600 dark:text-emerald-400">-{formatCurrency(oldRegime.totalBenefitsExempt)}</td>
                      <td className="p-2 text-right font-mono text-emerald-600 dark:text-emerald-400">-{formatCurrency(newRegime.totalBenefitsExempt)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-border font-medium text-emerald-600 dark:text-emerald-400">HRA Exemption (Sec 10)</td>
                      <td className="p-2 border-r border-border text-right font-mono text-emerald-600 dark:text-emerald-400">-{formatCurrency(results.hraExemption || 0)}</td>
                      <td className="p-2 text-right font-mono text-emerald-600 dark:text-emerald-400">-₹0</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-border font-medium text-amber-600 dark:text-amber-400">Deductions (80C, etc.)</td>
                      <td className="p-2 border-r border-border text-right font-mono text-amber-600 dark:text-amber-400">-{formatCurrency(totalDeductionsOldRegime + standardDeduction)}</td>
                      <td className="p-2 text-right font-mono text-amber-600 dark:text-amber-400">-{formatCurrency(standardDeduction)}</td>
                    </tr>
                    <tr className="bg-muted/5 font-semibold">
                      <td className="p-2 border-r border-border">Net Taxable Income</td>
                      <td className="p-2 border-r border-border text-right font-mono">{formatCurrency(oldRegime.taxableIncome)}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(newRegime.taxableIncome)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-border font-medium">Income Tax (after 87A rebate)</td>
                      <td className="p-2 border-r border-border text-right font-mono">{formatCurrency(oldRegime.baseTax)}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(newRegime.baseTax)}</td>
                    </tr>
                    {Math.max(oldRegime.surcharge, newRegime.surcharge) > 0 && (
                      <tr>
                        <td className="p-2 border-r border-border font-medium text-red-500">Surcharge</td>
                        <td className="p-2 border-r border-border text-right font-mono text-red-500">{formatCurrency(oldRegime.surcharge)}</td>
                        <td className="p-2 text-right font-mono text-red-500">{formatCurrency(newRegime.surcharge)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="p-2 border-r border-border font-medium">Health &amp; Education Cess (4%)</td>
                      <td className="p-2 border-r border-border text-right font-mono">{formatCurrency(oldRegime.cess)}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(newRegime.cess)}</td>
                    </tr>
                    <tr className="bg-muted/15 font-extrabold text-foreground border-t border-border">
                      <td className="p-2 border-r border-border">Total Annual Tax Due</td>
                      <td className="p-2 border-r border-border text-right font-mono">{formatCurrency(oldRegime.totalTax)}</td>
                      <td className="p-2 text-right font-mono">{formatCurrency(newRegime.totalTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Salary Optimization Suggestions & Section 6: Tax Saving Gauge */}
            {grossSalary > 700000 && (
              <div className="space-y-6 no-print animate-in fade-in duration-300">
                {/* Section 6: Tax Saving Gauge (replaces abstract score) */}
                {(() => {
                  const totalPotential = flexiSavings + (report.potentialAdditionalSaving || 0);
                  const claimedPct = totalPotential > 0 ? Math.round((flexiSavings / totalPotential) * 100) : 0;
                  const missedAmt = report.potentialAdditionalSaving || 0;
                  return (
                    <div className="border border-border bg-card rounded-xl p-5 shadow-sm text-left space-y-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
                        <TrendingDown className="h-4.5 w-4.5 text-zinc-500" />
                        Tax Saving Potential
                      </h3>

                      {totalPotential > 0 ? (
                        <>
                          {/* Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">Already Claimed</span>
                              <span className="font-bold text-amber-600 dark:text-amber-400">Still Available</span>
                            </div>
                            <div className="w-full h-4 bg-amber-200/40 dark:bg-amber-900/20 rounded-full overflow-hidden border border-border/40 relative">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${claimedPct}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>{claimedPct}% claimed</span>
                              <span>{100 - claimedPct}% remaining</span>
                            </div>
                          </div>

                          {/* Claimed / Missed cards */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-left">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Already Claimed</span>
                              <p className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-0.5">{formatCurrency(flexiSavings)}</p>
                              <span className="text-[9px] text-muted-foreground">saved via active benefits</span>
                            </div>
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-left">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Still Missed</span>
                              <p className="text-base font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-0.5">{formatCurrency(missedAmt)}</p>
                              <span className="text-[9px] text-muted-foreground">left unclaimed below</span>
                            </div>
                          </div>

                          {missedAmt > 0 && (
                            <p className="text-[11px] text-muted-foreground border-t border-border/40 pt-3 leading-normal">
                              💡 Enable the suggestions below to claim the remaining <strong className="text-amber-600 dark:text-amber-400">{formatCurrency(missedAmt)}</strong> in tax savings.
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                          <p className="text-sm font-bold text-foreground">Fully Optimized!</p>
                          <p className="text-xs text-muted">All available tax savings have been claimed.</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Section 5: Suggestions Panel */}
                <div className="border border-border bg-card rounded-xl p-5 shadow-sm text-left">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3 mb-4">
                    <TrendingDown className="h-4.5 w-4.5 text-zinc-500" />
                    Tax Optimization Suggestions
                  </h3>

                  {suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {suggestions.map((sug: any) => (
                        <div key={sug.id} className="border border-border bg-zinc-950/10 dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-700 p-4 rounded-xl flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Potential Saving</span>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                sug.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-600" :
                                sug.difficulty === "Medium" ? "bg-amber-500/15 text-amber-600" :
                                "bg-red-500/15 text-red-650"
                              }`}>
                                {sug.difficulty}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-foreground mt-1.5">{sug.benefitName}</h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal mt-1">{sug.explanation}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <div>
                              <span className="text-[10px] text-muted block">Annual savings:</span>
                              <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">+{formatCurrency(sug.potentialSaving)}</span>
                            </div>
                            <button
                              onClick={() => quickApply(sug.id, sug.potentialSaving)}
                              className="text-[10px] flex items-center gap-1 py-1 px-2.5 rounded bg-foreground text-background font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
                            >
                              Quick Apply
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      <h4 className="font-bold text-sm text-foreground">You are fully optimized!</h4>
                      <p className="text-xs text-muted max-w-xs leading-normal">
                        All supported corporate tax savings have been enabled. There are no remaining salary restructuring savings available.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Print Disclaimer */}
            <div className="hidden print:block border-t border-zinc-350 pt-3 mt-4 text-[10px] text-zinc-500 leading-normal italic text-left">
              Disclaimer: This estimation is based on the provided inputs and current tax laws (FY 2024-25 / AY 2025-26). Please verify with your employer and a certified tax advisor before making final salary restructuring or tax decisions.
            </div>
          </div>
        </div>

      </div>

      {/* Section 7: Salary Optimization Report */}
      {isAdvanced && (
        <div className="border border-border bg-card rounded-xl p-5 shadow-sm text-left space-y-4 print:border-none print:shadow-none">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3 no-print">
            <Award className="h-4.5 w-4.5 text-amber-500" />
            Salary Optimization Summary Report
          </h3>
          
          <div className="hidden print:block border-t border-zinc-200 pt-4" />

          {/* New 5-star style report card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-muted/10 p-4 rounded-lg border border-border/50">
            <div className="md:col-span-4 flex flex-col justify-center items-center text-center space-y-2 border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0">
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className={`w-5 h-5 ${star <= Math.round(report.optimizationScore / 20) ? 'fill-current' : 'text-muted-foreground/30'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="font-bold text-foreground text-sm">
                {report.optimizationScore > 80 ? "Excellent Structure" : report.optimizationScore > 50 ? "Good Salary Structure" : "Needs Optimization"}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Overall Rating</p>
            </div>
            
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Current Efficiency</span>
                <p className="text-base font-bold font-mono text-foreground">{report.optimizationScore}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Potential Savings</span>
                <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatCurrency(report.potentialAdditionalSaving)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Unused Benefits</span>
                <p className="text-base font-bold text-foreground">{report.unusedBenefits}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Tax Regime</span>
                <p className="text-base font-bold text-foreground capitalize">{report.recommendedRegime}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Risk Level</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">Low</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border/40 no-print">
            <button
              onClick={handlePrint}
              className="text-xs font-bold py-2 px-4 rounded border border-border bg-card hover:bg-muted/10 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
            >
              <Printer className="h-4 w-4" />
              Print Report
            </button>
            <button
              onClick={handlePrint}
              className="text-xs font-bold py-2 px-4 rounded bg-foreground text-background hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] shadow-sm"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* What If Salary Changes Widget */}
      <div className="border border-border bg-card rounded-xl p-5 shadow-sm text-left space-y-4 no-print max-w-2xl mx-auto">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
          <TrendingDown className="h-4.5 w-4.5 text-zinc-500" />
          What if my salary changes?
        </h3>
        <p className="text-xs text-muted-foreground mb-4">See how a salary hike or promotion affects your tax and take-home instantly.</p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/10 p-4 rounded-lg border border-border/50">
          <div className="w-full sm:w-1/2 space-y-1 text-center sm:text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Salary</label>
            <p className="font-mono text-lg font-bold text-foreground">{formatCurrency(grossSalary)}</p>
          </div>
          <ArrowRight className="hidden sm:block h-5 w-5 text-muted-foreground" />
          <div className="w-full sm:w-1/2 space-y-1 text-center sm:text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Salary</label>
            <div className="flex items-center justify-center sm:justify-start border border-border bg-background rounded px-2 py-1 focus-within:ring-1 focus-within:ring-foreground mx-auto sm:mx-0 w-32">
              <span className="text-muted text-sm mr-1">₹</span>
              <input
                type="number"
                value={whatIfSalaryTarget}
                onChange={(e) => setWhatIfSalaryTarget(e.target.value ? Number(e.target.value) : "")}
                className="w-full text-left bg-transparent text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>
        
        {(() => {
          const target = Number(whatIfSalaryTarget) || 0;
          if (target <= grossSalary || !whatIfResults) return null;
          
          const hike = target - grossSalary;
          const currentTax = activeRegimeData.totalTax;
          
          const targetRegime = selectedRegime === "auto" ? whatIfResults.recommendedRegime : selectedRegime;
          const targetRegimeData = targetRegime === "old" ? whatIfResults.oldRegime : whatIfResults.newRegime;
          
          const simulatedTaxIncrease = targetRegimeData.totalTax - currentTax;
          const simulatedTakeHomeIncrease = targetRegimeData.takeHomeSalary - activeRegimeData.takeHomeSalary;
          
          return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/30">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Salary Hike</span>
                <p className="text-base font-bold font-mono text-emerald-600">+{formatCurrency(hike)}</p>
              </div>
              <div className="text-center space-y-1 border-l border-border/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tax Increases By</span>
                <p className="text-base font-bold font-mono text-rose-500">~{formatCurrency(simulatedTaxIncrease)}</p>
              </div>
              <div className="text-center space-y-1 border-l border-border/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Take Home Increases By</span>
                <p className="text-base font-bold font-mono text-emerald-600">~{formatCurrency(simulatedTakeHomeIncrease)}</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Take Home Salary Calculator Widget */}
      <div className="border border-border bg-card rounded-xl p-5 shadow-sm text-left space-y-4 no-print max-w-2xl mx-auto">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
          <Calculator className="h-4.5 w-4.5 text-zinc-500" />
          Monthly Take-Home Salary Breakdown
        </h3>
        
        <div className="space-y-3 pt-2 font-mono text-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Gross Monthly CTC</span>
            <span>{formatCurrency(grossSalary / 12)}</span>
          </div>
          {isAdvanced && salaryBreakdown.employerPf > 0 && (
            <div className="flex justify-between items-center text-amber-600 dark:text-amber-500">
              <span>Employer PF (Co. Contribution)</span>
              <span>-{formatCurrency(salaryBreakdown.employerPf / 12)}</span>
            </div>
          )}
          {isAdvanced && deductionsAdvanced.epf > 0 && (
            <div className="flex justify-between items-center text-amber-600 dark:text-amber-500">
              <span>Employee PF (Your Contribution)</span>
              <span>-{formatCurrency(deductionsAdvanced.epf / 12)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-amber-600 dark:text-amber-500">
            <span>Professional Tax</span>
            <span>-₹200</span>
          </div>
          <div className="flex justify-between items-center text-rose-500 border-b border-border/50 pb-3">
            <span>Income Tax (TDS)</span>
            <span>-{formatCurrency(activeRegimeData.totalTax / 12)}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400 text-lg pt-1">
            <span>In-Hand Salary</span>
            <span>{formatCurrency((grossSalary / 12) - ((isAdvanced ? salaryBreakdown.employerPf : 0) / 12) - ((isAdvanced ? deductionsAdvanced.epf : 0) / 12) - 200 - (activeRegimeData.totalTax / 12))}</span>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* COMPREHENSIVE SEO GUIDE CONTENT              */}
      {/* ============================================= */}
      <div className="prose prose-sm dark:prose-invert max-w-none border-t border-border pt-8 mt-8 space-y-8 text-left no-print">

        {/* Section 1: How Income Tax is Calculated */}
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          How Income Tax is Calculated in India (FY 2024-25 / AY 2025-26)
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Income tax in India is calculated using a <strong>slab-rate system</strong>, where different portions of your income are taxed at progressively higher rates. Here is the step-by-step process:
        </p>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
          <li><strong>Compute Gross Salary:</strong> Start with your total CTC (Cost to Company), which includes Basic Salary, HRA, Special Allowance, Bonuses, Employer PF, Gratuity, and other allowances.</li>
          <li><strong>Subtract Exempt Allowances:</strong> Remove employer-funded tax-exempt benefits like Employer NPS (Section 80CCD(2)), Food Coupons (Rule 3(7)(iii)), Vehicle Maintenance (Rule 3(2)), Broadband/Telephone reimbursement (Rule 3(7)(ix)), and HRA exemption (Section 10(13A) — Old Regime only).</li>
          <li><strong>Apply Standard Deduction:</strong> Deduct ₹75,000 (New Regime) or ₹50,000 (Old Regime) as Standard Deduction under Section 16(ia).</li>
          <li><strong>Claim Chapter VI-A Deductions (Old Regime only):</strong> Subtract eligible investments like PPF, ELSS, Life Insurance (Section 80C, max ₹1.5L), NPS self-contribution (Section 80CCD(1B), max ₹50K), Health Insurance (Section 80D), Home Loan Interest (Section 24b, max ₹2L), etc.</li>
          <li><strong>Calculate Tax on Taxable Income:</strong> Apply the applicable slab rates (Old or New Regime) to derive Base Tax.</li>
          <li><strong>Add Surcharge (if applicable):</strong> For incomes above ₹50 Lakh, a surcharge of 10%–37% is levied on the base tax.</li>
          <li><strong>Add Health &amp; Education Cess:</strong> 4% cess is applied on (Base Tax + Surcharge) to arrive at Total Tax Payable.</li>
          <li><strong>Compute Monthly TDS:</strong> Your employer divides the annual tax by 12 and deducts it as TDS from your monthly salary.</li>
        </ol>

        <h3 className="text-base font-bold text-foreground">Example: Tax Calculation for ₹15 Lakh CTC</h3>
        <div className="text-sm text-muted-foreground space-y-1 pl-4 border-l-2 border-emerald-500/30">
          <p>Gross Salary: ₹15,00,000</p>
          <p>Standard Deduction (New Regime): -₹75,000</p>
          <p>Taxable Income: ₹14,25,000</p>
          <p>Tax on ₹3L–6L @ 5%: ₹15,000</p>
          <p>Tax on ₹6L–9L @ 10%: ₹30,000</p>
          <p>Tax on ₹9L–12L @ 15%: ₹45,000</p>
          <p>Tax on ₹12L–14.25L @ 20%: ₹45,000</p>
          <p>Base Tax: ₹1,35,000</p>
          <p>Cess (4%): ₹5,400</p>
          <p className="font-bold text-foreground">Total Tax: ₹1,40,400 | Monthly TDS: ₹11,700</p>
        </div>

        {/* Section 2: Old vs New Tax Regime Comparison */}
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Old vs. New Tax Regime: Complete Comparison
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The <strong>New Tax Regime</strong> (default from FY 2023-24) offers lower slab rates but removes most deductions and exemptions. The <strong>Old Tax Regime</strong> retains all deductions (80C, 80D, HRA, 24b, etc.) but has higher base tax rates.
        </p>

        <div className="border border-border rounded-lg overflow-hidden text-xs my-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/20 border-b border-border font-semibold text-muted-foreground">
                <th className="p-2.5 border-r border-border">Feature</th>
                <th className="p-2.5 border-r border-border">Old Tax Regime</th>
                <th className="p-2.5">New Tax Regime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { feature: "Standard Deduction", old: "₹50,000", newR: "₹75,000" },
                { feature: "Section 80C (PPF, ELSS)", old: "Up to ₹1,50,000", newR: "Not allowed" },
                { feature: "Section 80D (Health Insurance)", old: "Up to ₹75,000", newR: "Not allowed" },
                { feature: "HRA Exemption (Sec 10)", old: "Based on rent paid", newR: "Not allowed" },
                { feature: "Home Loan Interest (Sec 24b)", old: "Up to ₹2,00,000", newR: "Not allowed" },
                { feature: "Employer NPS (80CCD(2))", old: "Up to 14% of Basic", newR: "Up to 14% of Basic ✅" },
                { feature: "Food Coupons (Meal Card)", old: "₹1,05,600/year ✅", newR: "₹1,05,600/year ✅" },
                { feature: "Broadband/Phone Reimburse", old: "Actual bills ✅", newR: "Actual bills ✅" },
                { feature: "Vehicle Maintenance", old: "Up to ₹10,000/month ✅", newR: "Up to ₹10,000/month ✅" },
                { feature: "Tax-Free Income Limit", old: "₹2,50,000", newR: "₹3,00,000" },
                { feature: "Max Tax Rate", old: "30% (above ₹10L)", newR: "30% (above ₹15L)" },
                { feature: "Rebate u/s 87A", old: "₹5L income → NIL tax", newR: "₹7L income → NIL tax" },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 border-r border-border font-semibold">{row.feature}</td>
                  <td className="p-2.5 border-r border-border">{row.old}</td>
                  <td className="p-2.5">{row.newR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-border rounded-lg overflow-hidden text-xs my-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/20 border-b border-border font-semibold text-muted-foreground">
                <th className="p-2.5 border-r border-border">Old Regime Slab Rates</th>
                <th className="p-2.5">New Regime Slab Rates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr><td className="p-2.5 border-r border-border">Up to ₹2,50,000: <strong>Nil</strong></td><td className="p-2.5">Up to ₹3,00,000: <strong>Nil</strong></td></tr>
              <tr><td className="p-2.5 border-r border-border">₹2,50,001–₹5,00,000: <strong>5%</strong></td><td className="p-2.5">₹3,00,001–₹6,00,000: <strong>5%</strong></td></tr>
              <tr><td className="p-2.5 border-r border-border">₹5,00,001–₹10,00,000: <strong>20%</strong></td><td className="p-2.5">₹6,00,001–₹9,00,000: <strong>10%</strong></td></tr>
              <tr><td className="p-2.5 border-r border-border">Above ₹10,00,000: <strong>30%</strong></td><td className="p-2.5">₹9,00,001–₹12,00,000: <strong>15%</strong></td></tr>
              <tr><td className="p-2.5 border-r border-border">—</td><td className="p-2.5">₹12,00,001–₹15,00,000: <strong>20%</strong></td></tr>
              <tr><td className="p-2.5 border-r border-border">—</td><td className="p-2.5">Above ₹15,00,000: <strong>30%</strong></td></tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Employer Salary Benefits — Detailed */}
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Employer Salary Benefits (Flexi-Basket): Complete Guide
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Salary optimization (also known as <strong>Flexi-Basket Plan or FBP</strong>) allows you to restructure taxable components of your CTC (like Special Allowance) into tax-exempt perquisites and reimbursements. Below is a detailed breakdown of each benefit:
        </p>

        <div className="space-y-5 my-6">
          {[
            {
              name: "Food Coupons / Meal Card (Pluxee / Sodexo)",
              what: "A pre-loaded card or voucher provided by employers for purchasing food and non-alcoholic beverages during working hours.",
              who: "Any salaried employee whose employer offers a Flexi-Basket/FBP plan with a meal card option.",
              exempt: "Up to ₹200 per meal. Assuming 2 meals/day × 22 working days = ₹8,800/month (₹1,05,600/year).",
              docs: "Pluxee/Sodexo portal transaction logs. No physical bills required as the card itself tracks usage.",
              rule: "Rule 3(7)(iii) of the Income Tax Rules. Applicable in BOTH Old and New Tax Regimes.",
              faqs: [
                { q: "What is the meal card exemption limit per month?", a: "The exemption is ₹200 per meal, up to 2 meals per working day. For 22 working days/month, the maximum exempt amount is ₹8,800/month (₹1,05,600/year). Any amount above ₹200 per meal becomes a taxable perquisite." },
                { q: "Is the food coupon benefit available in the New Tax Regime?", a: "Yes! Food coupons / meal cards are exempt in BOTH the Old and New Tax Regimes under Rule 3(7)(iii). This is one of the few perquisites that survives the New Regime." },
                { q: "Do I need to submit physical food bills for meal card reimbursement?", a: "No. Digital meal card portals like Pluxee or Sodexo maintain transaction logs automatically. You simply use the card at approved food outlets — no separate bill submission is required from the employee." },
              ]
            },
            {
              name: "Employer NPS Contribution (Section 80CCD(2))",
              what: "Your employer contributes a portion of your Basic Salary directly into your National Pension Scheme (NPS) Tier-I account.",
              who: "Any salaried employee (private or government sector) whose employer offers NPS as part of the compensation structure.",
              exempt: "Up to 14% of Basic Salary + Dearness Allowance (DA). There is no absolute monetary cap — it is purely percentage-based.",
              docs: "Employer NPS account statement / NPS CRA login / Form 16 Part B showing Section 80CCD(2) deduction.",
              rule: "Section 80CCD(2) of the Income Tax Act. This is one of the FEW deductions allowed in the New Tax Regime.",
              faqs: [
                { q: "What percentage of salary can be contributed to NPS by my employer?", a: "Your employer can contribute up to 14% of your Basic Salary + Dearness Allowance (DA) to your NPS Tier-I account. The entire amount is tax-exempt under Section 80CCD(2) with no absolute monetary cap." },
                { q: "Can I claim Employer NPS deduction in the New Tax Regime?", a: "Yes. Section 80CCD(2) — the Employer NPS contribution — is one of the very few deductions explicitly permitted in the New Tax Regime. It is the single most impactful tax-saving tool available to salaried employees under the New Regime." },
                { q: "Which NPS account does the employer contribution go into?", a: "Employer NPS contributions go directly into your NPS Tier-I account, which has a lock-in until age 60. It is managed by a Pension Fund Manager of your choice registered with PFRDA." },
              ]
            },
            {
              name: "Fuel & Car Maintenance Reimbursement",
              what: "Employer reimburses fuel and vehicle maintenance costs incurred by the employee for official duties or commuting.",
              who: "Any salaried employee who owns/leases a car and uses it for official purposes, with employer approval.",
              exempt: "For cars below 1600cc: up to ₹1,800/month (fuel) + ₹900/month (driver) with employer-provided car; for self-owned cars, exempt based on actual bills, typically up to ₹5,000–₹10,000/month.",
              docs: "Car registration certificate (RC), fuel bills with vehicle registration number, maintenance/service invoices.",
              rule: "Rule 3(2) of the Income Tax Rules. Applicable in BOTH Old and New Tax Regimes.",
              faqs: [
                { q: "What documents are required for fuel reimbursement?", a: "You need petrol pump receipts or fuel bills that clearly show your vehicle registration number, date, and fuel quantity. A copy of your vehicle's Registration Certificate (RC) and employer approval are also typically required." },
                { q: "Is fuel reimbursement different for self-owned vs. company-owned cars?", a: "Yes. For employer-owned/leased cars, a fixed perquisite value applies (₹1,800/month for cars ≤1600cc). For employee-owned cars used for official purposes, the employer can reimburse actual documented fuel and maintenance costs, typically up to ₹5,000–₹10,000/month." },
                { q: "Can I claim fuel reimbursement if I use a two-wheeler?", a: "Fuel reimbursement under Rule 3(2) specifically applies to four-wheelers. Two-wheeler conveyance allowances may be claimed separately, but with a lower per km rate. Check with your HR for company-specific policy." },
              ]
            },
            {
              name: "Vehicle Allowance (Car Lease / Company Car)",
              what: "A structured vehicle benefit where the employer provides a car or leases one on behalf of the employee for official and personal commuting.",
              who: "Mid-to-senior level employees whose CTC structure includes a vehicle benefit component.",
              exempt: "For employer-owned car ≤1600cc: ₹1,800/month (petrol) + ₹900/month (driver); for >1600cc: ₹2,400/month + ₹900/month. Self-owned car with official use: actual running costs exempt.",
              docs: "Car registration copy, fuel/maintenance bills, driver salary receipts if claiming driver allowance.",
              rule: "Rule 3(2) of the Income Tax Rules. Applicable in BOTH Old and New Tax Regimes.",
              faqs: [
                { q: "Does the engine capacity (CC) of the car affect the tax benefit?", a: "Yes. Under Rule 3(2), the perquisite value for employer-provided cars is ₹1,800/month for cars up to 1600cc and ₹2,400/month for cars above 1600cc. The higher the CC, the higher the deemed taxable perquisite value." },
                { q: "Is a car lease benefit better than owning a car for tax purposes?", a: "A structured car lease via the employer (where the company owns the car) often yields better tax efficiency because the entire lease cost is a company expense, while the employee only pays tax on the small fixed perquisite value (₹1,800–₹2,400/month)." },
                { q: "Does the vehicle allowance work in the New Tax Regime?", a: "Yes, the vehicle maintenance/fuel reimbursement under Rule 3(2) is available in both regimes. However, LTA (Leave Travel Allowance) is only available in the Old Tax Regime." },
              ]
            },
            {
              name: "Internet & Broadband Reimbursement",
              what: "Employer reimburses the cost of your home Wi-Fi/broadband internet connection used for remote work and official duties.",
              who: "Any salaried employee who uses a broadband connection for work and submits actual bills.",
              exempt: "100% of actual billed amount is exempt. No statutory cap, but typically up to ₹1,000–₹2,000/month based on employer policy.",
              docs: "Monthly broadband/internet service provider bills showing the employee's name and connection details.",
              rule: "Rule 3(7)(ix) of the Income Tax Rules. Applicable in BOTH Old and New Tax Regimes.",
              faqs: [
                { q: "Does the internet bill need to be in my name to claim reimbursement?", a: "Ideally yes — the bill should be in the employee's name or registered address to establish personal usage. However, many employers accept bills in a spouse's name at the same address, subject to their internal policy." },
                { q: "Can I claim both internet and mobile phone reimbursement together?", a: "Yes. Internet/broadband (Rule 3(7)(ix)) and mobile phone (Rule 3(7)(ix)) are separate reimbursements that can both be claimed simultaneously, provided you submit separate bills for each. Both are exempt in Old and New Tax Regimes." },
                { q: "Is there a maximum monthly limit for internet reimbursement?", a: "There is no statutory government-mandated cap. The actual bill amount is fully exempt. However, your employer's internal FBP policy may set a limit, typically ₹1,000–₹2,000/month." },
              ]
            },
            {
              name: "Telephone & Mobile Reimbursement",
              what: "Employer reimburses your mobile phone postpaid or prepaid bills used for official communication.",
              who: "Any salaried employee who uses a personal mobile connection for work-related calls, emails, or data.",
              exempt: "100% of actual billed amount is exempt. No statutory cap, but typically up to ₹1,000–₹1,500/month based on employer policy.",
              docs: "Monthly mobile bill statements showing the employee's name and mobile number.",
              rule: "Rule 3(7)(ix) of the Income Tax Rules. Applicable in BOTH Old and New Tax Regimes.",
              faqs: [
                { q: "Are prepaid mobile recharges eligible for tax-exempt reimbursement?", a: "Generally, postpaid bills are easier to reimburse as they provide an itemized statement. Prepaid recharges can be claimed if the employer accepts them, but you must provide valid payment proof (recharge receipts or digital transaction records)." },
                { q: "Is mobile reimbursement taxable as a perquisite?", a: "No. Under Rule 3(7)(ix), mobile telephone reimbursements paid by the employer for official duties are specifically exempt from being treated as taxable perquisites in both the Old and New Tax Regimes." },
                { q: "Can I claim reimbursement for both my personal and spouse's phone bills?", a: "No. The exemption applies only to the employee's own mobile phone used for official purposes. Bills for family members' phones are not eligible and would be taxable if reimbursed." },
              ]
            },
            {
              name: "Driver Salary Reimbursement",
              what: "Employer reimburses the salary of a driver employed by the employee for official commuting purposes.",
              who: "Employees who employ a driver for commuting to the office or for official travel and have employer approval for this benefit.",
              exempt: "Up to ₹900/month if employer provides the car; up to ₹15,000/month if self-owned car with declared official commute.",
              docs: "Driver wage vouchers with receipt signature, driver's PAN card or Aadhaar copy, attendance records.",
              rule: "Rule 3 of the Income Tax Rules. Applicable in BOTH Old and New Tax Regimes.",
              faqs: [
                { q: "Is the driver's PAN card mandatory for claiming driver salary reimbursement?", a: "Yes, for high salary amounts, PAN details of the driver are typically required for TDS compliance. Aadhaar is also accepted as identity proof. The employer may require a declaration that the driver is genuine and paid regularly." },
                { q: "Can I claim driver reimbursement if the driver works part-time?", a: "Part-time drivers can be claimed, but the exempt amount is proportional to actual salary paid. You need monthly wage vouchers with the driver's signature for each payment made, regardless of whether they are full-time or part-time." },
                { q: "What is the maximum tax-exempt driver salary amount?", a: "Under Rule 3, if the car is employer-owned, the driver allowance is capped at ₹900/month. If the employee owns the car and uses it for official purposes, the actual driver salary paid (up to ₹15,000/month typically) can be reimbursed tax-free." },
              ]
            },
          ].map((ben, idx) => (
            <div key={idx} className="border border-border rounded-xl overflow-hidden">
              {/* Benefit info card */}
              <div className="p-5 bg-muted/15 space-y-3">
                <h4 className="text-sm font-bold text-foreground">{ben.name}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="space-y-1">
                    <p><strong className="text-foreground">What is it?</strong></p>
                    <p>{ben.what}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong className="text-foreground">Who can claim?</strong></p>
                    <p>{ben.who}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong className="text-foreground">Exemption Limit:</strong></p>
                    <p>{ben.exempt}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong className="text-foreground">Documents Required:</strong></p>
                    <p>{ben.docs}</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                  <strong className="text-foreground">Applicable Tax Rule:</strong> {ben.rule}
                </p>
              </div>
              {/* People Also Ask inline FAQ */}
              <div className="border-t border-border bg-muted/5">
                <div className="px-5 py-2.5 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">People Also Ask</span>
                </div>
                <div className="divide-y divide-border/40">
                  {ben.faqs.map((faq, fi) => (
                    <details key={fi} className="group px-5 py-0">
                      <summary className="flex items-center justify-between py-3 cursor-pointer list-none text-xs font-semibold text-foreground hover:text-foreground/80 transition-colors gap-2">
                        <span>{faq.q}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted shrink-0 group-open:rotate-180 transition-transform duration-200" />
                      </summary>
                      <p className="text-xs text-muted-foreground leading-relaxed pb-3 pt-0.5">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 4: Salary Examples */}
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          Salary Tax Examples: ₹10L to ₹50L CTC
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Below is a detailed comparison of estimated annual tax payable under the Old and New Tax Regimes for various salary brackets. Old Regime assumes ₹1.5L deductions under 80C + ₹50K Standard Deduction. New Regime uses ₹75K Standard Deduction only.
        </p>

        <div className="border border-border rounded-lg overflow-hidden text-xs my-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/20 border-b border-border font-semibold text-muted-foreground">
                <th className="p-2.5 border-r border-border">Salary (CTC)</th>
                <th className="p-2.5 border-r border-border">Old Regime Tax</th>
                <th className="p-2.5 border-r border-border">New Regime Tax</th>
                <th className="p-2.5 border-r border-border">Monthly TDS (New)</th>
                <th className="p-2.5">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { ctc: 1000000, old: 54600, newT: 54600, rec: "Equal — both regimes same" },
                { ctc: 1200000, old: 117000, newT: 93600, rec: "New Regime saves ₹23,400" },
                { ctc: 1500000, old: 210600, newT: 140400, rec: "New Regime saves ₹70,200" },
                { ctc: 2000000, old: 366600, newT: 286000, rec: "New Regime saves ₹80,600" },
                { ctc: 2500000, old: 522600, newT: 442000, rec: "New Regime saves ₹80,600" },
                { ctc: 3000000, old: 678600, newT: 598000, rec: "New Regime saves ₹80,600" },
                { ctc: 5000000, old: 1302600, newT: 1222000, rec: "New Regime saves ₹80,600" },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 border-r border-border font-mono font-semibold">{formatCurrency(row.ctc)}</td>
                  <td className="p-2.5 border-r border-border font-mono">{formatCurrency(row.old)}</td>
                  <td className="p-2.5 border-r border-border font-mono">{formatCurrency(row.newT)}</td>
                  <td className="p-2.5 border-r border-border font-mono">{formatCurrency(Math.round(row.newT / 12))}</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">{row.rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground italic">
          * These estimates are without any Flexi-Basket (FBP) salary restructuring. Enabling NPS, Meal Cards, and Phone/Internet reimbursements can save an additional ₹50,000–₹1,50,000 in tax depending on your CTC and basic salary structure.
        </p>
      </div>

      {/* FAQs Accordion — Comprehensive */}
      <div className="border-t border-border pt-8 mt-8 no-print text-left">
        <FAQAccordion 
          items={[
            ...INCOME_TAX_FAQS,
            {
              question: "Which tax regime is better — Old or New?",
              answer: "For most salaried employees (especially those earning above ₹12 Lakh), the New Tax Regime is better because of lower slab rates and the higher standard deduction of ₹75,000. However, if you have heavy deductions (e.g., ₹2L home loan interest, ₹1.5L in 80C, ₹50K NPS, and ₹25K health insurance), the Old Regime may be cheaper. Use our calculator to compare both instantly."
            },
            {
              question: "Can I claim HRA exemption in the New Tax Regime?",
              answer: "No. HRA exemption under Section 10(13A) is available only in the Old Tax Regime. Under the New Regime, your entire HRA is fully taxable. If you pay high rent in a metro city, this is one reason to evaluate whether the Old Regime is more beneficial for you."
            },
            {
              question: "Can I claim Employer NPS under the New Tax Regime?",
              answer: "Yes. Employer NPS contribution under Section 80CCD(2) is one of the few deductions explicitly allowed in the New Tax Regime — up to 14% of Basic Salary + DA. This makes it the single most impactful tax-saving tool available in the New Regime."
            },
            {
              question: "Are food coupons / meal cards (Pluxee/Sodexo) taxable?",
              answer: "No. Meal cards are tax-exempt under Rule 3(7)(iii) up to ₹200 per meal in BOTH the Old and New Tax Regimes. Assuming 2 meals/day × 22 working days, the maximum annual exemption is ₹1,05,600 (₹8,800/month). Amounts exceeding the ₹200/meal cap become taxable."
            },
            {
              question: "Can I claim fuel reimbursement as a tax-exempt benefit?",
              answer: "Yes. Fuel and vehicle maintenance reimbursements are exempt under Rule 3(2) in both regimes, provided you submit valid fuel bills with your vehicle registration number. The exemption limit depends on whether the car is employer-owned or self-owned, and its engine capacity."
            },
            {
              question: "Can I claim internet and broadband reimbursement?",
              answer: "Yes. Internet and broadband reimbursements for official duties are fully exempt under Rule 3(7)(ix) in both the Old and New Tax Regimes. You need to submit actual monthly bills from your internet service provider."
            },
            {
              question: "Can I change my tax regime every year?",
              answer: "Yes. Salaried employees (without business income) can switch between the Old and New Tax Regimes every financial year when filing their ITR. You do not need to inform your employer in advance — you can choose at the time of filing. However, if you want your employer to calculate TDS based on the Old Regime, you need to declare it to your employer at the start of the year."
            },
            {
              question: "How is Monthly TDS calculated on my salary?",
              answer: "Your employer estimates your total annual tax liability at the start of the year. They subtract all declared flexi-exemptions (NPS, Meal Card, Phone bills), HRA exemption (if Old Regime), and investment declarations (80C, 80D, etc.). The resulting annual tax is divided by 12 to deduct as TDS from your monthly salary. This TDS amount is adjusted in March if actual declarations differ from estimates."
            },
            {
              question: "Is telephone or mobile reimbursement taxable?",
              answer: "No. Under Rule 3(7)(ix), mobile phone and telephone reimbursements paid by the employer for official duties are fully tax-exempt in both the Old and New Tax Regimes. You must submit actual monthly bills."
            },
            {
              question: "What is the Standard Deduction for FY 2024-25?",
              answer: "The Standard Deduction is ₹50,000 under the Old Tax Regime and ₹75,000 under the New Tax Regime. This is a flat deduction available to all salaried employees — no bills or investments are required to claim it."
            },
            {
              question: "What cities qualify as Metro for HRA exemption?",
              answer: "As of FY 2026-27, the government has expanded the metro city list to 8 cities: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, and Ahmedabad. Employees in these cities can claim 50% of Basic Salary as the HRA cap (vs. 40% for non-metro cities) under the Old Tax Regime."
            },
          ]} 
          idPrefix="tax-optimizer-faq" 
          renderSchema={false} 
        />
      </div>

      {/* Related Calculators Links — Expanded Search Hub */}
      <div className="border-t border-border pt-8 mt-8 text-left no-print">
        <h3 className="text-base font-bold tracking-tight text-foreground mb-6">Explore More Financial Calculators</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Salary & Tax</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/calculators/income-tax" className="text-emerald-600 dark:text-emerald-500 hover:underline">Income Tax Calculator</Link>
              <Link href="/calculators/take-home-salary" className="text-foreground hover:text-emerald-600 transition-colors">Take Home Salary Calculator</Link>
              <Link href="/calculators/salary-hike" className="text-foreground hover:text-emerald-600 transition-colors">Salary Hike Calculator</Link>
              <Link href="/calculators/hra" className="text-foreground hover:text-emerald-600 transition-colors">HRA Calculator</Link>
              <Link href="/calculators/advance-tax" className="text-foreground hover:text-emerald-600 transition-colors">Advance Tax Calculator</Link>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Employee Benefits</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/calculators/gratuity" className="text-foreground hover:text-emerald-600 transition-colors">Gratuity Calculator</Link>
              <Link href="/calculators/pf" className="text-foreground hover:text-emerald-600 transition-colors">PF Calculator</Link>
              <Link href="/calculators/leave-encashment" className="text-foreground hover:text-emerald-600 transition-colors">Leave Encashment Calculator</Link>
              <Link href="/calculators/professional-tax" className="text-foreground hover:text-emerald-600 transition-colors">Professional Tax Calculator</Link>
              <Link href="/calculators/bonus" className="text-foreground hover:text-emerald-600 transition-colors">Bonus Calculator</Link>
              <Link href="/calculators/esop-tax" className="text-foreground hover:text-emerald-600 transition-colors">ESOP Tax Calculator</Link>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/50 pb-2">Investment & Loans</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/calculators/sip" className="text-foreground hover:text-emerald-600 transition-colors">SIP Calculator</Link>
              <Link href="/calculators/ppf" className="text-foreground hover:text-emerald-600 transition-colors">PPF Calculator</Link>
              <Link href="/calculators/emi" className="text-foreground hover:text-emerald-600 transition-colors">Home Loan / EMI Calculator</Link>
              <Link href="/calculators/compound-interest" className="text-foreground hover:text-emerald-600 transition-colors">Compound Interest Calculator</Link>
              <Link href="/calculators/capital-gains" className="text-foreground hover:text-emerald-600 transition-colors">Capital Gains Tax Calculator</Link>
              <Link href="/calculators/percentage" className="text-foreground hover:text-emerald-600 transition-colors">Percentage Calculator</Link>
            </div>
          </div>
        </div>
      </div>

      {isFromDashboard && (
        <div className="border border-border bg-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm no-print mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-semibold hover:underline flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </button>
          <button
            onClick={handleUpdateDashboard}
            className="px-6 py-2.5 bg-foreground text-background font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Update Dashboard Profile
          </button>
        </div>
      )}

      <FinancialDisclaimer />
    </div>
  );
}
