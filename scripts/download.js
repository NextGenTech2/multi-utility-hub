const { execFile } = require("child_process");
const path = require("path");

// Usage: node scripts/download.js <youtube_url> [format: mp3|mp4] [quality: e.g. 320|1080|720|480]
const url = process.argv[2];
const format = process.argv[3] || "mp3";
const quality = process.argv[4] || "320";

if (!url) {
  console.log("\nUsage: node scripts/download.js <youtube_url> [format: mp3|mp4] [quality: e.g. 320|1080|720|480]");
  console.log("Example: node scripts/download.js \"https://www.youtube.com/watch?v=aqz-KE-bpKQ\" mp3 320\n");
  process.exit(1);
}

const workspaceRoot = "d:\\Users\\nirakumar\\Desktop\\Niraj\\AI\\Agy\\multi-utility-hub";
const ytDlpPath = path.join(workspaceRoot, "scripts", "yt-dlp.exe");
const ffmpegPath = "D:\\Users\\nirakumar\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe";

// Get Video ID from URL
let videoId = "";
const patterns = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
];
for (const pattern of patterns) {
  const match = url.match(pattern);
  if (match) {
    videoId = match[1];
    break;
  }
}

if (!videoId) {
  console.error("Error: Could not extract a valid 11-character YouTube Video ID from the provided URL.");
  process.exit(1);
}

const downloadsDir = "D:\\Users\\nirakumar\\Downloads";
const outputPattern = path.join(downloadsDir, `youtube_${videoId}_${quality}.%(ext)s`);

let args = [];
if (format.toLowerCase() === "mp3") {
  args = [
    "-x",
    "--audio-format", "mp3",
    "--audio-quality", `${quality}k`,
    "--ffmpeg-location", ffmpegPath,
    url,
    "-o", outputPattern,
    "--force-overwrites"
  ];
} else {
  args = [
    "-f", `bestvideo[height<=${quality}][vcodec^=avc1]+bestaudio[acodec^=mp4a]/bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`,
    "--merge-output-format", "mp4",
    "--ffmpeg-location", ffmpegPath,
    url,
    "-o", outputPattern,
    "--force-overwrites"
  ];
}

console.log(`\n[YouTube Downloader] Starting download...`);
console.log(`URL: ${url}`);
console.log(`Format: ${format.toUpperCase()}`);
console.log(`Quality: ${quality}`);
console.log(`Destination: ${downloadsDir}`);

const child = execFile(ytDlpPath, args);

child.stdout.on("data", (data) => {
  process.stdout.write(data);
});

child.stderr.on("data", (data) => {
  process.stderr.write(data);
});

child.on("close", (code) => {
  if (code === 0) {
    console.log(`\n[Success] YouTube media downloaded successfully to ${downloadsDir}`);
  } else {
    console.error(`\n[Error] Download failed with exit status ${code}`);
  }
});
