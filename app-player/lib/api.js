const path = require("path");
const { VIDEO_EXTS, loadConfig, getLinkName } = require("./config");
const { findVideos } = require("./scanner");

const JSON_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
};

function handleConfig(req, res) {
    const config = loadConfig();
    res.writeHead(200, JSON_HEADERS);
    res.end(JSON.stringify(config));
}

function handleLibrary(req, res) {
    const config = loadConfig();
    const folders  = config.folders  || [];
    const files    = config.files    || [];
    const youtubes = config.youtubes || [];
    const rtsp     = config.rtsp     || [];
    const httpUrls = config.http     || [];
    const links    = config.links    || [];
    const library = {};
    let pending = 0;
    let totalSources = 0;

    function makeLinkEntries(arr, extraProps) {
        const result = [];
        arr.forEach((link) => {
            const url = typeof link === "string" ? link : link.url;
            const name =
                (typeof link === "object" && link.name) || getLinkName(url);
            result.push({
                name: name,
                path: url,
                size: 0,
                lastModified: Date.now(),
                isLink: true,
                ...extraProps,
            });
        });
        return result;
    }

    function sendLibrary(lib) {
        res.writeHead(200, JSON_HEADERS);
        res.end(JSON.stringify(lib));
    }

    function processSources() {
        if (files.length > 0) {
            const fileVideos = [];
            files.forEach((filePath) => {
                try {
                    const fullPath = path.resolve(filePath);
                    const stat = require("fs").statSync(fullPath);
                    if (
                        stat.isFile() &&
                        VIDEO_EXTS.has(path.extname(fullPath).toLowerCase())
                    ) {
                        fileVideos.push({
                            name: require("path").basename(fullPath),
                            path: "/file?path=" + encodeURIComponent(fullPath),
                            size: stat.size,
                            lastModified: stat.mtimeMs,
                        });
                    }
                } catch (e) {
                    /* skip */
                }
            });
            if (fileVideos.length > 0) {
                library["Files"] = {
                    path: "Configured Files",
                    videos: fileVideos,
                };
            }
        }

        if (youtubes.length > 0) {
            const vids = makeLinkEntries(youtubes, { isYouTube: true });
            if (vids.length > 0)
                library["YouTube"] = { path: "YouTube Videos", videos: vids };
        }
        if (rtsp.length > 0) {
            const vids = makeLinkEntries(rtsp, { isRTSP: true });
            if (vids.length > 0)
                library["RTSP"] = { path: "RTSP Streams", videos: vids };
        }
        if (httpUrls.length > 0) {
            const vids = makeLinkEntries(httpUrls, { isHTTP: true });
            if (vids.length > 0)
                library["HTTP"] = { path: "HTTP Streams", videos: vids };
        }
        if (links.length > 0) {
            const vids = makeLinkEntries(links, {});
            if (vids.length > 0)
                library["Links"] = { path: "Web Links", videos: vids };
        }

        sendLibrary(library);
    }

    // Process folders
    folders.forEach((folderPath) => {
        totalSources++;
        pending++;
        const folderName = require("path").basename(folderPath) || folderPath;
        findVideos(folderPath, (videos) => {
            if (videos.length > 0) {
                library[folderName] = {
                    path: folderPath,
                    videos: videos.map((v) => ({
                        name: v.name,
                        path:
                            "/video?path=" +
                            encodeURIComponent(v.name) +
                            "&folder=" +
                            encodeURIComponent(folderName),
                        size: v.size,
                        lastModified: v.lastModified,
                    })),
                };
            }
            if (--pending === 0) processSources();
        });
    });

    // No folders — process other sources directly
    if (totalSources === 0) {
        processSources();
    }
}

module.exports = { handleConfig, handleLibrary };
