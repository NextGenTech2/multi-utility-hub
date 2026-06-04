"use client";

import Link from "next/link";
import { Terminal, Home, ArrowLeft, RefreshCw, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center select-none animate-in fade-in duration-300">
      {/* Premium Glassmorphic Terminal Card */}
      <div className="w-full max-w-lg border border-border bg-card rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono text-muted tracking-tight">shell_process_error.sh</span>
          <div className="w-12" /> {/* spacer */}
        </div>

        {/* Terminal Body */}
        <div className="p-6 bg-zinc-950 font-mono text-left text-xs leading-relaxed space-y-3.5">
          <p className="text-zinc-500"># DevToolHub System Diagnostics</p>
          <div className="flex items-start gap-2">
            <span className="text-zinc-500">$</span>
            <span className="text-zinc-100">curl -I https://multiutilityhub.com/requested-endpoint</span>
          </div>
          <div className="space-y-1">
            <p className="text-red-400 font-bold">HTTP/1.1 404 NOT FOUND</p>
            <p className="text-zinc-400">Content-Type: text/plain; charset=UTF-8</p>
            <p className="text-zinc-400">Server: EdgeNetwork/3.5</p>
          </div>
          <p className="text-zinc-500"># Traceback log:</p>
          <p className="text-amber-500">
            [WARNING] The utility route requested does not resolve to an active controller.
            Ensure you did not input dynamic parameters directly in the URL bar.
          </p>
          <p className="text-zinc-500">
            $ <span className="text-zinc-300 animate-pulse">█</span>
          </p>
        </div>
      </div>

      {/* Message and Call to Actions */}
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mb-3">
        Page Not Found
      </h1>
      <p className="text-muted text-sm sm:text-base max-w-md leading-relaxed mb-8">
        The tool or page you are looking for has been relocated in our directory restructure or does not exist.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 w-full sm:w-auto">
        <Link
          href="/"
          className="min-h-[48px] px-6 rounded-md bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("toggle-sidebar"));
            }
          }}
          className="min-h-[48px] px-6 rounded-md border border-border bg-card text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Layers className="h-4 w-4 text-muted" />
          Browse Tool Directory
        </button>
      </div>
    </div>
  );
}
