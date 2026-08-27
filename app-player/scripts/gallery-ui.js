/* ============================================
   VideoVault — Gallery UI Interactions
   ============================================ */

// ── Sort / Filter ─────────────────────────────
sortSelect.addEventListener("change", () => sortAndRender(true));
searchInput.addEventListener("input", () => sortAndRender(true));

// ── Favorites Filter ──────────────────────────
favFilterBtn.addEventListener("click", () => {
    showFavoritesOnly = !showFavoritesOnly;
    favFilterBtn.classList.toggle("active", showFavoritesOnly);
    sortAndRender(true);
});

// ── Grid Size Toggle ─────────────────────────
function applyGridMode() {
    gallery.classList.toggle("compact", isCompact);
    gridToggleBtn
        .querySelector(".icon-grid-large")
        .classList.toggle("hidden", isCompact);
    gridToggleBtn
        .querySelector(".icon-grid-small")
        .classList.toggle("hidden", !isCompact);
}

gridToggleBtn.addEventListener("click", () => {
    isCompact = !isCompact;
    saveGridPreference();
    applyGridMode();
});

// ── Player Favorite Button ────────────────────
playerFavBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentIndex < 0 || !allVideos[currentIndex]) return;
    const entry = allVideos[currentIndex];
    const nowFav = toggleFav(entry.name);
    playerFavBtn.classList.toggle("faved", nowFav);
    playerFavBtn
        .querySelector(".fav-icon-empty")
        .classList.toggle("hidden", nowFav);
    playerFavBtn
        .querySelector(".fav-icon-filled")
        .classList.toggle("hidden", !nowFav);
    sortAndRender(true);
});
