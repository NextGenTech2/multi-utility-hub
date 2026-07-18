import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Epoch Converter & Timestamp Tool - ApexToolHub",
  description: "Convert Unix epoch timestamps to human-readable date/time formats and vice-versa in real-time.",
  alternates: {
    canonical: "/converters/unix-epoch/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
