const fs = require("fs");
const path = require("path");

const PORT = 3000;

const VIDEO_EXTS = new Set([
    ".mp4", ".webm", ".ogg", ".ogv", ".mov", ".avi",
    ".mkv", ".m4v", ".flv", ".wmv",
]);

const MIME = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogg": "video/ogg",
    ".ogv": "video/ogg",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".m4v": "video/x-m4v",
    ".flv": "video/x-flv",
    ".wmv": "video/x-ms-wmv",
};

function loadConfig() {
    try {
        const raw = fs.readFileSync(
            path.join(__dirname, "..", "config.json"),
            "utf8"
        );
        return JSON.parse(raw);
    } catch (e) {
        console.error("Could not read config.json:", e.message);
        return { folders: [] };
    }
}

function getLinkName(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
            return "YouTube: " + (u.searchParams.get("v") || u.pathname.split("/").pop());
        }
        if (u.protocol === "rtsp:") {
            const cam = u.pathname.split("/").filter(Boolean).pop() || u.hostname;
            return "RTSP: " + decodeURIComponent(cam);
        }
        const name = u.pathname.split("/").filter(Boolean).pop() || u.hostname;
        return decodeURIComponent(name).replace(/\.[^.]+$/, "");
    } catch (e) {
        return url.substring(0, 50);
    }
}

const CONFIG_PATH = path.join(__dirname, "..", "config.json");
let configWatcher = null;
let configDebounce = null;

function watchConfig(onChange) {
    if (configWatcher) return;
    try {
        configWatcher = fs.watch(CONFIG_PATH, (eventType) => {
            // Debounce — editors often write in rapid bursts
            clearTimeout(configDebounce);
            configDebounce = setTimeout(() => {
                try {
                    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
                    const parsed = JSON.parse(raw);
                    const summary = [];
                    if (parsed.folders?.length)  summary.push(parsed.folders.length + " folder(s)");
                    if (parsed.files?.length)    summary.push(parsed.files.length + " file(s)");
                    if (parsed.youtubes?.length) summary.push(parsed.youtubes.length + " YouTube(s)");
                    if (parsed.rtsp?.length)     summary.push(parsed.rtsp.length + " RTSP(s)");
                    if (parsed.http?.length)     summary.push(parsed.http.length + " HTTP(s)");
                    if (parsed.links?.length)    summary.push(parsed.links.length + " link(s)");
                    if (parsed.uploadPath)        summary.push("upload: " + parsed.uploadPath);
                    console.log("  ↻ config.json changed — " + (summary.join(", ") || "empty"));
                    if (onChange) onChange(parsed);
                } catch (e) {
                    console.error("  ⚠ config.json parse error:", e.message);
                }
            }, 300);
        });
        console.log("  👁 Watching config.json for changes");
    } catch (e) {
        console.error("  ⚠ Could not watch config.json:", e.message);
    }
}

module.exports = { PORT, VIDEO_EXTS, MIME, loadConfig, getLinkName, watchConfig };
