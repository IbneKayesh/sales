/* ============================================
   VideoVault — Thumbnails
   ============================================ */

let thumbQueue   = [];
let thumbRunning = false;

function enqueueThumbnail(entry, callback) {
    thumbQueue.push({ entry, callback });
    processThumbQueue();
}

function processThumbQueue() {
    if (thumbRunning || thumbQueue.length === 0) return;
    thumbRunning = true;
    const { entry, callback } = thumbQueue.shift();
    generateThumbnail(entry, () => {
        thumbRunning = false;
        callback();
        processThumbQueue();
    });
}

function generateThumbnail(entry, callback) {
    let settled = false;
    const finish = () => {
        if (settled) return;
        settled = true;
        try { v.src = ""; } catch (_) {}
        clearTimeout(timer);
        callback();
    };

    const timer = setTimeout(finish, 10000);

    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;
    v.src = entry.url;

    let dataReady = false;
    function onVideoReady() {
        if (dataReady || settled) return;
        dataReady = true;
        entry.duration = v.duration;
        const seekTo = Math.min(0.8, v.duration * 0.08);
        if (v.currentTime >= seekTo - 0.05) {
            captureFrame();
        } else {
            v.currentTime = seekTo;
        }
    }

    v.addEventListener("loadeddata", onVideoReady);
    v.addEventListener("canplay", onVideoReady);
    v.addEventListener("seeked", captureFrame);

    v.addEventListener("error", () => {
        if (!settled)
            showToast(
                "Could not generate thumbnail for: " + entry.name,
                "error",
                3000
            );
        finish();
    });

    function captureFrame() {
        if (settled) return;
        try {
            const c = document.createElement("canvas");
            c.width = 256;
            c.height = 144;
            c.getContext("2d").drawImage(v, 0, 0, 256, 144);
            let data = c.toDataURL("image/webp", 0.45);
            if (!data || data.length < 100) {
                data = c.toDataURL("image/jpeg", 0.45);
            }
            if (data && data.length > 500) {
                entry.thumb = data;
            }
        } catch (_) {}
        finish();
    }
}

// ── Lazy Thumbnail Observer ──────────────────
const thumbObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((obsEntry) => {
            if (!obsEntry.isIntersecting) return;
            const card = obsEntry.target;
            const id = Number(card.dataset.id);
            const videoEntry = allVideos.find((v) => v.id === id);
            if (!videoEntry || videoEntry.thumb || videoEntry.isLink || videoEntry.isRTSP || videoEntry.isHTTP) {
                thumbObserver.unobserve(card);
                return;
            }
            thumbObserver.unobserve(card);
            generateThumbnail(videoEntry, () => {
                const thumbDiv = card.querySelector(".card-thumb");
                if (!thumbDiv) return;
                if (videoEntry.thumb) {
                    const existingFb = thumbDiv.querySelector(".card-fallback");
                    if (existingFb) existingFb.remove();
                    const existingSkel = thumbDiv.querySelector(".card-skeleton");
                    if (existingSkel) existingSkel.remove();
                    const img = document.createElement("img");
                    img.src = videoEntry.thumb;
                    img.alt = videoEntry.title;
                    img.loading = "lazy";
                    img.draggable = false;
                    thumbDiv.insertBefore(img, thumbDiv.firstChild);
                }
            });
        });
    },
    { rootMargin: "200px" }
);
