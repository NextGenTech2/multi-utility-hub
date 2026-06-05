"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title || (typeof document !== "undefined" ? document.title : "ApexToolHub"),
      text: text || "Check out this awesome client-side utility tool!",
      url: url || (typeof window !== "undefined" ? window.location.href : ""),
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share or other error, fallback to copy if it's not abort error
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        fallbackCopy(shareData.url);
      }
    } else {
      fallbackCopy(shareData.url);
    }
  };

  const fallbackCopy = async (targetUrl: string) => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-700 active:scale-95 cursor-pointer shadow-sm"
      aria-label="Share this tool"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in duration-200" />
          <span className="text-emerald-500 font-medium">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
