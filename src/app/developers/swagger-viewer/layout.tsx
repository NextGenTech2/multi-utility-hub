import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swagger UI Viewer & API Docs Previewer - DevToolHub",
  description: "Render OpenAPI/Swagger YAML or JSON specifications into interactive, beautiful API documentation in real time.",
  alternates: {
    canonical: "https://multiutilityhub.com/developers/swagger-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
