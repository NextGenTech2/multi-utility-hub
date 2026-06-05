"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, Mail, Check, Link2 } from "lucide-react";

export interface RelatedTool {
  name: string;
  href: string;
  category?: string;
}

interface SidebarModulesProps {
  relatedTools?: RelatedTool[];
  didYouKnow?: string;
}

export function SidebarModules({ relatedTools = [], didYouKnow }: SidebarModulesProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
      {relatedTools.length > 0 && (
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
                  {tool.category && (
                    <span className="text-[9px] text-zinc-500 font-medium mt-0.5">
                      {tool.category}
                    </span>
                  )}
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Module 2: Did You Know? */}
      {didYouKnow && (
        <section className="bg-card/35 border border-border/80 rounded-xl p-4.5 space-y-2.5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5 select-none">
            <Lightbulb className="h-3.5 w-3.5 text-zinc-500" />
            Did You Know?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            {didYouKnow}
          </p>
        </section>
      )}

      {/* Module 3: Newsletter Signup */}
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
