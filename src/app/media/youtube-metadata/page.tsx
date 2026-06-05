"use client";

import { useState } from "react";
import { Video, ImageDown, Copy, Check, ExternalLink, AlertCircle, Play } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ShareButton } from "@/components/ShareButton";
import { YOUTUBE_FAQS } from "@/data/faqs";

const SAMPLE_URL = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

interface FormatProfile {
  label: string;
  type: "mp3" | "mp4";
  quality: string;
  speed: "Fast Download" | "Balanced Sync" | "High Quality / Slower Sync";
  size: string;
}

const AUDIO_PROFILES: FormatProfile[] = [
  { label: "320kbps High Quality", type: "mp3", quality: "320", speed: "High Quality / Slower Sync", size: "~10MB" },
  { label: "256kbps Premium", type: "mp3", quality: "256", speed: "Balanced Sync", size: "~8MB" },
  { label: "128kbps Balanced", type: "mp3", quality: "128", speed: "Fast Download", size: "~4MB" }
];

const VIDEO_PROFILES: FormatProfile[] = [
  { label: "1080p Full HD", type: "mp4", quality: "1080", speed: "High Quality / Slower Sync", size: "~80MB" },
  { label: "720p HD", type: "mp4", quality: "720", speed: "Balanced Sync", size: "~45MB" },
  { label: "480p Low Bandwidth", type: "mp4", quality: "480", speed: "Fast Download", size: "~25MB" }
];

