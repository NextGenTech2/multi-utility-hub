import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cryptographic Hash & Bcrypt Generator - DevToolHub",
  description: "Generate MD5, SHA-256, and secure Bcrypt hashes directly in your browser with zero server latency.",
  alternates: {
    canonical: "https://multiutilityhub.com/developers/hash-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
