const http = require("http");
const url = require("url");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PORT = 3001;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  // Health check endpoint
  if (parsedUrl.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  // Download endpoint
  if (parsedUrl.pathname === "/download") {
    const videoId = parsedUrl.query.id;
    const format = parsedUrl.query.format || "mp3";
    const quality = parsedUrl.query.quality || parsedUrl.query.res || "320";

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid or missing video ID." }));
      return;
    }

    const workspaceRoot = "d:\\Users\\nirakumar\\Desktop\\Niraj\\AI\\Agy\\multi-utility-hub";
    const ytDlpPath = path.join(workspaceRoot, "scripts", "yt-dlp.exe");
    const ffmpegPath = "D:\\Users\\nirakumar\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.1-full_build\\bin\\ffmpeg.exe";

    const tempDir = path.join(workspaceRoot, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const outputFilename = `yt_${videoId}_${quality}_${Date.now()}`;
    const outputPattern = path.join(tempDir, `${outputFilename}.%(ext)s`);

    let args = [];
    if (format === "mp3") {
      args = [
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", `${quality}k`,
        "--ffmpeg-location", ffmpegPath,
        `https://www.youtube.com/watch?v=${videoId}`,
        "-o", outputPattern,
        "--force-overwrites"
      ];
    } else {
      args = [
        "-f", `bestvideo[height<=${quality}][vcodec^=avc1]+bestaudio[acodec^=mp4a]/bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`,
        "--merge-output-format", "mp4",
        "--ffmpeg-location", ffmpegPath,
        `https://www.youtube.com/watch?v=${videoId}`,
        "-o", outputPattern,
        "--force-overwrites"
      ];
    }

    console.log(`[Server] Starting download for ${videoId} (${format}, ${quality})...`);

    const child = spawn(ytDlpPath, args);

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Server] yt-dlp failed with exit code ${code}`);
        if (!res.writableEnded) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Download failed inside yt-dlp." }));
        }
        return;
      }

      // Find the file
      try {
        const files = fs.readdirSync(tempDir);
        const downloadedFile = files.find(file => file.startsWith(outputFilename));

        if (!downloadedFile) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "File not found on disk." }));
          return;
        }

        const downloadedFilePath = path.join(tempDir, downloadedFile);
        const fileStat = fs.statSync(downloadedFilePath);

        res.writeHead(200, {
          "Content-Type": format === "mp3" ? "audio/mpeg" : "video/mp4",
          "Content-Length": fileStat.size,
          "Content-Disposition": `attachment; filename="youtube_${videoId}_${quality}.${format}"`,
        });

        const readStream = fs.createReadStream(downloadedFilePath);
        readStream.pipe(res);

        readStream.on("close", () => {
          fs.unlinkSync(downloadedFilePath);
          console.log(`[Server] Successfully streamed and deleted ${downloadedFile}`);
        });
      } catch (err) {
        console.error("[Server] Error sending file:", err);
        if (!res.writableEnded) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to send file." }));
        }
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`\n[YouTube Downloader Server] Running at http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Downloads: http://localhost:${PORT}/download?id=<id>&format=<format>&quality=<quality>\n`);
});