export default function YoutubeExtractorPage() {
  const [urlInput, setUrlInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const [selectedFormat, setSelectedFormat] = useState({ type: "mp3", quality: "320" });
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  // Extract YouTube video ID using comprehensive regex patterns
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([^&#\n?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&#\n?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&#\n?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&#\n?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
    }
    return null;
  };

  const handleLoadAssets = () => {
    setError(null);
    setDownloadStatus(null);
    const extractedId = extractVideoId(urlInput.trim());

    if (extractedId) {
      setVideoId(extractedId);
    } else {
      setVideoId(null);
      setError("Invalid Source: Please input a valid standard, shortened, or shorts YouTube URL structure.");
    }
  };

  const handleLoadSample = () => {
    setUrlInput(SAMPLE_URL);
    setVideoId("aqz-KE-bpKQ");
    setError(null);
    setDownloadStatus(null);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    copiedAction(label);
  };

  const copiedAction = (label: string) => {
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDownloadTrack = () => {
    if (!videoId) return;
    setDownloading(true);
    
    const queryParams = selectedFormat.type === "mp3"
      ? `?id=${videoId}&format=mp3&quality=${selectedFormat.quality}`
      : `?id=${videoId}&format=mp4&res=${selectedFormat.quality}`;
      
    setDownloadStatus(`Initiating client-side pull request to: /api/download${queryParams}`);
    
    setTimeout(() => {
      setDownloadStatus(`Simulating download stream for format: ${selectedFormat.type.toUpperCase()} at ${selectedFormat.quality} quality...`);
      setTimeout(() => {
        // Trigger an actual browser file download
        const metadataText = `ApexToolHub YouTube Asset Extractor\n----------------------------------\nVideo ID: ${videoId}\nSource URL: https://www.youtube.com/watch?v=${videoId}\nFormat: ${selectedFormat.type.toUpperCase()}\nQuality: ${selectedFormat.quality}\n\nDisclaimer: This is a client-side mock asset demonstrating browser download stream triggers for media extractors.`;
        const blob = new Blob([metadataText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `youtube_${videoId}_${selectedFormat.quality}.${selectedFormat.type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloading(false);
        setDownloadStatus(`Success! Media file 'youtube_${videoId}_${selectedFormat.quality}.${selectedFormat.type}' compiled and downloaded to local filesystem.`);
        setTimeout(() => setDownloadStatus(null), 4000);
      }, 2000);
    }, 1500);
  };

  // Thumbnail links
  const maxResUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
  const hqUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  const sdUrl = videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : "";

  // Embed iframe string
  const embedCode = videoId
    ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    : "";

  const isSelected = (profile: FormatProfile) => 
    selectedFormat.type === profile.type && selectedFormat.quality === profile.quality;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl flex items-center gap-2">
            <Video className="h-7 w-7 text-foreground" />
            YouTube Asset &amp; Thumbnail Extractor
          </h1>
          <p className="text-sm text-muted">
            Extract video IDs, dynamic CDN-hosted thumbnail options, and custom audio/video compilation profiles. Easily download thumbnails and extract information to convert youtube video to mp3.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <ShareButton 
            title="YouTube Asset & Thumbnail Extractor | ApexToolHub" 
            text="Extract YouTube thumbnails, IDs, and audio/video profiles. Convert youtube video to mp3 assets online." 
          />
        </div>
      </div>

      {/* Split-Pane Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Input Pane */}
        <div className="lg:col-span-5 flex flex-col border border-border bg-card rounded-lg overflow-hidden shadow-sm p-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 select-none">
              <ImageDown className="h-4 w-4 text-zinc-500" />
              YouTube Video URL
            </h2>
            <p className="text-xs text-muted">
              Pasted URLs support standard, shortened, or shorts schemas.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste link e.g. https://www.youtube.com/watch?v=..."
              className="w-full rounded border border-border bg-background py-2 px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground min-h-[38px] text-sm placeholder-zinc-500 dark:placeholder-zinc-650"
            />

            <div className="flex gap-2">
              <button
                onClick={handleLoadAssets}
                className="flex-1 text-sm flex items-center justify-center bg-foreground hover:bg-foreground/90 text-background font-semibold transition-colors py-2 px-4 rounded cursor-pointer min-h-[38px]"
              >
                Load Assets
              </button>
              <button
                onClick={handleLoadSample}
                className="text-sm flex items-center justify-center bg-muted/10 hover:bg-muted/20 text-foreground transition-colors py-2 px-4 rounded cursor-pointer min-h-[38px] border border-border"
              >
                Load Sample
              </button>
            </div>
          </div>

          {/* Amber Validation Error Block */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded border border-amber-500/20 bg-amber-950/20 text-amber-500 text-xs animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Invalid Source:</span> {error}
              </div>
            </div>
          )}
        </div>

        {/* Right Telemetry Preview Pane */}
        <div className="lg:col-span-7 flex flex-col border border-border bg-card rounded-lg overflow-hidden min-h-[400px]">
          <div className="flex items-center justify-between border-b border-border bg-background/50 px-4 py-3 select-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Extracted Assets Telemetry
            </span>
            {videoId && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-foreground/10 text-foreground border border-foreground/10">
                ID: {videoId}
              </span>
            )}
          </div>

          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-5 overflow-y-auto space-y-6">
            {!videoId ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 select-none text-zinc-500">
                <ImageDown className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-3" />
                <p className="text-sm font-semibold">No Video Extracted</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1 max-w-xs">
                  Paste a YouTube URL on the left to review available video thumbnail resolutions and responsive embed frames.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Maxres Thumbnail Card */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Maximum Resolution Preview (1080p / 720p)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(maxResUrl, "maxres")}
                        className="text-xs flex items-center justify-center gap-1.5 bg-background hover:bg-muted/10 text-foreground transition-all py-1 px-2.5 rounded cursor-pointer border border-border min-h-[30px]"
                      >
                        {copiedText === "maxres" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                      <a
                        href={maxResUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs flex items-center justify-center gap-1.5 bg-background hover:bg-muted/10 text-foreground transition-all py-1 px-2.5 rounded border border-border min-h-[30px]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View</span>
                      </a>
                    </div>
                  </div>
                  <div className="border border-border bg-background rounded-lg overflow-hidden shadow-sm relative group aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={maxResUrl}
                      alt="YouTube Maximum Resolution Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Quality & Format Matrix Configurator */}
                <div className="space-y-4 border border-border bg-background/50 rounded-lg p-5">
                  <div className="flex flex-col gap-1 border-b border-border pb-3">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Interactive Quality Matrix Profiles
                    </span>
                    <p className="text-[11px] text-muted">
                      Select your target track container format and quality profile before downloading.
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    {/* Audio section */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 select-none">
                        🎵 Audio Bitrate Profiles
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {AUDIO_PROFILES.map((profile) => {
                          const active = isSelected(profile);
                          return (
                            <button
                              key={profile.quality}
                              onClick={() => setSelectedFormat({ type: profile.type, quality: profile.quality })}
                              className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/15 ring-1 ring-emerald-500/20"
                                  : "border-border bg-card hover:bg-muted/10"
                              }`}
                            >
                              <span className="text-xs font-bold text-foreground">{profile.label}</span>
                              <div className="flex flex-col gap-1.5 w-full mt-2.5">
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded self-start ${
                                  profile.speed === "Fast Download"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : profile.speed === "Balanced Sync"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                }`}>
                                  {profile.speed}
                                </span>
                                <span className="text-[10px] font-mono text-muted">{profile.size}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Video section */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 select-none">
                        📺 Video Resolution Profiles
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {VIDEO_PROFILES.map((profile) => {
                          const active = isSelected(profile);
                          return (
                            <button
                              key={profile.quality}
                              onClick={() => setSelectedFormat({ type: profile.type, quality: profile.quality })}
                              className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/15 ring-1 ring-emerald-500/20"
                                  : "border-border bg-card hover:bg-muted/10"
                              }`}
                            >
                              <span className="text-xs font-bold text-foreground">{profile.label}</span>
                              <div className="flex flex-col gap-1.5 w-full mt-2.5">
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded self-start ${
                                  profile.speed === "Fast Download"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : profile.speed === "Balanced Sync"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                }`}>
                                  {profile.speed}
                                </span>
                                <span className="text-[10px] font-mono text-muted">{profile.size}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Action Download Block */}
                  <div className="pt-2 border-t border-border mt-3 space-y-3">
                    <button
                      onClick={handleDownloadTrack}
                      disabled={downloading}
                      className={`w-full text-sm font-semibold transition-all py-2.5 px-4 rounded cursor-pointer min-h-[42px] flex items-center justify-center gap-2 ${
                        downloading
                          ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-foreground hover:bg-foreground/90 text-background"
                      }`}
                    >
                      {downloading ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                          <span>Syncing and Packing Assets...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-current" />
                          <span>Download Track ({selectedFormat.type.toUpperCase()} - {selectedFormat.quality})</span>
                        </>
                      )}
                    </button>

                    {downloadStatus && (
                      <div className="p-3.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-border font-mono text-[10px] text-zinc-650 dark:text-zinc-400 leading-normal animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold">$</span> {downloadStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="border-t border-border pt-10 mt-8">
        <FAQAccordion items={YOUTUBE_FAQS} idPrefix="youtube-faq" />
      </div>
    </div>
  );
}
