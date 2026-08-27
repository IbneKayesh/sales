/* ============================================
   VideoVault — Keyboard & Touch Controls
   ============================================ */

// ── Keyboard Shortcuts ────────────────────────
document.addEventListener("keydown", (e) => {
    if (document.activeElement === searchInput) return;

    switch (e.key) {
        case " ":
            e.preventDefault();
            togglePlay();
            showControls();
            break;
        case "ArrowLeft":
            e.preventDefault();
            if (e.shiftKey) {
                if (currentIndex > 0) playVideo(currentIndex - 1);
            } else {
                video.currentTime = Math.max(0, video.currentTime - 10);
            }
            showControls();
            break;
        case "ArrowRight":
            e.preventDefault();
            if (e.shiftKey) {
                if (currentIndex < allVideos.length - 1)
                    playVideo(currentIndex + 1);
            } else {
                video.currentTime = Math.min(
                    video.duration || 0,
                    video.currentTime + 10
                );
            }
            showControls();
            break;
        case "ArrowUp":
            e.preventDefault();
            video.volume = Math.min(1, video.volume + 0.05);
            volumeSlider.value = video.volume;
            updateVolumeIcon();
            showControls();
            break;
        case "ArrowDown":
            e.preventDefault();
            video.volume = Math.max(0, video.volume - 0.05);
            volumeSlider.value = video.volume;
            updateVolumeIcon();
            showControls();
            break;
        case "m":
        case "M":
            video.muted = !video.muted;
            updateVolumeIcon();
            showControls();
            break;
        case "f":
        case "F":
            toggleFullscreen();
            break;
        case "l":
        case "L":
            video.loop = !video.loop;
            loopBtn.classList.toggle("active", video.loop);
            showControls();
            break;
        case "Escape":
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                closeVideoPlayer();
            }
            break;
    }
});

// ── Mobile Touch Controls ─────────────────────
playerContainer.addEventListener(
    "touchstart",
    (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        showControls();
    },
    { passive: true }
);

playerContainer.addEventListener(
    "touchend",
    (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = Date.now() - touchStartTime;

        // Tap
        if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && dt < 300) {
            touchHandled = true;
            setTimeout(() => {
                touchHandled = false;
            }, 400);
            const rect = playerContainer.getBoundingClientRect();
            const x = touchStartX - rect.left;
            const third = rect.width / 3;

            if (x < third) {
                video.currentTime = Math.max(0, video.currentTime - 10);
                showTouchIndicator("left", "-10s");
            } else if (x > third * 2) {
                video.currentTime = Math.min(
                    video.duration || 0,
                    video.currentTime + 10
                );
                showTouchIndicator("right", "+10s");
            } else {
                togglePlay();
            }
            showControls();
            return;
        }

        // Horizontal swipe — seek
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            const seekAmount =
                (dx / playerContainer.getBoundingClientRect().width) *
                (video.duration || 0) *
                0.5;
            video.currentTime = Math.max(
                0,
                Math.min(
                    video.duration || 0,
                    video.currentTime + seekAmount
                )
            );
        }

        // Vertical swipe on right half — volume
        if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx) * 1.5) {
            const rect = playerContainer.getBoundingClientRect();
            if (touchStartX > rect.left + rect.width / 2) {
                const volDelta = -dy / rect.height;
                video.volume = Math.max(
                    0,
                    Math.min(1, video.volume + volDelta)
                );
                volumeSlider.value = video.volume;
                updateVolumeIcon();
            }
        }
    },
    { passive: true }
);

function showTouchIndicator(side, text) {
    const el = document.createElement("div");
    el.className = "touch-overlay";
    const ind = document.createElement("div");
    ind.className = "touch-indicator " + side;
    ind.textContent = text;
    el.appendChild(ind);
    playerContainer.appendChild(el);
    setTimeout(() => el.remove(), 650);
}
