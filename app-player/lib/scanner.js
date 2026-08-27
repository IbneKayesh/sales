const fs = require("fs");
const path = require("path");
const { VIDEO_EXTS } = require("./config");

function findVideos(dir, callback) {
    const results = [];
    const rootDir = dir;

    function scan(currentDir, done) {
        fs.readdir(currentDir, (err, files) => {
            if (err || !files) return done();
            let pending = files.length;
            if (pending === 0) return done();

            files.forEach((file) => {
                const fullPath = path.join(currentDir, file);
                fs.stat(fullPath, (err, stat) => {
                    if (err || !stat) {
                        if (--pending === 0) done();
                        return;
                    }
                    if (stat.isDirectory()) {
                        scan(fullPath, () => {
                            if (--pending === 0) done();
                        });
                    } else if (VIDEO_EXTS.has(path.extname(file).toLowerCase())) {
                        const relative = path.relative(rootDir, fullPath).replace(/\\/g, "/");
                        results.push({
                            name: file,
                            path: fullPath,
                            relativePath: relative,
                            size: stat.size,
                            lastModified: stat.mtimeMs,
                        });
                        if (--pending === 0) done();
                    } else {
                        if (--pending === 0) done();
                    }
                });
            });
        });
    }

    scan(dir, () => callback(results));
}

module.exports = { findVideos };
