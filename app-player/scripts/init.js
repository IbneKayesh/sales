/* ============================================
   VideoVault — Init
   ============================================ */

(async function init() {
    loadGridPreference();
    applyGridMode();
    showControls();
    updateFavFilterCount();

    const loaded = await loadServerVideos();
    if (!loaded) {
        emptyState.classList.remove("hidden");
    }
})();
