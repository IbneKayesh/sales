const http = require("http");
const fs = require("fs");
const path = require("path");
const { PORT, VIDEO_EXTS, loadConfig, watchConfig } = require("./lib/config");
const { serveVideo } = require("./lib/video");
const { handleProxy } = require("./lib/proxy");
const { handleConfig, handleLibrary } = require("./lib/api");
const { serveStatic } = require("./lib/static");

http.createServer((req, res) => {
    const rawUrl = req.url;
    const urlPath = decodeURIComponent(req.url.split("?")[0]);

    // ── API Routes ─────────────────────────────
    if (urlPath === "/api/config")  return handleConfig(req, res);
    if (urlPath === "/api/library") return handleLibrary(req, res);

    // ── Serve individual file from config ──────
    if (urlPath === "/file") {
        try {
            const params = new URLSearchParams(rawUrl.split("?")[1] || "");
            const filePath = params.get("path");
            if (!filePath) { res.writeHead(400); res.end("Missing path"); return; }
            const fullPath = path.resolve(filePath);
            if (!VIDEO_EXTS.has(path.extname(fullPath).toLowerCase())) {
                res.writeHead(403); res.end("Forbidden"); return;
            }
            serveVideo(fullPath, req, res);
        } catch (e) {
            res.writeHead(500); res.end("Error");
        }
        return;
    }

    // ── Proxy external video link ──────────────
    if (urlPath === "/proxy") {
        handleProxy(rawUrl, req, res);
        return;
    }

    // ── Serve video by folder + filename ───────
    if (urlPath === "/video") {
        try {
            const params = new URLSearchParams(rawUrl.split("?")[1] || "");
            const fileName = params.get("path");
            const folderName = params.get("folder");
            if (!fileName || !folderName) { res.writeHead(400); res.end("Missing params"); return; }

            const config = loadConfig();
            const folder = config.folders.find(
                (f) => path.basename(f) === folderName || f === folderName
            );
            if (!folder) { res.writeHead(404); res.end("Folder not found"); return; }

            const filePath = path.join(folder, fileName);
            if (!VIDEO_EXTS.has(path.extname(filePath).toLowerCase())) {
                res.writeHead(403); res.end("Forbidden"); return;
            }
            serveVideo(filePath, req, res);
        } catch (e) {
            res.writeHead(500); res.end("Error");
        }
        return;
    }

    // ── Static Files ───────────────────────────
    serveStatic(urlPath, req, res);
}).listen(PORT, "0.0.0.0", () => {
    const os = require("os");
    const interfaces = os.networkInterfaces();
    let localIP = "localhost";
    const virtualPrefixes = ["192.168.240.1", "172.17.", "172.18.", "172.19."];
    let candidates = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                const isVirtual = virtualPrefixes.some((p) =>
                    iface.address.startsWith(p)
                );
                if (isVirtual) continue;
                candidates.push(iface.address);
            }
        }
    }
    if (candidates.length > 0) {
        const best = candidates.find(
            (ip) =>
                ip.startsWith("192.168.") &&
                !ip.endsWith(".1") &&
                !ip.endsWith(".254")
        );
        localIP = best || candidates[0];
    }
    watchConfig();
    console.log("");
    console.log("  ╔══════════════════════════════════════╗");
    console.log("  ║         VideoVault is running         ║");
    console.log("  ╠══════════════════════════════════════╣");
    console.log(
        "  ║  Local:   http://localhost:" + PORT + "        ║"
    );
    console.log(
        "  ║  Network: http://" + localIP + ":" + PORT + "  ║"
    );
    console.log("  ╚══════════════════════════════════════╝");
    console.log("");
});
