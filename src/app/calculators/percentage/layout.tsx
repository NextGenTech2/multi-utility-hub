import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator - DevToolHub",
  description: "Calculate percentages, percentage increases, and percentage shares instantly with our real-time client-side calculator.",
  alternates: {
    canonical: "https://multiutilityhub.com/calculators/percentage",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
