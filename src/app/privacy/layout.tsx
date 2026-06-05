import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DevToolHub - Secure Client-Side Utilities",
  description: "Read our privacy guidelines. DevToolHub operates 100% client-side: your data, keys, and documents are processed entirely in your browser and never uploaded.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
