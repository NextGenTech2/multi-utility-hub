import { Metadata } from "next";
import { JsonToCsvClient } from "./JsonToCsvClient";

export const metadata: Metadata = {
  title: "JSON to CSV Converter | Online & Secure File Conversion | ApexToolHub",
  description: "Free and secure online JSON to CSV converter. Flatten nested JSON arrays into tabular CSV format instantly. 100% client-side, no data leaves your browser.",
  keywords: "json to csv, json to csv converter, flatten json, convert json to excel, json to tabular, online json tool",
};

export default function JsonToCsvPage() {
  return <JsonToCsvClient />;
}
