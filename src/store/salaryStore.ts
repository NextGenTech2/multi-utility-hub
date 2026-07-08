import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SalaryStore {
  // --- Core Profile ---
  grossSalary: number;
  age: number;
  retirementAge: number;
  city: "metro" | "non-metro";

  // --- Allowances & Salary Structure ---
  basicPercentage: number;
  rentPaid: number;
  manualHraExemption: number;

  // --- Deductions (Section 80) ---
  sec80c: {
    epf: number;
    ppf: number;
    elss: number;
    lifeInsurance: number;
    taxSaverFd: number;
  };
  sec80dHealthInsurance: number;
  homeLoanInterest: number;
  educationLoan: number;
  npsSelf: number; // 80CCD(1B)
  donations: number; // 80G

  // --- Employer / Flexi Benefits ---
  flexiBenefits: {
    mealCard: { enabled: boolean; amount: number };
    employerNps: { enabled: boolean; amount: number };
    internet: { enabled: boolean; amount: number };
    mobile: { enabled: boolean; amount: number };
    telephone: { enabled: boolean; amount: number };
    fuel: { enabled: boolean; amount: number };
    driver: { enabled: boolean; amount: number };
    books: { enabled: boolean; amount: number };
    professionalMembership: { enabled: boolean; amount: number };
    giftVoucher: { enabled: boolean; amount: number };
    lta: { enabled: boolean; amount: number };
    uniform: { enabled: boolean; amount: number };
    newspaper: { enabled: boolean; amount: number };
    internetEquipment: { enabled: boolean; amount: number };
    vehicleType: "none" | "maintenance_small" | "maintenance_large" | "combined_small" | "combined_large";
    vehicleMaintenanceAmount: number;
  };

  // --- EPF Specifics ---
  epfEmployeeContributionType: "percent" | "fixed" | "minimum";
  epfEmployeeValue: number;
  epfEmployerContributionType: "percent" | "fixed" | "minimum";
  epfEmployerValue: number;
  currentEpfBalance: number;
  expectedEpfInterestRate: number;

  // --- Gratuity Specifics ---
  yearsOfService: number;

  // --- Actions ---
  updateField: (fieldPath: string, value: any) => void;
  resetToDefaults: () => void;
}

const defaultState = {
  grossSalary: 1500000,
  age: 30,
  retirementAge: 58,
  city: "metro" as "metro" | "non-metro",

  basicPercentage: 40,
  rentPaid: 0,
  manualHraExemption: 0,

  sec80c: {
    epf: 0,
    ppf: 0,
    elss: 0,
    lifeInsurance: 0,
    taxSaverFd: 0,
  },
  sec80dHealthInsurance: 0,
  homeLoanInterest: 0,
  educationLoan: 0,
  npsSelf: 0,
  donations: 0,

  flexiBenefits: {
    mealCard: { enabled: false, amount: 2200 },
    employerNps: { enabled: false, amount: 5000 },
    internet: { enabled: false, amount: 1000 },
    mobile: { enabled: false, amount: 1000 },
    telephone: { enabled: false, amount: 500 },
    fuel: { enabled: false, amount: 2000 },
    driver: { enabled: false, amount: 900 },
    books: { enabled: false, amount: 1000 },
    professionalMembership: { enabled: false, amount: 5000 },
    giftVoucher: { enabled: false, amount: 5000 },
    lta: { enabled: false, amount: 20000 },
    uniform: { enabled: false, amount: 10000 },
    newspaper: { enabled: false, amount: 2000 },
    internetEquipment: { enabled: false, amount: 5000 },
    vehicleType: "none" as "none" | "maintenance_small" | "maintenance_large" | "combined_small" | "combined_large",
    vehicleMaintenanceAmount: 0,
  },

  epfEmployeeContributionType: "percent" as "percent" | "fixed" | "minimum",
  epfEmployeeValue: 12,
  epfEmployerContributionType: "percent" as "percent" | "fixed" | "minimum",
  epfEmployerValue: 12,
  currentEpfBalance: 0,
  expectedEpfInterestRate: 8.25,

  yearsOfService: 0,
};

export const useSalaryStore = create<SalaryStore>()(
  persist(
    (set) => ({
      ...defaultState,

      updateField: (fieldPath: string, value: any) =>
        set((state) => {
          // Supports nested paths like "sec80c.epf"
          const keys = fieldPath.split(".");
          if (keys.length === 1) {
            return { [keys[0]]: value } as any;
          }

          // Deep clone the top level object for mutation
          const topKey = keys[0] as keyof SalaryStore;
          const updatedObject = { ...(state[topKey] as any) };
          let currentLevel = updatedObject;

          for (let i = 1; i < keys.length - 1; i++) {
            currentLevel[keys[i]] = { ...currentLevel[keys[i]] };
            currentLevel = currentLevel[keys[i]];
          }

          currentLevel[keys[keys.length - 1]] = value;
          return { [topKey]: updatedObject } as any;
        }),

      resetToDefaults: () => set(defaultState),
    }),
    {
      name: "salary-intelligence-storage",
      // Only persist selected fields (don't save deep complex nested states if they grow too large, but for now it's fine)
    }
  )
);
