/* ==========================================================================
   Download helper for printed documents.
   No third-party libs: "download" produces a self-contained HTML document
   that looks like the print preview (paper-like sheet + toolbar) and
   paginates like the app when printed / saved as PDF from the browser.
   ========================================================================== */

import printStyles from "./print.css?raw";

/**
 * Self-contained shell styles for the downloaded document — keeps the file
 * looking like the print preview on screen and paginating like the app's
 * @media print rules (A4 portrait / 80mm, repeated header + footer) when
 * the user prints it. Component styles come from ./print.css via ?raw.
 */
const DOCUMENT_SHELL_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: system-ui, "Segoe UI", Roboto, sans-serif;
    background: #eef2f7;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* On-screen toolbar — hidden when the document is printed */
  .print-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    background: #fff;
    border-bottom: 1px solid #dbe1ea;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .print-toolbar__title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .print-toolbar__btn {
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border: none;
    border-radius: 6px;
    background: #0284c7;
    color: #fff;
    cursor: pointer;
  }
  .print-toolbar__btn:hover { filter: brightness(1.1); }

  /* Paper-like sheet on screen */
  .report-print-area {
    max-width: 794px;
    margin: 16px auto 48px;
    padding: 24px 28px;
    background: #fff;
    color: #000;
    border: 1px solid #dbe1ea;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  .report-print-area table { width: 100%; border-collapse: collapse; }
  .report-print-area .page-break { page-break-before: always; }
  .report-print-area .print-sheet td { padding: 0; border: none; }
  .print-page-info { font-size: 8px; color: #555; margin-top: 8px; }

  /* 80mm receipts stay 80mm wide on screen too */
  .report-print-area.print-mode-pos80,
  .report-print-area.print-mode-80mm {
    max-width: 80mm;
    padding: 8px 10px;
  }

  @media print {
    html, body { background: #fff !important; }
    body { padding: 0 !important; }
    .print-toolbar { display: none !important; }
    .no-print { display: none !important; }

    .report-print-area {
      max-width: none;
      margin: 0;
      padding: 0;
      border: none;
      box-shadow: none;
    }

    .report-print-area table { page-break-inside: auto; }
    .report-print-area table tr { page-break-inside: avoid; }
    .report-print-area table:not(.print-sheet) th {
      color: #000;
      font-weight: 700;
      border-bottom: 2px solid #999;
      background-color: #e5e7eb;
    }
    .report-print-area table:not(.print-sheet) td,
    .report-print-area table:not(.print-sheet) th {
      padding: 2px 4px;
      border: 1px solid #ccc;
      color: #000;
      font-size: 10px;
      line-height: 1.1;
      word-break: break-word;
    }

    /* Repeat header / footer on every printed page */
    .print-sheet thead { display: table-header-group; }
    .print-sheet tfoot { display: table-footer-group; }
    .print-sheet tbody tr,
    .print-sheet tbody td { page-break-inside: auto; }

    .print-page-info {
      position: fixed;
      bottom: 5px;
      left: 15px;
    }
    .print-page-info__page { display: none; }

    @page { size: A4 portrait; margin: 8mm; }
    @page print-mode-a4 { size: A4 portrait; margin: 8mm; }
    .print-mode-a4 { page: print-mode-a4; }
    @page print-mode-pos80 { size: 80mm auto; margin: 0; }
    .print-mode-pos80, .print-mode-80mm {
      page: print-mode-pos80;
      width: 80mm;
    }
  }
`;

/**
 * Build a self-contained HTML string for the given print area element.
 * @param {HTMLElement} printAreaEl - The element to serialize
 * @param {string} [title] - Document title (falls back to data-report-title)
 */
export function buildPrintHtml(printAreaEl, title = null) {
  if (!printAreaEl) return null;
  const docTitle =
    title || printAreaEl.getAttribute("data-report-title") || "Document";
  const clone = printAreaEl.cloneNode(true);
  // The clone is the standalone document root — drop the print-only marker.
  clone.classList.remove("report-print-area--print");
  clone.style.position = "static";
  clone.style.width = "auto";
  clone.removeAttribute("data-report-title");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${docTitle.replace(/</g, "&lt;")}</title>
<style>
${printStyles}
${DOCUMENT_SHELL_CSS}
</style>
</head>
<body>
<div class="print-toolbar no-print">
  <span class="print-toolbar__title">${docTitle.replace(/</g, "&lt;")}</span>
  <button type="button" class="print-toolbar__btn" onclick="window.print()">Print / Save as PDF</button>
</div>
${clone.outerHTML}
</body>
</html>`;
}

/** Trigger a browser download of the document as a standalone HTML file. */
export function downloadPrintHtml(printAreaEl, filename = "document.html", title = null) {
  const html = buildPrintHtml(printAreaEl, title);
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