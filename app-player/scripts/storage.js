/* ============================================
   VideoVault — Storage
   ============================================ */

const STORAGE_KEY  = "videovault";
const FAV_KEY      = "videovault_favs";
const WATCHED_KEY  = "videovault_watched";
const GRID_KEY     = "videovault_grid";

// ── General Store ─────────────────────────────
function getStore() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (_) { return {}; }
}

function setStore(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (_) {}
}

// ── Position & Progress ──────────────────────
function savePosition(id, time) {
    const d = getStore();
    if (!d[id]) d[id] = {};
    d[id].pos = time;
    setStore(d);
}

function loadPosition(id) {
    const d = getStore();
    return (d[id] && d[id].pos) || 0;
}

function saveProgress(id, pct) {
    const d = getStore();
    if (!d[id]) d[id] = {};
    d[id].prog = parseFloat(pct.toFixed(1));
    setStore(d);
}

function loadProgress(id) {
    const d = getStore();
    return (d[id] && d[id].prog) || 0;
}

// ── Favorites ────────────────────────────────
function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch (_) { return []; }
}

function setFavs(arr) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); }
    catch (_) {}
}

function isFav(name) {
    return getFavs().includes(name);
}

function toggleFav(name) {
    let favs = getFavs();
    const idx = favs.indexOf(name);
    if (idx >= 0) {
        favs.splice(idx, 1);
    } else {
        favs.push(name);
    }
    setFavs(favs);
    updateFavFilterCount();
    return idx < 0;
}

function updateFavFilterCount() {
    favFilterCount.textContent = getFavs().length;
}

// ── Watched ──────────────────────────────────
function getWatched() {
    try { return JSON.parse(localStorage.getItem(WATCHED_KEY)) || {}; }
    catch (_) { return {}; }
}

function setWatched(data) {
    try { localStorage.setItem(WATCHED_KEY, JSON.stringify(data)); }
    catch (_) {}
}

function isWatched(name) {
    return !!getWatched()[name];
}

function markWatched(name) {
    const d = getWatched();
    d[name] = true;
    setWatched(d);
}

// ── Grid Preference ──────────────────────────
function loadGridPreference() {
    try {
        isCompact = localStorage.getItem(GRID_KEY) === "compact";
    } catch (_) {
        isCompact = false;
    }
}

function saveGridPreference() {
    try {
        localStorage.setItem(GRID_KEY, isCompact ? "compact" : "large");
    } catch (_) {}
}
