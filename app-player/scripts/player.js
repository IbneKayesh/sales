/* ============================================
   VideoVault — Player
   ============================================ */

// ── Play Video ────────────────────────────────
function playVideo(i) {
    if (i < 0 || i >= allVideos.length) return;

    if (currentIndex >= 0 && allVideos[currentIndex]) {
        savePosition(allVideos[currentIndex].id, video.currentTime);
    }

    currentIndex = i;
    const entry = allVideos[i];

    playerSection.classList.remove("hidden");
    playerEmpty.classList.add("hidden");

    // YouTube links — use iframe embed
    const isYT =
        entry.isLink && (entry.isYouTube || isYouTubeUrl(entry.rawUrl || entry.url));
    if (isYT) {
        const embedUrl = getYouTubeEmbedUrl(entry.rawUrl || entry.url);
        if (embedUrl) {
            video.pause();
            video.classList.add("hidden");
            controls.classList.add("hidden");
            youtubeFrame.src = embedUrl;
            youtubeFrame.classList.remove("hidden");
        }
    } else {
        // Regular video
        youtubeFrame.src = "";
        youtubeFrame.classList.add("hidden");
        video.classList.remove("hidden");
        controls.classList.remove("hidden");
        video.src = entry.url;
        video.load();
    }

    requestAnimationFrame(() => {
        playerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    videoTitle.textContent = entry.title;
    videoMeta.textContent = entry.ext;
    updatePlayerFavBtn();
    updatePlayerWatchedBadge();

    function onMeta() {
        video.removeEventListener("loadedmetadata", onMeta);
        video.removeEventListener("error", onError);
        entry.duration = video.duration;
        videoMeta.textContent =
            fmtTime(video.duration) + "  ·  " + entry.ext;
        video.play().catch(() => {});
        updatePlayIcon();
        sortAndRender();
    }

    function onError() {
        video.removeEventListener("error", onError);
        video.removeEventListener("loadedmetadata", onMeta);
        showToast("Failed to load: " + entry.title, "error");
    }
    video.addEventListener("error", onError);
    video.addEventListener("loadedmetadata", onMeta);

    navPrev.classList.toggle("hidden", i <= 0);
    navNext.classList.toggle(
        "hidden",
        i >= allVideos.length - 1
    );
}

// ── Play / Pause ──────────────────────────────
function togglePlay() {
    if (!video.src || !playerEmpty.classList.contains("hidden")) return;
    if (video.paused) {
        video.play().catch(() => {});
        showCenterFeedback(
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><polygon points="6,3 20,12 6,21"/></svg>'
        );
    } else {
        video.pause();
        showCenterFeedback(
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">' +
            '<rect x="5" y="3" width="4" height="18" rx="1"/>' +
            '<rect x="15" y="3" width="4" height="18" rx="1"/>' +
            "</svg>"
        );
    }
}

function updatePlayIcon() {
    const playing = !video.paused;
    playPauseBtn
        .querySelector(".icon-play")
        .classList.toggle("hidden", playing);
    playPauseBtn
        .querySelector(".icon-pause")
        .classList.toggle("hidden", !playing);
}

// ── Video Events ──────────────────────────────
video.addEventListener("play", updatePlayIcon);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("ended", () => {
    updatePlayIcon();
    if (currentIndex >= 0 && allVideos[currentIndex]) {
        const entry = allVideos[currentIndex];
        markWatched(entry.name);
        saveProgress(entry.id, 100);
        sortAndRender();
        updatePlayerWatchedBadge();
    }
    if (!video.loop && currentIndex < allVideos.length - 1) {
        playVideo(currentIndex + 1);
    }
});

video.addEventListener("click", (e) => {
    if (e.target === video && !touchHandled) togglePlay();
});
video.addEventListener("dblclick", (e) => {
    if (e.target === video && !touchHandled) toggleFullscreen();
});

// ── Controls Event Binding ────────────────────
playPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
});

// Navigation
prevVidBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex > 0) playVideo(currentIndex - 1);
});
nextVidBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex < allVideos.length - 1)
        playVideo(currentIndex + 1);
});
navPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex > 0) playVideo(currentIndex - 1);
});
navNext.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex < allVideos.length - 1)
        playVideo(currentIndex + 1);
});

// Skip
backBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.currentTime = Math.max(0, video.currentTime - 10);
});
fwdBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.currentTime = Math.min(
        video.duration || 0,
        video.currentTime + 10
    );
});

