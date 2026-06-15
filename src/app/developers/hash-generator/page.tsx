"use client";

import { useState } from "react";
import { Copy, Trash2, Check, ShieldAlert, Key, Hash, CheckSquare, RefreshCw } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { HASH_GENERATOR_FAQS } from "@/data/faqs";


export default function CryptoHashingPage() {
  const [activeTab, setActiveTab] = useState<"hash" | "bcrypt">("hash");
  const [input, setInput] = useState("");
  const [rounds, setRounds] = useState(10);
  const [generatingBcrypt, setGeneratingBcrypt] = useState(false);
  const [verifyingBcrypt, setVerifyingBcrypt] = useState(false);
  
  // Outputs
  const [md5Hash, setMd5Hash] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [bcryptHash, setBcryptHash] = useState("");
  
  // Bcrypt Verifier States
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  
  // Action Feedback
  const [copiedMd5, setCopiedMd5] = useState(false);
  const [copiedSha256, setCopiedSha256] = useState(false);
  const [copiedBcrypt, setCopiedBcrypt] = useState(false);

  const handleClear = () => {
    setInput("");
    setMd5Hash("");
    setSha256Hash("");
    setBcryptHash("");
    setVerifyPassword("");
    setVerifyHash("");
    setVerifyResult(null);
  };

  const handleCopy = (val: string, setCopiedState: (v: boolean) => void) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Pure JS MD5 algorithm
  const computeMD5 = (str: string): string => {
    var k = [], i = 0;
    for (; i < 64; ) {
      k[i] = Math.sin(++i) * 4294967296 | 0;
    }
    var h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    var s = [
      7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
      5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
      4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
      6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
    ];
    var words: number[] = [];
    var byteLength = str.length;
    for (i = 0; i < byteLength; i++) {
      words[i >> 2] |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
    }
    words[byteLength >> 2] |= 0x80 << ((byteLength % 4) * 8);
    var arrayLength = ((byteLength + 8) >> 6) + 1 << 4;
    while (words.length < arrayLength) {
      words.push(0);
    }
    words[arrayLength - 2] = byteLength * 8;
    
    for (var j = 0; j < words.length; j += 16) {
      var a = h[0], b = h[1], c = h[2], d = h[3];
      for (i = 0; i < 64; i++) {
        var f = 0, g = 0;
        if (i < 16) {
          f = (b & c) | (~b & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | (~d & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | ~d);
          g = (7 * i) % 16;
        }
        var temp = d;
        d = c;
        c = b;
        b = (b + rotateLeft((a + f + k[i] + words[j + g]) | 0, s[i])) | 0;
        a = temp;
      }
      h[0] = (h[0] + a) | 0;
      h[1] = (h[1] + b) | 0;
      h[2] = (h[2] + c) | 0;
      h[3] = (h[3] + d) | 0;
    }
    
    function rotateLeft(l: number, r: number) {
      return (l << r) | (l >>> (32 - r));
    }
    
    var result = "";
    for (i = 0; i < 4; i++) {
      for (var bIdx = 0; bIdx < 4; bIdx++) {
        var val = (h[i] >> (bIdx * 8)) & 0xff;
        result += (val < 16 ? "0" : "") + val.toString(16);
      }
    }
    return result;
  };

  const handleHash = async () => {
    if (!input) return;
    
    // MD5
    setMd5Hash(computeMD5(input));

    // SHA-256 (Web Crypto API)
    try {
      const msgBuffer = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setSha256Hash(hashHex);
    } catch (e) {
      setSha256Hash("Web Crypto digest failed.");
    }
  };

  // Bcrypt Logic
  const handleBcryptGenerate = () => {
    if (!input) return;
    setGeneratingBcrypt(true);
    setBcryptHash("");
    
    const worker = new Worker(new URL("./bcrypt.worker.ts", import.meta.url));
    worker.postMessage({
      action: "hash",
      password: input,
      rounds: rounds,
    });
    
    worker.onmessage = (e) => {
      const { success, result, error } = e.data;
      if (success) {
        setBcryptHash(result);
      } else {
        setBcryptHash(error || "Failed to generate Bcrypt hash.");
      }
      setGeneratingBcrypt(false);
      worker.terminate();
    };
    
    worker.onerror = () => {
      setBcryptHash("Worker execution failed.");
      setGeneratingBcrypt(false);
      worker.terminate();
    };
  };

  const handleBcryptVerify = () => {
    setVerifyResult(null);
    if (!verifyPassword || !verifyHash) return;
    setVerifyingBcrypt(true);
    
    const worker = new Worker(new URL("./bcrypt.worker.ts", import.meta.url));
    worker.postMessage({
      action: "verify",
      password: verifyPassword,
      hash: verifyHash,
    });
    
    worker.onmessage = (e) => {
      const { success, result } = e.data;
      if (success) {
        setVerifyResult(result);
      } else {
        setVerifyResult(false);
      }
      setVerifyingBcrypt(false);
      worker.terminate();
    };
    
    worker.onerror = () => {
      setVerifyResult(false);
      setVerifyingBcrypt(false);
      worker.terminate();
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Cryptography &amp; Hashing
          </h1>
          <p className="text-sm text-muted">
            Generate MD5, SHA-256 signatures locally, or compute and check Bcrypt password hashes. This md5 hash generator, sha256 generator and bcrypt hash generator operates 100% client-side.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="Crypto Hashing & Bcrypt Generator | ApexToolHub" 
            text="Generate MD5, SHA-256, and Bcrypt hashes online free. 100% Client-side." 
          />
        </div>
      </div>


      {/* Tabs */}
      <div className="flex border-b border-border gap-4 select-none">
        <button
          onClick={() => {
            setActiveTab("hash");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "hash" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          data-testid="hash-tab"
        >
          MD5 &amp; SHA-256 Signatures
        </button>
        <button
          onClick={() => {
            setActiveTab("bcrypt");
            handleClear();
          }}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "bcrypt" ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100" : "border-transparent text-muted hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          data-testid="bcrypt-tab"
        >
          Bcrypt Hashing &amp; Verification
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left Pane - Input */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden h-fit">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <Key className="h-4 w-4 text-zinc-500" />
              {activeTab === "hash" ? "Raw Input Text" : "Plaintext Password"}
            </span>
            <button
              onClick={handleClear}
              className="text-xs flex items-center gap-1 text-muted hover:text-foreground hover:bg-muted/10 transition-colors py-1 px-2 rounded cursor-pointer min-h-[32px]"
              data-testid="clear-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          <div className="p-4 space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeTab === "hash"
                  ? "Enter raw text string to hash..."
                  : "Enter raw password string to generate Bcrypt hash..."
              }
              className="w-full h-32 resize-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 font-mono text-sm text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-400 placeholder-zinc-500 dark:placeholder-zinc-650"
              spellCheck="false"
              translate="no"
              data-testid="raw-input-textarea"
            />
            {activeTab === "bcrypt" && (
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted font-sans font-semibold">Salt Rounds (Cost):</label>
                <input
                  type="number"
                  min="4"
                  max="16"
                  value={rounds}
                  onChange={(e) => setRounds(Math.min(16, Math.max(4, parseInt(e.target.value, 10) || 10)))}
                  className="w-20 rounded border border-border bg-background py-1.5 px-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[36px]"
                  translate="no"
                  data-testid="salt-rounds-input"
                />
              </div>
            )}
            
            <button
              onClick={activeTab === "hash" ? handleHash : handleBcryptGenerate}
              disabled={!input || generatingBcrypt}
              className="w-full py-2.5 text-sm font-semibold rounded border border-border bg-card hover:bg-muted/10 disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer min-h-[38px] text-foreground"
              data-testid="generate-hash-btn"
            >
              {generatingBcrypt ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-zinc-500" />
                  <span>Computing Bcrypt...</span>
                </div>
              ) : activeTab === "hash" ? (
                "Generate Signatures"
              ) : (
                "Generate Bcrypt Hash"
              )}
            </button>
          </div>
        </div>

        {/* Right Pane - Output / Actions */}
        <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden h-fit">
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 select-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Computed Results
            </span>
          </div>
          
          <div className="p-4 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 space-y-5 min-h-[350px] [color-scheme:light] dark:[color-scheme:dark]">
            {activeTab === "hash" ? (
              /* MD5 / SHA-256 Signatures View */
              <div className="space-y-4">
                {/* MD5 Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" />
                      MD5 Hash
                    </span>
                    {md5Hash && (
                      <button
                        onClick={() => handleCopy(md5Hash, setCopiedMd5)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer min-h-[24px]"
                        data-testid="md5-copy-btn"
                      >
                        {copiedMd5 ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    )}
                  </div>
                  <div
                    className="font-mono text-sm bg-white dark:bg-black/60 rounded p-2.5 break-all min-h-[40px] flex items-center text-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800"
                    translate="no"
                  >
                    {md5Hash || <span className="text-zinc-600 dark:text-zinc-700 font-sans text-xs">Awaiting input...</span>}
                  </div>
                </div>

                {/* SHA-256 Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" />
                      SHA-256 Hash
                    </span>
                    {sha256Hash && (
                      <button
                        onClick={() => handleCopy(sha256Hash, setCopiedSha256)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer min-h-[24px]"
                        data-testid="sha256-copy-btn"
                      >
                        {copiedSha256 ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    )}
                  </div>
                  <div
                    className="font-mono text-sm bg-white dark:bg-black/60 rounded p-2.5 break-all min-h-[40px] flex items-center text-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800"
                    translate="no"
                  >
                    {sha256Hash || <span className="text-zinc-600 dark:text-zinc-700 font-sans text-xs">Awaiting input...</span>}
                  </div>
                </div>
              </div>
            ) : (
              /* Bcrypt Block and Verification Panel */
              <div className="space-y-6">
                {/* Bcrypt Output Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" />
                      Bcrypt Hash
                    </span>
                    {bcryptHash && (
                      <button
                        onClick={() => handleCopy(bcryptHash, setCopiedBcrypt)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer min-h-[24px]"
                        data-testid="bcrypt-copy-btn"
                      >
                        {copiedBcrypt ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                    )}
                  </div>
                  <div
                    className="font-mono text-xs bg-white dark:bg-black/60 rounded p-2.5 break-all min-h-[40px] flex items-center text-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800"
                    translate="no"
                  >
                    {bcryptHash || <span className="text-zinc-600 dark:text-zinc-700 font-sans text-xs">Awaiting generation...</span>}
                  </div>
                </div>

                {/* Bcrypt Verify Form */}
                <div className="border-t border-zinc-800 pt-5 space-y-3">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <CheckSquare className="h-4 w-4 text-zinc-500" />
                    Verify Bcrypt Hash Match
                  </span>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <input
                        type="text"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full rounded border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black/60 py-2 px-3 text-zinc-900 dark:text-zinc-300 focus:outline-none focus:border-zinc-500 min-h-[36px]"
                        translate="no"
                        data-testid="verify-password-input"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={verifyHash}
                        onChange={(e) => setVerifyHash(e.target.value)}
                        placeholder="Enter Bcrypt hash to match against..."
                        className="w-full rounded border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black/60 py-2 px-3 text-zinc-900 dark:text-zinc-300 focus:outline-none focus:border-zinc-500 min-h-[36px] font-mono"
                        translate="no"
                        data-testid="verify-hash-input"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBcryptVerify}
                    disabled={!verifyPassword || !verifyHash || verifyingBcrypt}
                    className="w-full py-2 text-xs font-semibold rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:pointer-events-none transition-colors text-foreground cursor-pointer min-h-[36px]"
                    data-testid="verify-btn"
                  >
                    {verifyingBcrypt ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Compare Password & Hash"
                    )}
                  </button>

                  {verifyResult !== null && (
                    <div
                      className={`text-sm p-3.5 rounded border ${
                        verifyResult
                          ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-400"
                          : "border-red-500/20 bg-red-950/20 text-red-400"
                      }`}
                    >
                      {verifyResult ? (
                        <p className="font-bold tracking-tight">Match Success! Password matches the hash.</p>
                      ) : (
                        <p className="font-bold tracking-tight">Mismatch! Password does NOT match the hash.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={HASH_GENERATOR_FAQS} idPrefix="crypto-faq" />
      </div>
    </div>
  );
}
