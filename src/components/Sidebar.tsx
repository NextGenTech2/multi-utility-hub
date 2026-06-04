"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X, Code2, Type, Percent, FileJson, Key, ShieldAlert, FileText, Hash, Clock, PercentCircle, RefreshCw, ChevronDown, ChevronRight, FileCode, FileSpreadsheet, Files, Video, ImageDown, TableProperties } from "lucide-react";

interface ToolItem {
  name: string;
  href: string;
  icon: any;
  desc: string;
}

interface GroupCategory {
  title: string;
  icon: any;
  items: ToolItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Collapse/Expand state for category groups
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "Developer Utilities": true,
    "Text & String Tools": true,
    "Math & Finance": true,
    "Document & File Utilities": true,
    "Media Utilities": true,
  });

  const toggleCategory = (title: string) => {
    setExpanded((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const categories: GroupCategory[] = [
    {
      title: "Developer Utilities",
      icon: Code2,
      items: [
        { name: "Data Converter Suite", href: "/developer/json-suite", icon: FileJson, desc: "Format, validate, and convert JSON, XML, and CSV" },
        { name: "JSON to CSV", href: "/developer/json-to-csv", icon: FileSpreadsheet, desc: "Flatten JSON arrays to tabular Excel formats" },
        { name: "CSV/Excel to JSON", href: "/developer/csv-to-json", icon: TableProperties, desc: "Convert spreadsheet data to clean JSON arrays" },
        { name: "Web Tokens", href: "/developer/web-tokens", icon: Key, desc: "JWT decode, Base64, URL encode" },
        { name: "Crypto/Hashing", href: "/developer/crypto-hashing", icon: Hash, desc: "MD5, SHA-256, Bcrypt generator" },
        { name: "Swagger Previewer", href: "/developer/swagger-preview", icon: FileCode, desc: "Render YAML to interactive API docs" },
      ],
    },
    {
      title: "Text & String Tools",
      icon: Type,
      items: [
        { name: "Diff Checker", href: "/text/diff-checker", icon: FileText, desc: "Side-by-side text diff engine" },
        { name: "Regex Tester", href: "/text/regex-tester", icon: ShieldAlert, desc: "Live regular expression parse" },
        { name: "Case Converter", href: "/text/case-converter", icon: Type, desc: "UPPER, lower, camel, snake case" },
      ],
    },
    {
      title: "Math & Finance",
      icon: Percent,
      items: [
        { name: "Epoch Converter", href: "/math/epoch-converter", icon: Clock, desc: "Unix timestamp date conversions" },
        { name: "Percent Calculator", href: "/math/percentage-calculator", icon: PercentCircle, desc: "Quick X% of Y calculations" },
        { name: "Unit Converter", href: "/math/unit-converter", icon: RefreshCw, desc: "Length, weight, data size conversion" },
      ],
    },
    {
      title: "Document & File Utilities",
      icon: Files,
      items: [
        { name: "Document Converter", href: "/document/converter", icon: FileText, desc: "Convert Word documents to PDF and vice versa" },
      ],
    },
    {
      title: "Media Utilities",
      icon: Video,
      items: [
        { name: "YouTube Asset Extractor", href: "/media/youtube-extractor", icon: ImageDown, desc: "Extract video IDs and CDNs thumbnails" },
      ],
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-card border-r border-border text-foreground w-full">
      {/* Sidebar Header (visible on mobile drawer) */}
      <div className="flex md:hidden h-16 items-center justify-between px-4 border-b border-border bg-background">
        <span className="font-sans font-bold tracking-tight text-md">Navigation Menu</span>
        <button
          onClick={() => setIsOpen(false)}
          className="h-10 w-10 flex items-center justify-center rounded-md border border-border bg-card text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const isCategoryExpanded = expanded[category.title];
          return (
            <div key={category.title} className="space-y-1.5">
              {/* Collapsible Header */}
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors cursor-pointer select-none rounded hover:bg-muted/5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  <CategoryIcon className="h-3.5 w-3.5" />
                  <span>{category.title}</span>
                </div>
                {isCategoryExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                )}
              </button>
              
              {/* Tool Links List */}
              {isCategoryExpanded && (
                <ul className="space-y-1 pl-1 border-l border-border/40 ml-3.5 transition-all">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all focus:outline-none focus:ring-1 focus:ring-foreground/20 min-h-[38px] group ${
                            isActive
                              ? "bg-foreground text-background font-semibold"
                              : "text-muted hover:text-foreground hover:bg-muted/10"
                          }`}
                        >
                          <ItemIcon className={`h-4 w-4 shrink-0 ${isActive ? "text-background" : "text-muted group-hover:text-foreground"}`} />
                          <div className="flex flex-col text-left">
                            <span className="leading-none">{item.name}</span>
                            <span className={`text-[10px] mt-0.5 font-normal leading-tight opacity-75 ${isActive ? "text-background/80" : "text-muted group-hover:text-muted"}`}>
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-60 lg:w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Sliding Body */}
          <div className="relative flex flex-col z-10 w-64 max-w-[80vw] h-full shadow-xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
