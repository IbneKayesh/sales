/* ==========================================================================
   Compatibility re-export — the print helpers moved to @/print.
   New code should import from "@/print" (or "@/print/format") directly.
   ========================================================================== */

export { fmt, MetaItem, amountInWords, DEFAULT_SIGNER_NAME } from "@/print/format.jsx";
