import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { RightSidebarWrapper } from "@/components/RightSidebarWrapper";

const GA_ID = "G-33T9DCRYFR";

export const metadata: Metadata = {
  title: "ApexToolHub | All Major Utilities in One Place",
  description:
    "A highly optimized, lightning-fast, client-side utility hub. Features converter tools, developer utilities, text converters, media tools, and calculators with zero hosting overhead.",
  openGraph: {
    title: "ApexToolHub | All Major Utilities in One Place",
    description:
      "A highly optimized, lightning-fast, client-side utility hub. Features converter tools, developer utilities, text converters, media tools, and calculators with zero hosting overhead.",
    url: "https://apextoolhub.com",
    siteName: "ApexToolHub",
    images: [
      {
        url: "https://apextoolhub.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ApexToolHub Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexToolHub | All Major Utilities in One Place",
    description:
      "A highly optimized, lightning-fast, client-side utility hub. Features converter tools, developer utilities, text converters, media tools, and calculators with zero hosting overhead.",
    images: ["https://apextoolhub.com/og-image.png"],
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
      {/* Google Analytics — raw script tags embedded directly in static HTML head */}
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <CurrencyProvider>
            <Navbar />
            <div className="flex flex-1 w-full items-stretch">
              {/* fixed left navigation sidebar */}
              <Sidebar />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex flex-1 items-stretch">
                  <main className="p-4 md:p-6 lg:p-8 flex-1 min-w-0 flex flex-col justify-between">
                    <div>{children}</div>
                    {/* Stacks below main content on mobile/tablet (viewport < xl) */}
                    <div className="block xl:hidden mt-12 border-t border-border pt-8">
                      <RightSidebarWrapper />
                    </div>
                  </main>

                  {/* 300px sticky right-hand column (hidden on viewport < xl) */}
                  <aside
                    aria-label="Sidebar Content"
                    className="hidden xl:block w-[300px] shrink-0 border-l border-border bg-card/10 h-[calc(100vh-4rem)] sticky top-16 z-20 p-4 overflow-y-auto"
                  >
                    <RightSidebarWrapper />
                  </aside>
                </div>

                <Footer />
              </div>
            </div>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
