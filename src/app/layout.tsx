import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Multi-Utility Hub | All Major Utilities in One Place",
  description: "A highly optimized, lightning-fast, client-side utility hub. Features converter tools, developer utilities, text converters, media tools, and calculators with zero hosting overhead.",
  openGraph: {
    title: "Multi-Utility Hub | All Major Utilities in One Place",
    description: "A highly optimized, lightning-fast, client-side utility hub. Features converter tools, developer utilities, text converters, media tools, and calculators with zero hosting overhead.",
    url: "https://multi-utility-hub.vercel.app",
    siteName: "DevToolHub",
    images: [
      {
        url: "https://multi-utility-hub.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevToolHub Multi-Utility Hub Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Utility Hub | All Major Utilities in One Place",
    description: "A highly optimized, lightning-fast, client-side utility hub. Features converter tools, developer utilities, text converters, media tools, and calculators with zero hosting overhead.",
    images: ["https://multi-utility-hub.vercel.app/og-image.png"],
  },
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
          <div className="flex flex-1 w-full items-stretch">
            {/* fixed left navigation sidebar */}
            <Sidebar />
            
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex flex-1 items-stretch">
                <main className="p-4 md:p-6 lg:p-8 flex-1 min-w-0">
                  {children}
                </main>
                
                {/* 300px sticky right-hand column for adsense (hidden on viewport < xl) */}
                <aside 
                  aria-label="Sponsored Content"
                  className="hidden xl:block w-[300px] shrink-0 border-l border-border bg-card/10 h-[calc(100vh-4rem)] sticky top-16 z-20 p-4 overflow-y-auto"
                >
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-border/80 bg-muted/10 rounded-xl text-center text-xs text-muted min-h-[250px] animate-pulse">
                      <span className="text-[9px] uppercase tracking-widest text-muted/65 mb-2">Advertisement</span>
                      <div className="font-semibold text-zinc-500 dark:text-zinc-400">AdSense Ad Unit 1</div>
                      <p className="text-[10px] text-muted/50 mt-1 max-w-[180px]">Accepts 300x250 Medium Rectangle or 300x600 Half-Page ads</p>
                    </div>
                    
                    <div className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-border/80 bg-muted/10 rounded-xl text-center text-xs text-muted min-h-[350px] animate-pulse">
                      <span className="text-[9px] uppercase tracking-widest text-muted/65 mb-2">Advertisement</span>
                      <div className="font-semibold text-zinc-500 dark:text-zinc-400">AdSense Ad Unit 2</div>
                      <p className="text-[10px] text-muted/50 mt-1 max-w-[180px]">Accepts 160x600 Wide Skyscraper or vertical responsive ads</p>
                    </div>
                  </div>
                </aside>
              </div>
              
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
