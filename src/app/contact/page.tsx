"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot field
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // client-side validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus("error");
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Please verify your connection.");
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact DevToolHub",
    "description": "Secure form to submit feedback, bug reports, and utility proposals to DevToolHub.",
    "url": "https://multi-utility-hub.vercel.app/contact",
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "developer support",
      "email": "support@multi-utility-hub.vercel.app",
      "availableLanguage": "English"
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Contact Us
        </h1>
        <p className="text-sm text-muted-foreground">
          Have a feature request, spotted a bug, or want to share feedback? Send a secure message directly to our desk.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xl relative overflow-hidden">
        {status === "success" ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle className="h-16 w-16 text-emerald-550 dark:text-emerald-550" />
            <h2 className="text-xl font-bold text-foreground">Message Sent!</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Thank you for reaching out. We appreciate your feedback and will review your submission shortly.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-zinc-700 cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field - visually hidden, autocomplete off, tabIndex -1 */}
            <div style={{ display: "none" }} aria-hidden="true">
              <label htmlFor="website">Leave this field blank if you are human</label>
              <input
                id="website"
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-700 transition-all placeholder-zinc-550"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-700 transition-all placeholder-zinc-550"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="Bug report, feature proposal, etc."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-700 transition-all placeholder-zinc-550"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your query or suggestions here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-zinc-700 transition-all placeholder-zinc-550 resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-red-500/25 bg-red-500/5 text-xs text-red-500 animate-in fade-in duration-200">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-200 text-zinc-100 dark:text-zinc-950 font-semibold rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-800 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              {status === "loading" ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
