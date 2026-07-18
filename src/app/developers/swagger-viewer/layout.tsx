import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swagger UI Viewer & API Docs Previewer - ApexToolHub",
  description: "Render OpenAPI/Swagger YAML or JSON specifications into interactive, beautiful API documentation in real time.",
  alternates: {
    canonical: "/developers/swagger-viewer/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
