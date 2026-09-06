/**
 * Generic print utility for any document or element.
 * Triggers native window.print() while scoping print styles to the active element.
 *
 * @param {string} title - Document title
 * @param {HTMLElement|string} [target] - Target element, ref, or selector to print
 */
export function printDocument(title = "Document", target = null) {
  let printArea = null;

  if (target && typeof target === "object" && target.nodeType === 1) {
    printArea = target;
  } else if (target && typeof target === "object" && target.current) {
    printArea = target.current;
  } else if (typeof target === "string" && target) {
    printArea =
      document.querySelector(`.${target}-print-area.report-print-area--print`) ||
      document.querySelector(target) ||
      document.querySelector(`.${target}-print-area`);
  }

  if (!printArea) {
    printArea =
      document.querySelector(".report-print-area--print") ||
      document.querySelector(".report-print-area");
  }

  if (!printArea) {
    window.print();
    return;
  }

  // Set active print attributes
  printArea.setAttribute("data-report-title", title);
  printArea.setAttribute("data-print-active", "true");

  try {
    window.print();
  } finally {
    printArea.removeAttribute("data-report-title");
    printArea.removeAttribute("data-print-active");
  }
}

/** Alias for printDocument */
export const printReport = printDocument;
export const printElement = printDocument;

export default printDocument;