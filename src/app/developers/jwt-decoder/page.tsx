"use client";

import { useState } from "react";
import { Copy, Trash2, Check, AlertCircle, Key, RefreshCw, FileText } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { JWT_FAQS } from "@/data/faqs";


export default function WebTokensPage() {
  const [activeTab, setActiveTab] = useState<"jwt" | "base64" | "url">("jwt");
  
  // Input / Output States
  const [input, setInput] = useState("");
  const [jwtHeader, setJwtHeader] = useState<string>("");
  const [jwtPayload, setJwtPayload] = useState<string>("");
  const [jwtSignature, setJwtSignature] = useState("");
  const [outputText, setOutputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // JWT Expiry Tracker State
  const [jwtStatus, setJwtStatus] = useState<{
    type: "expired" | "active" | "issued" | null;
    message: string;
  }>({ type: null, message: "" });
  
  // Actions
  const [copied, setCopied] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleClear = () => {
    setInput("");
    setJwtHeader("");
    setJwtPayload("");
    setJwtSignature("");
    setOutputText("");
    setError(null);
    setJwtStatus({ type: null, message: "" });
  };

  const handleCopy = (val: string, setCopiedState: (v: boolean) => void) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // JWT Decoder Logic
  const handleDecodeJWT = () => {
    setError(null);
    setJwtHeader("");
    setJwtPayload("");
    setJwtSignature("");
    if (!input.trim()) return;

    try {
      const parts = input.trim().split(".");
      if (parts.length !== 3) {
        throw new Error("JWT must contain exactly 3 dot-separated parts (Header, Payload, Signature).");
      }

      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        return decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
      };

      const headerObj = JSON.parse(base64UrlDecode(parts[0]));
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));

      setJwtHeader(JSON.stringify(headerObj, null, 2));
      setJwtPayload(JSON.stringify(payloadObj, null, 2));
      setJwtSignature(parts[2]);

      // Calculate Expiry / Claims Tracker status
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payloadObj && typeof payloadObj.exp === "number") {
        const expDate = new Date(payloadObj.exp * 1000);
        const dateStr = expDate.toLocaleString();
        if (nowSeconds > payloadObj.exp) {
          setJwtStatus({
            type: "expired",
            message: `Token Expired on ${dateStr}`,
          });
        } else {
          setJwtStatus({
            type: "active",
            message: `Token Active (Expires on ${dateStr})`,
          });
        }
      } else if (payloadObj && typeof payloadObj.iat === "number") {
        const iatDate = new Date(payloadObj.iat * 1000);
        const dateStr = iatDate.toLocaleString();
        setJwtStatus({
          type: "issued",
          message: `Token Issued on ${dateStr}`,
        });
      } else {
        setJwtStatus({ type: null, message: "" });
      }
    } catch (e: any) {
      setError(e.message || "Failed to decode JWT string.");
      setJwtStatus({ type: null, message: "" });
    }
  };

  // Base64 Logic
  const handleBase64Encode = () => {
    setError(null);
    if (!input) return;
    try {
      // Safe Unicode base64 encoding
      const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
      setOutputText(encoded);
    } catch (e: any) {
      setError("Failed to Base64 encode text: " + e.message);
    }
  };

  const handleBase64Decode = () => {
    setError(null);
    if (!input) return;
    try {
      // Safe Unicode base64 decoding
      const decoded = decodeURIComponent(atob(input).split("").map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      setOutputText(decoded);
    } catch (e: any) {
      setError("Invalid Base64 format: " + e.message);
    }
  };

  // URL Encode/Decode Logic
  const handleURLEncode = () => {
    setError(null);
    if (!input) return;
    try {
      setOutputText(encodeURIComponent(input));
    } catch (e: any) {
      setError("Failed to URL encode input.");
    }
  };

  const handleURLDecode = () => {
    setError(null);
    if (!input) return;
    try {
      setOutputText(decodeURIComponent(input));
    } catch (e: any) {
      setError("Invalid URL encoding sequence: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Web Token &amp; Escape Utilities
          </h1>
          <p className="text-sm text-muted">
            Decode JWT headers and claims locally, encode Base64 tokens, or transform URL query parameters. Use this jwt token decode and jwt editor suite completely client-side.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="JWT Decoder & Secret Key Generator | DevToolHub" 
            text="Decode JWT tokens and generate cryptographically secure secret keys online free. 100% Client-side." 
          />
        </div>
      </div>


      {/* Tabs */}
      <div className="flex border-b border-border gap-4 select-none">
        <button
          onClick={() => {
            setActiveTab("jwt");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "jwt" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          JWT Decoder
        </button>
        <button
          onClick={() => {
            setActiveTab("base64");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "base64" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          Base64 Encoder/Decoder
        </button>
        <button
          onClick={() => {
            setActiveTab("url");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "url" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          URL Encoder/Decoder
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left Pane - Input */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Key className="h-4 w-4 text-zinc-500" />
              {activeTab === "jwt"
                ? "Token String (JWT)"
                : activeTab === "base64"
                ? "Raw / Encoded Base64 Text"
                : "Raw / Escaped URL text"}
            </span>
            <button
              onClick={handleClear}
              className="text-xs flex items-center gap-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Input
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeTab === "jwt"
                  ? "Paste JWT token string here (header.payload.signature)..."
                  : activeTab === "base64"
                  ? "Type content to encode OR paste Base64 string to decode..."
                  : "Type content to encode OR paste URL encoded string to decode..."
              }
              className="w-full h-full min-h-[350px] md:min-h-[450px] resize-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 font-mono text-sm text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder-zinc-500 dark:placeholder-zinc-650"
              spellCheck="false"
              translate="no"
            />
          </div>
          {/* Actions */}
          <div className="border-t border-border bg-background/50 px-4 py-3 flex flex-wrap gap-2 items-center">
            {activeTab === "jwt" ? (
              <button
                onClick={handleDecodeJWT}
                className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] flex items-center gap-1.5 text-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                Decode JWT
              </button>
            ) : activeTab === "base64" ? (
              <>
                <button
                  onClick={handleBase64Encode}
                  className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] text-foreground"
                >
                  Base64 Encode
                </button>
                <button
                  onClick={handleBase64Decode}
                  className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px]"
                >
                  Base64 Decode
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleURLEncode}
                  className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] text-foreground"
                >
                  URL Encode
                </button>
                <button
                  onClick={handleURLDecode}
                  className="px-4 py-2 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px]"
                >
                  URL Decode
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Pane - Output */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden">
          {activeTab === "jwt" ? (
            /* JWT Decoder Segmented Panel */
            <div className="flex-1 flex flex-col min-h-[350px] md:min-h-[450px]">
              {error ? (
                <div className="p-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex-1">
                  <div className="flex items-start gap-2.5 p-3.5 rounded border border-red-500/20 bg-red-950/20 text-red-400 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold tracking-tight">Decryption Failure</p>
                      <p className="mt-1 opacity-90">{error}</p>
                    </div>
                  </div>
                </div>
              ) : jwtPayload ? (
                <div className="flex-1 flex flex-col divide-y divide-border overflow-y-auto">
                  {/* JWT Expiry Status Banner */}
                  {jwtStatus.type && (
                    <div className={`px-4 py-3 border-b text-xs font-semibold font-mono flex items-center gap-2 select-all ${
                      jwtStatus.type === "expired"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : jwtStatus.type === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`} translate="no">
                      <span className="shrink-0 text-sm">
                        {jwtStatus.type === "expired" ? "🔴" : jwtStatus.type === "active" ? "🟢" : "🔵"}
                      </span>
                      <span>{jwtStatus.message}</span>
                    </div>
                  )}

                  {/* JWT Header Box */}
                  <div className="p-4 space-y-2 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-sky-400 uppercase tracking-wider select-none">
                      <span>Header (Algorithm &amp; Token Type)</span>
                      <button
                        onClick={() => handleCopy(jwtHeader, setCopiedHeader)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer min-h-[24px]"
                      >
                        {copiedHeader ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap" translate="no">
                      {jwtHeader}
                    </pre>
                  </div>
                  {/* JWT Payload Box */}
                  <div className="p-4 space-y-2 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-800 flex-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase tracking-wider select-none">
                      <span>Payload (Claims &amp; Data)</span>
                      <button
                        onClick={() => handleCopy(jwtPayload, setCopiedPayload)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer min-h-[24px]"
                      >
                        {copiedPayload ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap" translate="no">
                      {jwtPayload}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-center text-zinc-500 dark:text-zinc-650 p-8 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm">JWT segments will appear here after decoding.</p>
                </div>
              )}
            </div>
          ) : (
            /* Base64 & URL Output Box */
            <div className="flex-1 flex flex-col min-h-[350px] md:min-h-[450px]">
              <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Result
                </span>
                {outputText && (
                  <button
                    onClick={() => handleCopy(outputText, setCopied)}
                    className="text-xs flex items-center gap-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px] flex items-center"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Result
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 p-4 overflow-auto [color-scheme:light] dark:[color-scheme:dark]">
                {error ? (
                  <div className="flex items-start gap-2.5 p-3.5 rounded border border-red-500/20 bg-red-950/20 text-red-400 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold tracking-tight">Operation Failed</p>
                      <p className="mt-1 opacity-90">{error}</p>
                    </div>
                  </div>
                ) : outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    className="w-full h-full min-h-[300px] resize-none border-0 p-0 font-mono text-sm bg-transparent text-zinc-900 dark:text-zinc-300 focus:outline-none focus:ring-0"
                    translate="no"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-zinc-500 dark:text-zinc-650 p-8">
                    <p className="text-sm">Processed output will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={JWT_FAQS} idPrefix="jwt-faq" />
      </div>
    </div>
  );
}
