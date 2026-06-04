import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff Checker & Comparison Tool - DevToolHub",
  description: "Compare two blocks of text side-by-side to highlight additions, deletions, and inline differences.",
  alternates: {
    canonical: "https://multiutilityhub.com/text/diff-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
