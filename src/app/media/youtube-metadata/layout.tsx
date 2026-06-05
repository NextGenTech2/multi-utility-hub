import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Metadata & Thumbnail Extractor - ApexToolHub",
  description: "Extract video IDs, high-resolution thumbnail CDNs, and metadata from any YouTube video link.",
  alternates: {
    canonical: "https://apextoolhub.com/media/youtube-metadata",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
