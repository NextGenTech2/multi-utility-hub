import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Calculator - ApexToolHub",
  description: "Calculate the exact duration, years, months, and days between two dates, or add/subtract days from any date with our real-time online tool.",
  alternates: {
    canonical: "https://apextoolhub.com/calculators/date",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
