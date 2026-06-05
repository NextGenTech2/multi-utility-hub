import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DevToolHub - Client-Side Utility Suite",
  description: "Read our terms of service governing the use of DevToolHub. All tools are offered free, 100% client-side, and on an 'as-is' basis without any remote logging.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
