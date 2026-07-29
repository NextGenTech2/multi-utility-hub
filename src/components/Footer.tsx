import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/30 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
        
        {/* Mobile & Tablet Only Responsive Ad Banner Slot (Hidden on xl screens where the sticky desktop ad sidebar is visible) */}
        <div className="w-full max-w-[728px] mx-auto xl:hidden flex flex-col items-center justify-center p-3 border border-dashed border-border/80 bg-muted/10 rounded-lg text-center text-xs text-muted min-h-[90px] mb-2 animate-pulse">
          <span className="text-[9px] uppercase tracking-widest text-muted/65 mb-1">Advertisement</span>
          {/* AdSense Container Placeholder */}
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">AdSense Responsive Banner Slot</div>
          <p className="text-[10px] text-muted/50 mt-1">Hides automatically above 1280px (xl breakpoint) to prevent display overlap</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/about/" className="hover:text-foreground transition-colors duration-150">
            About Us
          </Link>
          <Link href="/contact/" className="hover:text-foreground transition-colors duration-150">
            Contact Us
          </Link>
          <Link href="/privacy/" className="hover:text-foreground transition-colors duration-150">
            Privacy Policy
          </Link>
          <Link href="/terms/" className="hover:text-foreground transition-colors duration-150">
            Terms of Service
          </Link>
        </div>

        <div className="text-center text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} ApexToolHub. All tools run 100% client-side with zero latency and complete privacy.</p>
        </div>
      </div>
    </footer>
  );
}
