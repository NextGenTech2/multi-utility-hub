"use client";

import Link from "next/link";
import { Menu, Terminal } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const toggleSidebar = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("toggle-sidebar"));
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger menu toggle button */}
          <button
            onClick={toggleSidebar}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-card hover:bg-muted/10 transition-colors text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-foreground/20 mr-1"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-foreground/20 rounded-md p-1 min-h-[36px]"
          >
            <Terminal className="h-5 w-5 stroke-[2.5]" />
            <span className="font-sans font-bold tracking-tight text-lg">DevToolHub</span>
          </Link>
        </div>

        {/* Theme Toggle (Right side) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
