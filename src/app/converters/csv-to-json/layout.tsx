import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter - DevToolHub",
  description: "Convert CSV and Excel tabular data into clean, structured JSON arrays instantly in your browser.",
  alternates: {
    canonical: "https://multiutilityhub.com/converters/csv-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
