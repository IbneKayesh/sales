/* ============================================
   VideoVault — Utilities
   ============================================ */

function fmtTime(s) {
    if (!s || !isFinite(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const pad = sec < 10 ? "0" : "";
    return h > 0
        ? h + ":" + (m < 10 ? "0" : "") + m + ":" + pad + sec
        : m + ":" + pad + sec;
}

function fmtSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024)        return bytes + " B";
    if (bytes < 1048576)     return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1073741824)  return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1073741824).toFixed(2) + " GB";
}

function cleanTitle(name) {
    return name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getExt(name) {
    const m = name.match(/\.(\w+)$/);
    return m ? m[1].toUpperCase() : "";
}

function showCenterFeedback(html) {
    centerFeedbackIcon.innerHTML = html;
    centerFeedback.classList.remove("hidden");
    centerFeedbackIcon.style.animation = "none";
    void centerFeedbackIcon.offsetHeight;
    centerFeedbackIcon.style.animation = "";
    clearTimeout(centerFeedback._timer);
    centerFeedback._timer = setTimeout(
        () => centerFeedback.classList.add("hidden"),
        520
    );
}
