/* ==========================================================================
   Download & share helpers for printed documents.
   No third-party libs: "download" produces a self-contained HTML document
   (with the print styles inline) that opens in the browser and can be
   printed/saved as PDF; "share" uses the native Web Share API when available
   and falls back to WhatsApp / email compose links.
   ========================================================================== */

/** Minimal print stylesheet embedded in the downloaded file. */
const DOWNLOAD_CSS = `
  body { margin: 0; padding: 24px; font-family: system-ui, "Segoe UI", Roboto, sans-serif; }
  .report-print-area { color: #000; max-width: 100%; }
  .report-print-area table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
  .report-print-area table tr { page-break-inside: avoid; }
  .report-print-area table th { color: #000; font-weight: 700; border-bottom: 2px solid #999; background-color: #e5e7eb; }
  .report-print-area table td, .report-print-area table th { padding: 4px 8px; border: 1px solid #ccc; color: #000; font-size: 10px; }
  .report-print-area .page-break { page-break-before: always; }
  @media print { .no-print { display: none !important; } }
`;

/** Build a self-contained HTML string for the given print area element. */
export function buildPrintHtml(printAreaEl) {
  if (!printAreaEl) return null;
  const clone = printAreaEl.cloneNode(true);
  // The clone is the standalone document root — drop the print-only marker.
  clone.classList.remove("report-print-area--print");
  clone.style.position = "static";
  clone.style.width = "auto";
  clone.removeAttribute("data-report-title");
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${(printAreaEl.getAttribute("data-report-title") || "Document").replace(/</g, "&lt;")}</title>
<style>${DOWNLOAD_CSS}</style>
</head>
<body>
${clone.outerHTML}
</body>
</html>`;
}

/** Trigger a browser download of the document as a standalone HTML file. */
export function downloadPrintHtml(printAreaEl, filename = "document.html") {
  const html = buildPrintHtml(printAreaEl);
  if (!html) return;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Default share message for a document. */
export const shareMessage = (title) =>
  `${title} — generated from the app. Open the document to view or download it.`;

/**
 * Share a document: native share (file when available) → WhatsApp → email.
 * Returns the channel used ("web-share" | "whatsapp" | "email"), or null.
 */
export async function shareDocument(title, printAreaEl, { whatsapp = true, email = true } = {}) {
  const text = shareMessage(title);

  // Native share (mobile / desktop with file support)
  if (typeof navigator.share === "function") {
    const file = printAreaEl
      ? new File([buildPrintHtml(printAreaEl) || ""], `${slug(title)}.html`, {
          type: "text/html;charset=utf-8",
        })
      : null;
    try {
      await navigator.share(file ? { title, text, files: [file] } : { title, text });
      return "web-share";
    } catch (err) {
      // User cancelled — fall through to the link options.
      if (err?.name === "AbortError") return null;
    }
  }

  const encoded = encodeURIComponent(text);

  if (whatsapp) {
    window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
    return "whatsapp";
  }
  if (email) {
    window.location.href = `mailto:?subject=${encoded}&body=${encoded}`;
    return "email";
  }
  return null;
}

/** WhatsApp-only share (explicit button). */
export function shareViaWhatsApp(title) {
  const text = shareMessage(title);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

/** Email-only share (explicit button). */
export function shareViaEmail(title) {
  const text = shareMessage(title);
  window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text)}`;
}

const slug = (s) =>
  String(s || "document")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "document";
