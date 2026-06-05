"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Lightbulb, Mail, Check, Link2 } from "lucide-react";

interface RelatedLink {
  name: string;
  href: string;
  category: string;
}

export function RightSidebar() {
  const pathname = usePathname() || "/";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // 1. Context-Aware Configuration mapping
  let relatedTools: RelatedLink[] = [];
  let didYouKnowTip = "";

  if (pathname.includes("/json-suite") || pathname.includes("/formatters/json")) {
    relatedTools = [
      { name: "JSON to CSV Converter", href: "/converters/json-to-csv", category: "Converter" },
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
      { name: "Regular Expression Tester", href: "/developers/regex-tester", category: "Developer" },
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
    ];
    didYouKnowTip = "JSON (JavaScript Object Notation) was popularized by Douglas Crockford in the early 2000s as a lightweight, text-based alternative to heavy XML data transport layouts.";
  } else if (pathname.includes("/csv-to-json") || pathname.includes("/json-to-csv")) {
    relatedTools = [
      { name: "JSON suite Workstation", href: "/formatters/json-suite", category: "Format" },
      { name: "Unit Scaling Converter", href: "/converters/unit", category: "Converter" },
      { name: "Unix Epoch Converter", href: "/converters/unix-epoch", category: "Converter" },
      { name: "Bcrypt & Hash Generator", href: "/developers/hash-generator", category: "Security" },
    ];
    didYouKnowTip = "CSV parsing flattens nested structures. When converting JSON objects to spreadsheet columns, the parser concatenates sub-keys into dot-notations, such as 'user.profile.name'.";
  } else if (pathname.includes("/jwt-decoder")) {
    relatedTools = [
      { name: "Bcrypt & Hash Generator", href: "/developers/hash-generator", category: "Security" },
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
      { name: "Regular Expression Tester", href: "/developers/regex-tester", category: "Developer" },
      { name: "Case Converter tool", href: "/text/case-converter", category: "Text" },
    ];
    didYouKnowTip = "JWTs (JSON Web Tokens) are split into Header, Payload, and Signature. The payload data is simply Base64Url encoded—not encrypted. Never place raw passwords in a JWT!";
  } else if (pathname.includes("/hash-generator")) {
    relatedTools = [
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
      { name: "Regular Expression Tester", href: "/developers/regex-tester", category: "Developer" },
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
      { name: "Case Converter tool", href: "/text/case-converter", category: "Text" },
    ];
    didYouKnowTip = "Bcrypt utilizes a configurable key derivation work factor (cost) that increases the computation steps exponentially, protecting hashes against automated brute-force attempts.";
  } else if (pathname.includes("/unix-epoch")) {
    relatedTools = [
      { name: "Unit Scaling Converter", href: "/converters/unit", category: "Converter" },
      { name: "JSON to CSV Converter", href: "/converters/json-to-csv", category: "Converter" },
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
    ];
    didYouKnowTip = "Unix Epoch time computes seconds elapsed since January 1, 1970. Legacy 32-bit systems will run out of integer bits to represent seconds on January 19, 2038 (the Year 2038 Problem).";
  } else if (pathname.includes("/regex-tester")) {
    relatedTools = [
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
      { name: "Case Converter tool", href: "/text/case-converter", category: "Text" },
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
    ];
    didYouKnowTip = "In Regular Expressions, adding a question mark to a wildcard selector (e.g. '.*?') converts the operation to non-greedy, selecting the shortest matching sequence first.";
  } else if (pathname.includes("/docx-to-pdf")) {
    relatedTools = [
      { name: "JSON to CSV Converter", href: "/converters/json-to-csv", category: "Converter" },
      { name: "Unit Scaling Converter", href: "/converters/unit", category: "Converter" },
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
    ];
    didYouKnowTip = "Microsoft Word .docx files are actually zipped folders containing XML documents. Mammoth extracts raw paragraphs from these XML layers directly inside your local browser.";
  } else {
    // Default home page or compliance pages
    relatedTools = [
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
      { name: "Word to PDF Converter", href: "/converters/docx-to-pdf", category: "Converter" },
      { name: "Unix Epoch Converter", href: "/converters/unix-epoch", category: "Converter" },
    ];
    didYouKnowTip = "ApexToolHub executes all utility conversions, hashing computations, and file parsings locally in your browser workspace. No document bytes ever traverse the network.";
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Module 1: Related Tools */}
      <section className="bg-card/35 border border-border/80 rounded-xl p-4.5 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5 select-none">
          <Link2 className="h-3.5 w-3.5 text-zinc-500" />
          Related Utilities
        </h3>
        <div className="flex flex-col gap-2">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-zinc-950/20 hover:bg-zinc-900/20 hover:border-border transition-all"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground group-hover:text-foreground/90 transition-colors truncate">
                  {tool.name}
                </span>
                <span className="text-[9px] text-zinc-500 font-medium mt-0.5">
                  {tool.category}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Module 2: Did You Know? */}
      <section className="bg-card/35 border border-border/80 rounded-xl p-4.5 space-y-2.5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5 select-none">
          <Lightbulb className="h-3.5 w-3.5 text-zinc-500" />
          Did You Know?
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-normal">
          {didYouKnowTip}
        </p>
      </section>

      {/* Module 3: Newsletter */}
      <section className="bg-card/35 border border-border/80 rounded-xl p-4.5 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5 select-none">
          <Mail className="h-3.5 w-3.5 text-zinc-500" />
          Newsletter &amp; Updates
        </h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Be notified when we publish new client-side security tools and code formatting features.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded border border-border bg-zinc-950/40 py-1.5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-700 min-h-[34px] placeholder-zinc-650"
            required
          />
          <button
            type="submit"
            className="w-full text-xs font-bold py-2 px-3 rounded bg-zinc-100 hover:bg-white text-zinc-950 transition-colors flex items-center justify-center gap-1 min-h-[34px] cursor-pointer"
          >
            {subscribed ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Subscribed!</span>
              </>
            ) : (
              "Join for Updates"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
