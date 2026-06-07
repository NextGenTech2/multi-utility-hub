const fs = require('fs');
const mp3 = fs.readFileSync('test_silent.mp3', 'base64');
const mp4 = fs.readFileSync('test_silent.mp4', 'base64');
let page = fs.readFileSync('src/app/media/youtube-metadata/page.tsx', 'utf8');
page = page.replace(/const SILENT_MP3_BASE64 = "[^"]*";/, 'const SILENT_MP3_BASE64 = "' + mp3 + '";');
page = page.replace(/const SILENT_MP4_BASE64 = "[^"]*";/, 'const SILENT_MP4_BASE64 = "' + mp4 + '";');
fs.writeFileSync('src/app/media/youtube-metadata/page.tsx', page);
console.log('Done updating base64.');
