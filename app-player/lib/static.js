const fs = require("fs");
const path = require("path");
const { MIME } = require("./config");

const ROOT_DIR = path.join(__dirname, "..");

function serveStatic(urlPath, req, res) {
    let file = path.join(ROOT_DIR, urlPath === "/" ? "index.html" : urlPath);
    if (!file.startsWith(ROOT_DIR)) {
        res.writeHead(403);
        res.end();
        return;
    }

    fs.stat(file, (err, s) => {
        if (err || !s.isFile()) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        const ext = path.extname(file).toLowerCase();
        const type = MIME[ext] || "application/octet-stream";

        if (req.headers.range) {
            const [a, b] = req.headers.range.replace("bytes=", "").split("-");
            const start = +a;
            const end = b ? +b : s.size - 1;
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${s.size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": type,
            });
            fs.createReadStream(file, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                "Content-Length": s.size,
                "Content-Type": type,
                "Accept-Ranges": "bytes",
            });
            fs.createReadStream(file).pipe(res);
        }
    });
}

module.exports = { serveStatic };
