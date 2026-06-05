import React from "react";

export default function AboutPage() {
  const authorSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://multi-utility-hub.vercel.app/about#creator",
        "name": "Niraj Kumar",
        "jobTitle": "Senior Engineering Manager",
        "worksFor": {
          "@type": "Organization",
          "name": "Leading Tech Enterprise"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bangalore",
          "addressRegion": "Karnataka",
          "addressCountry": "India"
        },
        "description": "Senior Engineering Manager with over a decade of experience building scalable enterprise software, specializing in web technologies, frontend performance optimization, and developer productivity tooling.",
        "sameAs": [
          "https://github.com/nirajkumar",
          "https://linkedin.com/in/nirajkumar"
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://multi-utility-hub.vercel.app/#organization",
        "name": "ApexToolHub",
        "url": "https://multi-utility-hub.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://multi-utility-hub.vercel.app/logo.png"
        },
        "founder": {
          "@id": "https://multi-utility-hub.vercel.app/about#creator"
        },
        "description": "A curated collection of developer utility tools designed to run entirely inside the client's browser, providing zero tracking, complete privacy, and sub-millisecond execution speeds."
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />

      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          About ApexToolHub
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          ApexToolHub is a highly optimized, browser-native developer workspace designed to streamline everyday formatting, parsing, and utility tasks. By executing all computations 100% client-side, the platform guarantees immediate processing, total offline support, and absolute confidentiality for your data.
        </p>
      </section>

      {/* Meet the Creator */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-t border-border pt-10">
        <div className="md:col-span-1 space-y-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border bg-card flex items-center justify-center text-xl font-bold text-muted-foreground">
            NK
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Niraj Kumar</h2>
            <p className="text-xs text-muted-foreground">Senior Engineering Manager</p>
            <p className="text-xs text-muted-foreground">Bangalore, India</p>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Our Philosophy & Authority</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As a Senior Engineering Manager based in Bangalore, India—a global tech hub—I encounter common developer productivity bottlenecks on a daily basis. Many online utility tools are bogged down by intrusive advertising, slow servers, or privacy-compromising APIs that execute calculations remotely.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ApexToolHub was built to establish a fast, secure alternative. Every feature—such as the Web Worker-driven <strong>Crypto Hash Generator</strong>, our <strong>Excel-to-JSON Sheet Parser</strong>, and the instant <strong>Regex Validator</strong>—executes entirely within the sandbox of your browser. Your proprietary files, tokens, and payloads are never transmitted across the network, ensuring compliance with strict enterprise data protection policies.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-border pt-10 space-y-6">
        <h3 className="text-xl font-bold text-foreground">Architectural Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-lg border border-border bg-card/50 space-y-2">
            <h4 className="font-semibold text-foreground text-sm">100% Browser-Native</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No server-side file processing, telemetry, or remote API callbacks. Safe for critical enterprise payloads.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card/50 space-y-2">
            <h4 className="font-semibold text-foreground text-sm">Web Worker Isolation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Computationally heavy tasks run on isolated background threads, preventing main-thread page freezing.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card/50 space-y-2">
            <h4 className="font-semibold text-foreground text-sm">Monetization Ready</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clean layout spaces optimized for non-intrusive AdSense compliance, prioritizing core usability and Lighthouse speed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
