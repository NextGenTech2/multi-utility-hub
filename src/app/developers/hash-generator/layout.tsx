import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cryptographic Hash & Bcrypt Generator - ApexToolHub",
  description: "Generate MD5, SHA-256, and secure Bcrypt hashes directly in your browser with zero server latency.",
  alternates: {
    canonical: "https://apextoolhub.com/developers/hash-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
