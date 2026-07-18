import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word to PDF Converter (DOCX to PDF) - ApexToolHub",
  description: "Convert Word documents (.docx) to PDF and PDF files to Word format with our client-side converter.",
  alternates: {
    canonical: "/converters/docx-to-pdf/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