// ── Time & Progress ───────────────────────────
video.addEventListener("timeupdate", () => {
    if (isSeeking) return;
    currentTimeEl.textContent = fmtTime(video.currentTime);
    const pct = video.duration
        ? (video.currentTime / video.duration) * 100
        : 0;
    progressPlayed.style.width = pct + "%";
    if (currentIndex >= 0) {
        savePosition(allVideos[currentIndex].id, video.currentTime);
        saveProgress(allVideos[currentIndex].id, pct);
    }
});

video.addEventListener("loadedmetadata", () => {
    durationEl.textContent = fmtTime(video.duration);
});

video.addEventListener("progress", () => {
    if (video.buffered.length > 0) {
        const buffEnd = video.buffered.end(
            video.buffered.length - 1
        );
        const pct = video.duration
            ? (buffEnd / video.duration) * 100
            : 0;
        progressBuffered.style.width = pct + "%";
    }
});

// ── Seek ──────────────────────────────────────
function seekFromEvent(e) {
    const rect = progressWrap.getBoundingClientRect();
    const pct = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    video.currentTime = pct * (video.duration || 0);
    progressPlayed.style.width = pct * 100 + "%";
}

progressWrap.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isSeeking = true;
    progressWrap.classList.add("seeking");
    seekFromEvent(e);
    const onMove = (ev) => seekFromEvent(ev);
    const onUp = () => {
        isSeeking = false;
        progressWrap.classList.remove("seeking");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
});

progressWrap.addEventListener("mousemove", (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pct = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const time = pct * (video.duration || 0);
    progressTooltip.textContent = fmtTime(time);
    progressTooltip.style.left = e.clientX - rect.left + "px";
});

// ── Volume ────────────────────────────────────
muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    updateVolumeIcon();
});

volumeSlider.addEventListener("input", () => {
    video.volume = parseFloat(volumeSlider.value);
    video.muted = video.volume === 0;
    updateVolumeIcon();
});

function updateVolumeIcon() {
    const muted = video.muted || video.volume === 0;
    muteBtn
        .querySelector(".icon-vol-on")
        .classList.toggle("hidden", muted);
    muteBtn
        .querySelector(".icon-vol-off")
        .classList.toggle("hidden", !muted);
}

// ── Loop ──────────────────────────────────────
loopBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.loop = !video.loop;
    loopBtn.classList.toggle("active", video.loop);
});

// ── PiP ───────────────────────────────────────
pipBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else if (video.src) {
            await video.requestPictureInPicture();
        }
    } catch (_) {}
});

// ── Fullscreen ────────────────────────────────
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        playerContainer.requestFullscreen().catch(() => {});
    }
}

fullscreenBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFullscreen();
});

document.addEventListener("fullscreenchange", () => {
    const fs = !!document.fullscreenElement;
    fullscreenBtn
        .querySelector(".icon-fs-enter")
        .classList.toggle("hidden", fs);
    fullscreenBtn
        .querySelector(".icon-fs-exit")
        .classList.toggle("hidden", !fs);
});

// ── Controls Auto-Hide ────────────────────────
function showControls() {
    playerContainer.classList.add("controls-visible");
    clearTimeout(hideTimer);
    if (!video.paused && video.src) {
        hideTimer = setTimeout(() => {
            playerContainer.classList.remove("controls-visible");
        }, 3500);
    }
}

playerContainer.addEventListener("mousemove", showControls);
playerContainer.addEventListener("mouseenter", showControls);
playerContainer.addEventListener("mouseleave", () => {
    if (!video.paused) {
        hideTimer = setTimeout(() => {
            playerContainer.classList.remove("controls-visible");
        }, 800);
    }
});

// ── Close Player ─────────────────────────────
function closeVideoPlayer() {
    video.pause();
    video.src = "";
    youtubeFrame.src = "";
    youtubeFrame.classList.add("hidden");
    video.classList.remove("hidden");
    controls.classList.remove("hidden");
    currentIndex = -1;
    playerSection.classList.add("hidden");
    videoTitle.textContent = "No video selected";
    videoMeta.textContent = "";
    playerWatchedBadge.classList.add("hidden");
    navPrev.classList.add("hidden");
    navNext.classList.add("hidden");
    sortAndRender();
    gallery.scrollIntoView({ behavior: "smooth", block: "start" });
}

closePlayer.addEventListener("click", closeVideoPlayer);
