/* ==========================================================================
   Print library — self-contained printing for documents (MRR / Journal /
   Invoice / reports). No third-party print dependencies: printing goes
   through the browser's native print dialog (Save-as-PDF included).

     printReport(title, target)   — trigger the print dialog for a document
     PrintHeader / PrintBody /
     PrintFooter / PrintPreviewModal — shared document layout components
     format.js helpers            — fmt, MetaItem, amountInWords, ...
   ========================================================================== */

export { printReport, default as printReportDefault } from "./printReport";

export {
  buildPrintHtml,
  downloadPrintHtml,
  shareDocument,
  shareViaWhatsApp,
  shareViaEmail,
  shareMessage,
} from "./printFile";

export {
  fmt,
  MetaItem,
  amountInWords,
  DEFAULT_SIGNER_NAME,
} from "./format.jsx";

export { default as PrintHeader, CompanyHeader, DocTitleRow } from "./PrintHeader";

export {
  default as PrintBody,
  PrintTable,
  PrintSection,
  MetaItem as BodyMetaItem,
} from "./PrintBody";

export { default as PrintFooter } from "./PrintFooter";
export { default as PrintPreviewModal } from "./PrintPreviewModal";
