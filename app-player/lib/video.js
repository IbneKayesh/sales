const fs = require("fs");
const path = require("path");
const { MIME } = require("./config");

function serveVideo(filePath, req, res) {
    fs.stat(filePath, (err, s) => {
        if (err || !s.isFile()) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
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
            fs.createReadStream(filePath, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                "Content-Length": s.size,
                "Content-Type": type,
                "Accept-Ranges": "bytes",
            });
            fs.createReadStream(filePath).pipe(res);
        }
    });
}

module.exports = { serveVideo };
