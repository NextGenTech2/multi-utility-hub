import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Case Converter (UPPER, lower, camel, snake) - ApexToolHub",
  description: "Convert text block cases between UPPERCASE, lowercase, camelCase, snake_case, and sentence case with character counters.",
  alternates: {
    canonical: "/text/case-converter/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
