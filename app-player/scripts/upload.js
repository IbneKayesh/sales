/* ============================================
   VideoVault — File Upload
   ============================================ */

// ── Upload progress modal ────────────────────
let uploadOverlay = null;

function createUploadOverlay() {
    if (uploadOverlay) return uploadOverlay;

    uploadOverlay = document.createElement("div");
    uploadOverlay.className = "upload-overlay hidden";
    uploadOverlay.innerHTML = `
        <div class="upload-modal">
            <div class="upload-modal-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span class="upload-modal-title">Uploading Files</span>
                <button class="upload-modal-close" id="uploadModalClose" aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="upload-file-list" id="uploadFileList"></div>
            <div class="upload-progress-area">
                <div class="upload-progress-bar">
                    <div class="upload-progress-fill" id="uploadProgressFill"></div>
                </div>
                <div class="upload-progress-info">
                    <span id="uploadProgressText">Preparing…</span>
                    <span id="uploadProgressPercent">0%</span>
                </div>
            </div>
            <div class="upload-actions">
                <button class="upload-btn upload-btn-cancel" id="uploadCancelBtn">Cancel</button>
                <button class="upload-btn upload-btn-done hidden" id="uploadDoneBtn">Done</button>
            </div>
        </div>
    `;
    document.body.appendChild(uploadOverlay);

    document.getElementById("uploadModalClose").addEventListener("click", hideUploadOverlay);
    document.getElementById("uploadCancelBtn").addEventListener("click", cancelUpload);
    document.getElementById("uploadDoneBtn").addEventListener("click", hideUploadOverlay);

    return uploadOverlay;
}

function showUploadOverlay() {
    createUploadOverlay();
    uploadOverlay.classList.remove("hidden");
}

function hideUploadOverlay() {
    if (uploadOverlay) uploadOverlay.classList.add("hidden");
    // Reset state
    uploadAbortController = null;
}

let uploadAbortController = null;

function cancelUpload() {
    if (uploadAbortController) {
        uploadAbortController.abort();
        uploadAbortController = null;
    }
    hideUploadOverlay();
    showToast("Upload cancelled", "error");
}

// ── Upload files to server ───────────────────
async function uploadFilesToServer(files) {
    if (!files || files.length === 0) return;

    showUploadOverlay();

    const fileList = document.getElementById("uploadFileList");
    const progressFill = document.getElementById("uploadProgressFill");
    const progressText = document.getElementById("uploadProgressText");
    const progressPercent = document.getElementById("uploadProgressPercent");
    const cancelBtn = document.getElementById("uploadCancelBtn");
    const doneBtn = document.getElementById("uploadDoneBtn");

    // Show file list
    fileList.innerHTML = "";
    for (const file of files) {
        const item = document.createElement("div");
        item.className = "upload-file-item";
        item.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span class="upload-file-name">${escapeHtml(file.name)}</span>
            <span class="upload-file-size">${formatSize(file.size)}</span>
        `;
        fileList.appendChild(item);
    }

    progressFill.style.width = "0%";
    progressText.textContent = "Uploading " + files.length + " file" + (files.length > 1 ? "s" : "") + "…";
    progressPercent.textContent = "0%";
    cancelBtn.classList.remove("hidden");
    doneBtn.classList.add("hidden");

    uploadAbortController = new AbortController();

    try {
        const formData = new FormData();
        for (const file of files) {
            formData.append("file", file, file.name);
        }

        const xhr = new XMLHttpRequest();

        await new Promise((resolve, reject) => {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    progressFill.style.width = pct + "%";
                    progressPercent.textContent = pct + "%";
                    progressText.textContent =
                        "Uploading " + formatSize(e.loaded) + " / " + formatSize(e.total);
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        resolve(result);
                    } catch (e) {
                        reject(new Error("Invalid response from server"));
                    }
                } else {
                    reject(new Error("Upload failed with status " + xhr.status));
                }
            });

            xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
            xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

            xhr.open("POST", "/api/upload");
            xhr.send(formData);

            // Store abort handle
            uploadAbortController.signal.addEventListener("abort", () => {
                xhr.abort();
            });
        }).then(async (result) => {
            // On success
            progressFill.style.width = "100%";
            progressPercent.textContent = "100%";
            const savedCount = result.saved ? result.saved.length : 0;
            progressText.textContent = savedCount + " file" + (savedCount !== 1 ? "s" : "") + " uploaded to " + (result.uploadDir || "server");

            cancelBtn.classList.add("hidden");
            doneBtn.classList.remove("hidden");

            showToast(savedCount + " file" + (savedCount !== 1 ? "s" : "") + " uploaded successfully!", "success");

            // Auto-refresh gallery to show newly uploaded videos
            await loadServerVideos();

            return result;
        });
    } catch (e) {
        if (e.message === "Upload cancelled") return;
        progressText.textContent = "Upload failed: " + e.message;
        progressFill.style.width = "0%";
        cancelBtn.classList.add("hidden");
        doneBtn.classList.remove("hidden");
        showToast("Upload failed: " + e.message, "error");
    }
}

// ── Trigger upload via hidden input ──────────
let uploadInput = null;

function getUploadInput() {
    if (uploadInput) return uploadInput;
    uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.id = "uploadInput";
    uploadInput.multiple = true;
    uploadInput.accept = "video/*,audio/*,.mp4,.webm,.ogg,.mov,.avi,.mkv,.m4v,.flv,.wmv";
    uploadInput.style.display = "none";
    document.body.appendChild(uploadInput);

    uploadInput.addEventListener("change", function () {
        const files = Array.from(this.files);
        if (files.length === 0) return;
        uploadFilesToServer(files);
        this.value = "";
    });

    return uploadInput;
}

function triggerUpload() {
    getUploadInput().click();
}

// ── Handle upload drag & drop ────────────────
// When files are dropped on the upload drop zone, upload them to the server
function handleUploadDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const overlay = document.getElementById("uploadDropOverlay");
    if (overlay) overlay.classList.add("hidden");

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    uploadFilesToServer(files);
}

// ── Helpers ──────────────────────────────────
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + " " + units[i];
}
