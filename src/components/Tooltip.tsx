import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative w-full">
      {children}
      <div 
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-md bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100 opacity-0 transition-all duration-200 scale-95 origin-left group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 whitespace-normal w-48 z-50 shadow-xl"
      >
        {content}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900 dark:border-r-zinc-950" />
      </div>
    </div>
  );
}
