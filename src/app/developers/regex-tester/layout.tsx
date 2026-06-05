import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Regex Tester & Editor - ApexToolHub",
  description: "Write, test, and evaluate regular expressions in real-time with syntax highlighting and match visualizer.",
  alternates: {
    canonical: "https://multiutilityhub.com/developers/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
