import React from "react";
import type { Metadata } from "next";
import SalaryHikeClient from "./SalaryHikeClient";

export const metadata: Metadata = {
  title: "Salary Hike Calculator India (FY 2024-25) | Calculate Increment & Take Home",
  description:
    "Calculate your new take-home salary after an appraisal or job switch. See exact tax increases, EPF deductions, and in-hand salary for the new financial year.",
};

export default function SalaryHikePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
          Salary Hike Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate your new take-home salary and tax impact after a promotion or job switch.
        </p>
      </div>
      
      <SalaryHikeClient />
    </div>
  );
}
