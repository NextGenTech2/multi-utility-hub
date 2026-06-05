"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Terminal, Home, RotateCcw, AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Runtime exception caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 text-center select-none animate-in fade-in duration-300">
      {/* Premium Glassmorphic Crash Card */}
      <div className="w-full max-w-lg border border-border bg-card rounded-xl overflow-hidden shadow-lg mb-8">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono text-muted tracking-tight">core_process_dump.log</span>
          <div className="w-12" /> {/* spacer */}
        </div>

        {/* Terminal Body */}
        <div className="p-6 bg-zinc-950 font-mono text-left text-xs leading-relaxed space-y-3.5">
          <p className="text-zinc-500"># ApexToolHub Kernel Panic</p>
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>UNCAUGHT_RUNTIME_EXCEPTION</span>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400">Message: {error.message || "An unexpected error occurred during execution."}</p>
            {error.digest && (
              <p className="text-zinc-500">Digest: {error.digest}</p>
            )}
          </div>
          <p className="text-zinc-500"># System recommendations:</p>
          <p className="text-amber-500">
            [ACTION] The client thread crashed due to an state mutation failure.
            Try reloading the component context, or navigate back to the main dashboard.
          </p>
          <p className="text-zinc-500">
            $ <span className="text-zinc-300 animate-pulse">█</span>
          </p>
        </div>
      </div>

      {/* Message and Call to Actions */}
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mb-3">
        Something went wrong!
      </h1>
      <p className="text-muted text-sm sm:text-base max-w-md leading-relaxed mb-8">
        Our workspace encountered an unexpected runtime exception. All your calculations remain private and never left your device.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 w-full sm:w-auto">
        <button
          onClick={reset}
          className="min-h-[48px] px-6 rounded-md bg-foreground text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-foreground/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Reload Component Context
        </button>
        <Link
          href="/"
          className="min-h-[48px] px-6 rounded-md border border-border bg-card text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Home className="h-4 w-4 text-muted" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
