import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter - DevToolHub",
  description: "Convert length, weight, data bytes, temperature, and other measurement units with real-time scaling.",
  alternates: {
    canonical: "https://multiutilityhub.com/converters/unit",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
