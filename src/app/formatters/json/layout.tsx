import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - ApexToolHub",
  description: "Format, validate, beautify, and parse complex JSON structures instantly. Redirects to JSON Suite.",
  alternates: {
    canonical: "https://apextoolhub.com/formatters/json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
