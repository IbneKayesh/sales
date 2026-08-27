const fs = require("fs");
const path = require("path");
const { loadConfig } = require("./config");

const JSON_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
};

/**
 * Parse a multipart/form-data body and extract files.
 * Returns an array of { fieldName, filename, mimeType, data (Buffer) }.
 */
function parseMultipart(buffer, boundary) {
    const files = [];
    const boundaryBuf = Buffer.from("--" + boundary);
    const endBuf = Buffer.from("--" + boundary + "--");

    let pos = 0;

    // Find first boundary
    const firstBoundary = bufferIndexOf(buffer, boundaryBuf, pos);
    if (firstBoundary === -1) return files;
    pos = firstBoundary + boundaryBuf.length;

    while (pos < buffer.length) {
        // Skip CRLF after boundary
        if (buffer[pos] === 0x0d && buffer[pos + 1] === 0x0a) {
            pos += 2;
        } else {
            break;
        }

        // Read headers until double CRLF
        const headerEnd = bufferIndexOf(buffer, Buffer.from("\r\n\r\n"), pos);
        if (headerEnd === -1) break;

        const headersStr = buffer.slice(pos, headerEnd).toString("utf8");
        pos = headerEnd + 4; // skip \r\n\r\n

        // Parse Content-Disposition
        const nameMatch = headersStr.match(/name="([^"]+)"/);
        const filenameMatch = headersStr.match(/filename="([^"]+)"/);
        const contentTypeMatch = headersStr.match(/Content-Type:\s*(.+)/i);

        if (!filenameMatch) {
            // Not a file field — skip to next boundary
            const nextBoundary = bufferIndexOf(buffer, boundaryBuf, pos);
            if (nextBoundary === -1) break;
            pos = nextBoundary + boundaryBuf.length;
            continue;
        }

        // Find next boundary
        const nextBoundary = bufferIndexOf(buffer, boundaryBuf, pos);
        if (nextBoundary === -1) break;

        // File data is between pos and nextBoundary minus trailing CRLF (\r\n)
        let dataEnd = nextBoundary - 2; // remove \r\n before boundary
        if (dataEnd < pos) dataEnd = pos;

        const data = buffer.slice(pos, dataEnd);
        pos = nextBoundary + boundaryBuf.length;

        files.push({
            fieldName: nameMatch ? nameMatch[1] : "file",
            filename: filenameMatch[1],
            mimeType: contentTypeMatch ? contentTypeMatch[1].trim() : "application/octet-stream",
            data: data,
        });
    }

    return files;
}

/**
 * Find needle in buffer starting from offset. Returns offset or -1.
 */
function bufferIndexOf(buffer, needle, offset) {
    for (let i = offset; i <= buffer.length - needle.length; i++) {
        let found = true;
        for (let j = 0; j < needle.length; j++) {
            if (buffer[i + j] !== needle[j]) {
                found = false;
                break;
            }
        }
        if (found) return i;
    }
    return -1;
}

/**
 * Handle file upload via POST /api/upload
 */
function handleUpload(req, res) {
    const config = loadConfig();
    const uploadDir = config.uploadPath || path.join(process.env.USERPROFILE || process.env.HOME || ".", "Downloads");

    // Ensure upload directory exists
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    } catch (e) {
        res.writeHead(500, JSON_HEADERS);
        res.end(JSON.stringify({ error: "Cannot create upload directory: " + e.message }));
        return;
    }

    // Parse Content-Type header to get boundary
    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
        res.writeHead(400, JSON_HEADERS);
        res.end(JSON.stringify({ error: "Missing multipart boundary" }));
        return;
    }

    const boundary = boundaryMatch[1].trim();
    const chunks = [];

    req.on("data", (chunk) => {
        chunks.push(chunk);
    });

    req.on("end", () => {
        const body = Buffer.concat(chunks);

        if (body.length === 0) {
            res.writeHead(400, JSON_HEADERS);
            res.end(JSON.stringify({ error: "Empty request body" }));
            return;
        }

        // Max 2GB upload
        const MAX_SIZE = 2 * 1024 * 1024 * 1024;
        if (body.length > MAX_SIZE) {
            res.writeHead(413, JSON_HEADERS);
            res.end(JSON.stringify({ error: "File too large (max 2GB)" }));
            return;
        }

        try {
            const files = parseMultipart(body, boundary);

            if (files.length === 0) {
                res.writeHead(400, JSON_HEADERS);
                res.end(JSON.stringify({ error: "No files found in upload" }));
                return;
            }

            const saved = [];
            const errors = [];

            for (const file of files) {
                try {
                    // Sanitize filename — prevent path traversal
                    const safeName = path.basename(file.filename).replace(/[<>:"|?*]/g, "_");
                    let savePath = path.join(uploadDir, safeName);

                    // Avoid overwriting — append number if exists
                    let counter = 1;
                    while (fs.existsSync(savePath)) {
                        const ext = path.extname(safeName);
                        const base = path.basename(safeName, ext);
                        savePath = path.join(uploadDir, base + " (" + counter + ")" + ext);
                        counter++;
                    }

                    fs.writeFileSync(savePath, file.data);
                    saved.push({
                        name: path.basename(savePath),
                        path: savePath,
                        size: file.data.length,
                    });
                } catch (e) {
                    errors.push({ name: file.filename, error: e.message });
                }
            }

            res.writeHead(200, JSON_HEADERS);
            res.end(JSON.stringify({
                success: true,
                uploadDir: uploadDir,
                saved: saved,
                errors: errors.length > 0 ? errors : undefined,
            }));
        } catch (e) {
            res.writeHead(500, JSON_HEADERS);
            res.end(JSON.stringify({ error: "Upload failed: " + e.message }));
        }
    });

    req.on("error", (e) => {
        res.writeHead(500, JSON_HEADERS);
        res.end(JSON.stringify({ error: "Upload failed: " + e.message }));
    });
}

module.exports = { handleUpload };
