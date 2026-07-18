import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter - ApexToolHub",
  description: "Convert CSV and Excel tabular data into clean, structured JSON arrays instantly in your browser.",
  alternates: {
    canonical: "/converters/csv-to-json/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
