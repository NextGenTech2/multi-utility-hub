import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter - ApexToolHub",
  description: "Flatten nested or complex JSON objects and arrays into clean tabular CSV formats instantly.",
  alternates: {
    canonical: "https://multiutilityhub.com/converters/json-to-csv",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
