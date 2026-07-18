import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator - ApexToolHub",
  description: "Calculate percentages, percentage increases, and percentage shares instantly with our real-time client-side calculator.",
  alternates: {
    canonical: "/calculators/percentage/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
