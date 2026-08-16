/**
 * Print the report content using window.print().
 * Hides non-report elements during print via CSS class.
 *
 * NEVER touches document.title — the browser tab keeps its own title while
 * the print dialog is open.
 *
 * @param {string} title - Report title for the print header (rendered via the
 *   data-report-title attribute + CSS ::before, not the tab title)
 * @param {string} [target] - Optional print target: "journal" | "invoice" | "mrr" | "" (default: generic report)
 *   When set, only the matching document (e.g. .invoice-print-area) is printed
 *   and the others are hidden via the body[data-print-target] CSS rule.
 */
export function printReport(title = "Financial Report", target = "") {
  // Add title to the targeted print area for CSS to use
  const printArea = document.querySelector(
    target ? `.${target}-print-area` : ".report-print-area",
  );
  if (printArea) {
    printArea.setAttribute("data-report-title", title);
  }

  // Scope the print to a specific document when a target is provided
  const prevTarget = document.body.getAttribute("data-print-target");
  if (target) {
    document.body.setAttribute("data-print-target", target);
  }

  try {
    // Trigger print (synchronous in most browsers — the dialog shows while
    // this blocks, and cleanup runs as soon as it closes).
    window.print();
  } finally {
    // Cleanup - remove the data attributes
    if (printArea && printArea.hasAttribute("data-report-title")) {
      printArea.removeAttribute("data-report-title");
    }
    if (target) {
      if (prevTarget) {
        document.body.setAttribute("data-print-target", prevTarget);
      } else {
        document.body.removeAttribute("data-print-target");
      }
    }
  }
}

export default printReport;
