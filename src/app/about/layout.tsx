import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | DevToolHub - High-Performance Developer Suite",
  description: "Learn about the mission, client-side architecture, and engineering experience behind DevToolHub, a curated suite of serverless developer utilities designed by a Senior Engineering Manager in Bangalore, India.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
