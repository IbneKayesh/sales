/* ============================================
   VideoVault — Toast Notifications
   ============================================ */

function showToast(message, type = "error", duration = 4000) {
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;

    const icons = {
        error:
            '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<circle cx="12" cy="12" r="10"/>' +
            '<line x1="15" y1="9" x2="9" y2="15"/>' +
            '<line x1="9" y1="9" x2="15" y2="15"/>' +
            "</svg>",
        success:
            '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>' +
            '<polyline points="22 4 12 14.01 9 11.01"/>' +
            "</svg>",
    };

    toast.innerHTML =
        (icons[type] || icons.error) +
        '<span class="toast-msg">' + message + "</span>" +
        '<button class="toast-close" onclick="this.parentElement.remove()">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<line x1="18" y1="6" x2="6" y2="18"/>' +
            '<line x1="6" y1="6" x2="18" y2="18"/>' +
            "</svg>" +
        "</button>";

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("toast-exit");
        setTimeout(() => toast.remove(), 260);
    }, duration);
}
