import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON & XML Converter & Formatter Suite - ApexToolHub",
  description: "A complete developer workstation to format, validate, parse XML, and diff-compare JSON structures.",
  alternates: {
    canonical: "/formatters/json-suite/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
