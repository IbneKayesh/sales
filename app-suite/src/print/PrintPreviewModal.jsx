import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  IconClose,
  IconPrint,
  IconDownload,
  IconShare,
  IconWhatsApp,
  IconEmail,
} from "@/icons";
import Button from "@/components/Button";
import { printReport } from "./printReport";
import { downloadPrintHtml, shareViaWhatsApp, shareViaEmail } from "./printFile";

/**
 * PrintPreviewModal — shows a document preview and lets the user Print,
 * Export as PDF, Download, or Share (WhatsApp / email) from the same place.
 *
 * The document (children) renders twice:
 *  1. inside the modal as a readable on-screen preview
 *  2. in a .report-print-area portal (hidden on screen, shown only during
 *     print via the existing print CSS in index.css)
 *
 * The modal chrome is hidden while printing (see .print-preview in index.css),
 * so the print/PDF output contains only the document.
 *
 * Props:
 *   open, onClose        — modal visibility
 *   title                — document title used for the print header / file name
 *   printTarget          — "mrr" | "journal" | "invoice" (matches the CSS
 *                          .*-print-area class and printReport target)
 *   posEnabled           — show the A4 / POS 80mm paper-size toggle
 *   posChildren          — compact receipt variant rendered when POS is selected
 *   children             — the document component (e.g. <PrintPage ... />)
 */
export default function PrintPreviewModal({
  open,
  onClose,
  title = "Print",
  printTarget = "",
  posEnabled = false,
  posChildren = null,
  children,
}) {
  const printSourceRef = useRef(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [format, setFormat] = useState("a4");

  if (!open) return null;

  const isPos = format === "pos" && posEnabled;
  const content = isPos && posChildren ? posChildren : children;
  // POS prints under a distinct target/class (e.g. "invoice-pos" →
  // .invoice-pos-print-area) so it gets its own @page size.
  const target = isPos ? `${printTarget}-pos` : printTarget;

  const handlePrint = () => {
    printReport(title, target);
    onClose?.();
  };

  const handleDownload = () => {
    downloadPrintHtml(printSourceRef.current, `${title}.html`);
  };

  const handleShare = (channel) => {
    setShareOpen(false);
    if (channel === "whatsapp") shareViaWhatsApp(title);
    else if (channel === "email") shareViaEmail(title);
  };

  return createPortal(
    <>
      <div
        className="modal-overlay print-preview"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal modal--xl print-preview__dialog">
          <div className="modal__header print-preview__header">
            <div className="modal__title-wrap">
              <div className="modal__title-text">
                <h3 className="modal__title">Print Preview</h3>
                <p className="modal__subtitle">{title}</p>
              </div>
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                aria-label="Close print preview"
              >
                <IconClose size={16} />
              </button>
            </div>
          </div>
          <div className="print-preview__toolbar">
            <span className="print-preview__hint">
              Review the document below, then choose an action.
            </span>
            {posEnabled && (
              <div
                className="print-preview__format"
                role="radiogroup"
                aria-label="Paper size"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={format === "a4"}
                  onClick={() => setFormat("a4")}
                  title="A4 portrait"
                >
                  A4
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={format === "pos"}
                  onClick={() => setFormat("pos")}
                  title="80mm thermal receipt"
                >
                  POS 80mm
                </button>
              </div>
            )}
            <div className="print-preview__actions">
              <Button
                variant="info"
                size="sm"
                icon={<IconPrint size={14} />}
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<IconDownload size={14} />}
                onClick={handlePrint}
              >
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<IconDownload size={14} />}
                onClick={handleDownload}
              >
                Download
              </Button>
              <div className="print-preview__share">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<IconShare size={14} />}
                  onClick={() => setShareOpen((v) => !v)}
                  aria-expanded={shareOpen}
                  aria-haspopup="menu"
                >
                  Share
                </Button>
                {shareOpen && (
                  <div className="print-preview__share-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleShare("whatsapp")}
                    >
                      <IconWhatsApp size={16} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleShare("email")}
                    >
                      <IconEmail size={16} />
                      Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal__body print-preview__body">
            <div
              className="print-preview__page"
              style={
                isPos
                  ? { maxWidth: "80mm", margin: "0 auto" }
                  : undefined
              }
            >
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* Print source — hidden on screen, visible only while printing.
          The --print marker scopes the @media print CSS rules so they apply
          only to this copy and not to the on-screen preview (which also
          carries .report-print-area from the document component). */}
      <div
        ref={printSourceRef}
        className={`report-print-area report-print-area--print ${
          target ? `${target}-print-area` : ""
        }`}
        aria-hidden="true"
      >
        {content}
      </div>
    </>,
    document.body,
  );
}
