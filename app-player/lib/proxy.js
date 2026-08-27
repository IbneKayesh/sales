const http = require("http");
const https = require("https");

function handleProxy(rawUrl, req, res) {
    try {
        const qIdx = rawUrl.indexOf("?");
        const params = new URLSearchParams(qIdx >= 0 ? rawUrl.substring(qIdx + 1) : "");
        const targetUrl = params.get("url");
        if (!targetUrl) {
            res.writeHead(400);
            res.end("Missing url");
            return;
        }

        const parsed = new URL(targetUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            res.writeHead(403);
            res.end("Forbidden protocol");
            return;
        }

        const proxyModule = parsed.protocol === "https:" ? https : http;
        const proxyOptions = {
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
            path: parsed.pathname + parsed.search,
            method: req.method,
            headers: {
                ...req.headers,
                host: parsed.host,
            },
        };

        const proxy = proxyModule.request(proxyOptions, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                ...proxyRes.headers,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            });
            proxyRes.pipe(res);
        });

        proxy.on("error", (e) => {
            res.writeHead(502);
            res.end("Proxy error: " + e.message);
        });

        req.pipe(proxy);
    } catch (e) {
        res.writeHead(500);
        res.end("Proxy error");
    }
}

module.exports = { handleProxy };
