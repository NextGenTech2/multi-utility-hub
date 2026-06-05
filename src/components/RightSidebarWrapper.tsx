"use client";

import { usePathname } from "next/navigation";
import { SidebarModules, RelatedTool } from "./SidebarModules";

export function RightSidebarWrapper() {
  const pathname = usePathname() || "/";

  // Context-Aware Data Resolution
  let relatedTools: RelatedTool[] = [];
  let didYouKnow = "";

  if (pathname.includes("/json-suite") || pathname.includes("/formatters/json")) {
    relatedTools = [
      { name: "JSON to CSV Converter", href: "/converters/json-to-csv", category: "Converter" },
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
      { name: "Regular Expression Tester", href: "/developers/regex-tester", category: "Developer" },
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
    ];
    didYouKnow = "JSON (JavaScript Object Notation) was popularized by Douglas Crockford in the early 2000s as a lightweight, text-based alternative to XML data structures.";
  } else if (pathname.includes("/csv-to-json") || pathname.includes("/json-to-csv")) {
    relatedTools = [
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
      { name: "Unit Scaling Converter", href: "/converters/unit", category: "Converter" },
      { name: "Unix Epoch Converter", href: "/converters/unix-epoch", category: "Converter" },
    ];
    didYouKnow = "CSV parsing flattens nested structures. When converting JSON objects to spreadsheet columns, the parser concatenates sub-keys into dot-notations, such as 'user.profile.name'.";
  } else if (pathname.includes("/jwt-decoder")) {
    relatedTools = [
      { name: "Bcrypt & Hash Generator", href: "/developers/hash-generator", category: "Security" },
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
      { name: "Regular Expression Tester", href: "/developers/regex-tester", category: "Developer" },
    ];
    didYouKnow = "JWTs (JSON Web Tokens) are split into Header, Payload, and Signature. The payload data is simply Base64Url encoded—not encrypted. Never place passwords or secrets inside JWTs.";
  } else if (pathname.includes("/hash-generator")) {
    relatedTools = [
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
      { name: "Regular Expression Tester", href: "/developers/regex-tester", category: "Developer" },
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
    ];
    didYouKnow = "Bcrypt utilizes a configurable key derivation work factor (cost) that increases the computation steps exponentially, protecting hashes against offline brute-force cracking attempts.";
  } else if (pathname.includes("/unix-epoch")) {
    relatedTools = [
      { name: "Unit Scaling Converter", href: "/converters/unit", category: "Converter" },
      { name: "JSON to CSV Converter", href: "/converters/json-to-csv", category: "Converter" },
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
    ];
    didYouKnow = "Unix Epoch time computes seconds elapsed since January 1, 1970. Legacy 32-bit systems will run out of integer bits to represent seconds on January 19, 2038 (the Year 2038 Problem).";
  } else if (pathname.includes("/regex-tester")) {
    relatedTools = [
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
      { name: "Case Converter Tool", href: "/text/case-converter", category: "Text" },
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
    ];
    didYouKnow = "In Regular Expressions, adding a question mark to a wildcard selector (e.g. '.*?') converts the operation to non-greedy, selecting the shortest matching sequence first.";
  } else if (pathname.includes("/docx-to-pdf")) {
    relatedTools = [
      { name: "JSON to CSV Converter", href: "/converters/json-to-csv", category: "Converter" },
      { name: "Unit Scaling Converter", href: "/converters/unit", category: "Converter" },
      { name: "Side-by-Side Diff Checker", href: "/text/diff-checker", category: "Text" },
    ];
    didYouKnow = "Microsoft Word .docx files are actually zipped folders containing XML documents. Mammoth extracts raw paragraphs from these XML layers directly inside your local browser.";
  } else {
    // Default home or compliance pages
    relatedTools = [
      { name: "JSON Suite Workstation", href: "/formatters/json-suite", category: "Format" },
      { name: "JWT Token Decoder", href: "/developers/jwt-decoder", category: "Security" },
      { name: "Word to PDF Converter", href: "/converters/docx-to-pdf", category: "Converter" },
      { name: "Unix Epoch Converter", href: "/converters/unix-epoch", category: "Converter" },
    ];
    didYouKnow = "ApexToolHub executes all utility conversions, hashing computations, and file parsings locally in your browser workspace. No document bytes ever traverse the network.";
  }

  return (
    <SidebarModules 
      relatedTools={relatedTools} 
      didYouKnow={didYouKnow} 
    />
  );
}
