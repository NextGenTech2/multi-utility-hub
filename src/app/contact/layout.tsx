import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ApexToolHub - Secure Feedback & Support",
  description: "Contact the developer of ApexToolHub. Send bug reports, feature suggestions, or general inquiries through our secure, spam-protected client-side form.",
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
