/* ============================================
   VideoVault — YouTube Helpers
   ============================================ */

function isYouTubeUrl(url) {
    try {
        const u = new URL(url);
        return (
            u.hostname.includes("youtube.com") ||
            u.hostname.includes("youtu.be")
        );
    } catch (_) {
        return false;
    }
}

function getYouTubeEmbedUrl(url) {
    try {
        const u = new URL(url);
        let videoId = "";
        if (u.hostname.includes("youtu.be")) {
            videoId = u.pathname.replace("/", "").split("/")[0];
        } else {
            videoId = u.searchParams.get("v") || "";
        }
        return videoId
            ? "https://www.youtube.com/embed/" + videoId + "?autoplay=1"
            : null;
    } catch (_) {
        return null;
    }
}
