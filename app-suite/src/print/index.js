/* ==========================================================================
   Print library — self-contained, generic printing for any document.
   No third-party print dependencies: printing goes through the browser's
   native print dialog (Save-as-PDF included).

     PrintModal   — the one print entry point (preview + print/download)
                    with header / body / footer and per-page repetition
     PrintHeader / PrintFooter / PrintTable / PrintSection / MetaGrid /
     Summary      — small data-driven building blocks for the header, body
                    and footer JSX
     format.js    — fmt, MetaItem, amountInWords, ...
     printReport  — trigger the print dialog for a print source element
   ========================================================================== */

import "./print.css";

export {
  printDocument,
  printReport,
  printElement,
  default as printReportDefault,
} from "./printReport";

export { buildPrintHtml, downloadPrintHtml } from "./printFile";

export { fmt, MetaItem, amountInWords, DEFAULT_SIGNER_NAME } from "./format.jsx";

export { default as PrintHeader } from "./PrintHeader";
export { default as PrintFooter } from "./PrintFooter";

export {
  default as PrintTable,
  PrintSection,
  MetaGrid,
  Summary,
} from "./PrintTable";

export { default as PrintModal } from "./PrintModal";

export { default as usePrint } from "@/hooks/usePrint";
