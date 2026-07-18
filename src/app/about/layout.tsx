import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | ApexToolHub - High-Performance Developer Suite",
  description: "Learn about the mission, client-side architecture, and engineering experience behind ApexToolHub, a curated suite of serverless developer utilities designed by a Senior Engineering Manager in Bangalore, India.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
