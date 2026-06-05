import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder & Base64 Token Tool - ApexToolHub",
  description: "Decode JSON Web Token (JWT) payloads, encode/decode Base64, and decode URLs instantly.",
  alternates: {
    canonical: "https://multiutilityhub.com/developers/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
