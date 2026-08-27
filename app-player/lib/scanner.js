const fs = require("fs");
const path = require("path");
const { VIDEO_EXTS } = require("./config");

function findVideos(dir, callback) {
    const results = [];
    fs.readdir(dir, (err, files) => {
        if (err || !files) return callback(results);
        let pending = files.length;
        if (pending === 0) return callback(results);

        files.forEach((file) => {
            const fullPath = path.join(dir, file);
            fs.stat(fullPath, (err, stat) => {
                if (err || !stat) {
                    if (--pending === 0) callback(results);
                    return;
                }
                if (stat.isDirectory()) {
                    findVideos(fullPath, (subResults) => {
                        results.push(...subResults);
                        if (--pending === 0) callback(results);
                    });
                } else if (VIDEO_EXTS.has(path.extname(file).toLowerCase())) {
                    results.push({
                        name: file,
                        path: fullPath,
                        size: stat.size,
                        lastModified: stat.mtimeMs,
                    });
                    if (--pending === 0) callback(results);
                } else {
                    if (--pending === 0) callback(results);
                }
            });
        });
    });
}

module.exports = { findVideos };
