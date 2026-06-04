import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DevToolHub - Client-Side Multi-Utility Web Workstation",
  description: "A highly optimized, lightning-fast, client-side utility hub. Features a JSON Formatter & Validator, Text Case Converter, and Percentage Calculator with zero hosting overhead.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <div className="flex flex-1 w-full max-w-7xl mx-auto items-stretch">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <main className="p-4 md:p-6 lg:p-8 flex-1 min-w-0">
                {children}
              </main>
              <footer className="w-full border-t border-border bg-card/30 py-6 text-center text-xs text-muted">
                <div className="px-4">
                  <p>&copy; {new Date().getFullYear()} DevToolHub. All tools run 100% client-side.</p>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
