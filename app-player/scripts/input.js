/* ============================================
   VideoVault — Input Handling
   ============================================ */

// ── Auto-load from server ────────────────────
async function loadServerVideos() {
    try {
        const res = await fetch("/api/library");
        if (!res.ok) return false;
        const library = await res.json();
        if (
            !library ||
            typeof library !== "object" ||
            Object.keys(library).length === 0
        )
            return false;

        emptyState.classList.add("hidden");
        loadingState.classList.remove("hidden");

        allVideos = [];
        currentIndex = -1;
        playerSection.classList.add("hidden");
        gallery.innerHTML = "";
        Object.values(objectURLs).forEach((u) => {
            try {
                URL.revokeObjectURL(u);
            } catch (_) {}
        });
        objectURLs = {};

        let total = 0;
        for (const source of Object.values(library)) {
            total += source.videos.length;
        }
        loadingLabel.textContent = "Loading videos\u2026";

        for (const [sourceName, sourceData] of Object.entries(library)) {
            for (const item of sourceData.videos) {
                const entry = {
                    id: videoIdCounter++,
                    name: item.name,
                    title: cleanTitle(item.name),
                    ext: getExt(item.name),
                    url: item.isLink
                        ? "/proxy?url=" + encodeURIComponent(item.path)
                        : item.path,
                    rawUrl: item.isLink ? item.path : null,
                    folder: sourceName,
                    folderPath: sourceData.path,
                    lastModified: item.lastModified || Date.now(),
                    size: item.size || 0,
                    duration: 0,
                    thumb: null,
                    isLink: item.isLink || false,
                    isYouTube: item.isYouTube || false,
                    isRTSP: item.isRTSP || false,
                    isHTTP: item.isHTTP || false,
                };
                allVideos.push(entry);
            }
        }

        progressText.textContent = total + " of " + total;
        loadingProgressFill.style.width = "100%";
        setTimeout(() => {
            loadingState.classList.add("hidden");
            mainContent.classList.remove("hidden");
            const sourceCount = Object.keys(library).length;
            videoCount.textContent =
                total +
                " video" +
                (total !== 1 ? "s" : "") +
                " in " +
                sourceCount +
                " source" +
                (sourceCount !== 1 ? "s" : "");
            sortAndRender(true);
        }, 200);

        return true;
    } catch (_) {
        return false;
    }
}

// ── Folder Input ──────────────────────────────
folderInput.addEventListener("change", function () {
    const files = Array.from(this.files).filter((f) =>
        f.type.startsWith("video/")
    );
    if (files.length === 0) return;

    emptyState.classList.add("hidden");
    loadingState.classList.remove("hidden");
    mainContent.classList.add("hidden");
    loadingLabel.textContent = "Scanning folder for media\u2026";

    allVideos = [];
    currentIndex = -1;
    video.src = "";
    playerSection.classList.add("hidden");
    playerEmpty.classList.remove("hidden");
    videoTitle.textContent = "No video selected";
    videoMeta.textContent = "";
    playerWatchedBadge.classList.add("hidden");
    navPrev.classList.add("hidden");
    navNext.classList.add("hidden");
    gallery.innerHTML = "";
    Object.values(objectURLs).forEach((u) => {
        try {
            URL.revokeObjectURL(u);
        } catch (_) {}
    });
    objectURLs = {};

    const total = files.length;

    files.forEach((file) => {
        const entry = {
            id: videoIdCounter++,
            file: file,
            name: file.name,
            title: cleanTitle(file.name),
            ext: getExt(file.name),
            url: URL.createObjectURL(file),
            lastModified: file.lastModified,
            duration: 0,
            thumb: null,
        };
        objectURLs[file.name] = entry.url;
        allVideos.push(entry);
    });

    this.value = "";

    loadingLabel.textContent = "Loading videos\u2026";
    progressText.textContent = total + " of " + total;
    loadingProgressFill.style.width = "100%";
    setTimeout(() => {
        loadingState.classList.add("hidden");
        mainContent.classList.remove("hidden");
        videoCount.textContent =
            total + " video" + (total !== 1 ? "s" : "");
        sortAndRender();
    }, 250);
});

// ── Drag & Drop ───────────────────────────────
document.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dropOverlay.classList.remove("hidden");
});

document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
});

document.addEventListener("dragleave", (e) => {
    if (
        e.relatedTarget === null ||
        !document.body.contains(e.relatedTarget)
    ) {
        dropOverlay.classList.add("hidden");
    }
});

document.addEventListener("drop", (e) => {
    e.preventDefault();
    dropOverlay.classList.add("hidden");
    const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("video/")
    );
    if (files.length === 0) {
        showToast("No video files found in the drop.", "error");
        return;
    }
    loadDroppedFiles(files);
});

function loadDroppedFiles(files) {
    emptyState.classList.add("hidden");
    loadingState.classList.remove("hidden");
    mainContent.classList.add("hidden");
    loadingLabel.textContent = "Scanning folder for media\u2026";

    let added = 0;
    const total = files.length;

    files.forEach((file) => {
        if (allVideos.some((v) => v.name === file.name)) {
            added++;
            return;
        }
        const entry = {
            id: videoIdCounter++,
            file: file,
            name: file.name,
            title: cleanTitle(file.name),
            ext: getExt(file.name),
            url: URL.createObjectURL(file),
            lastModified: file.lastModified,
            duration: 0,
            thumb: null,
        };
        objectURLs[file.name] = entry.url;
        allVideos.push(entry);
        added++;
    });

    const newCount = added;
    loadingLabel.textContent = "Loading videos\u2026";
    progressText.textContent = newCount + " of " + newCount;
    loadingProgressFill.style.width = "100%";
    setTimeout(() => {
        loadingState.classList.add("hidden");
        mainContent.classList.remove("hidden");
        videoCount.textContent =
            allVideos.length +
            " video" +
            (allVideos.length !== 1 ? "s" : "");
        sortAndRender(true);
        showToast(
            newCount +
                " video" +
                (newCount !== 1 ? "s" : "") +
                " added",
            "success"
        );
    }, 200);
}

// ── Dropdown Toggle ──────────────────────────
dropdownToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("hidden");
    addDropdown.classList.toggle("open");
});

document.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");
    addDropdown.classList.remove("open");
});

dropdownMenu.addEventListener("click", (e) => {
    e.stopPropagation();
});

// ── Upload Button ───────────────────────────
uploadBtn.addEventListener("click", () => {
    triggerUpload();
    dropdownMenu.classList.add("hidden");
    addDropdown.classList.remove("open");
});

// ── Add More Button ──────────────────────────
addMoreInput.addEventListener("change", function () {
    const files = Array.from(this.files).filter((f) =>
        f.type.startsWith("video/")
    );
    if (files.length === 0) return;
    if (allVideos.length === 0) {
        folderInput.files = this.files;
        folderInput.dispatchEvent(new Event("change"));
    } else {
        loadDroppedFiles(files);
    }
    this.value = "";
});
