import { useRef, useState, isValidElement, cloneElement } from "react";
import { createPortal } from "react-dom";
import { IconClose, IconPrint, IconDownload } from "@/icons";
import PrintHeader from "./PrintHeader";
import PrintFooter from "./PrintFooter";
import { printReport } from "./printReport";
import { downloadPrintHtml } from "./printFile";

/**
 * PrintModal — Simple, generic print modal for any document.
 *
 * Props:
 *   open, onClose       — Modal visibility
 *   title               — Document title (e.g. "Invoice - INV-001")
 *   mode                — Initial print mode: "a4" (default) | "80mm" (or "pos80")
 *   enable80mm          — Boolean: force show the 80mm switcher (default: false)
 *   repeatHeader        — Boolean: repeat header at the top of every page (default: true)
 *   repeatFooter        — Boolean: repeat footer at the bottom of every page (default: true)
 *   header              — Header data object { company, title, subtitle, docNo, date, extra } OR custom JSX
 *   body / children     — Main JSX content (tables, meta blocks, summaries, etc.)
 *   footer              — Footer data object { amountInWords, note, currency, signerName, roles } OR custom JSX
 *   body80 / posBody    — Optional compact 80mm receipt JSX (if omitted, standard body adapts to 80mm)
 *   className           — Extra CSS classes
 */
export default function PrintModal({
  open,
  onClose,
  title = "Print",
  mode: initialMode = "a4",
  enable80mm = false,
  repeatHeader: defaultRepeatHeader = true,
  repeatFooter: defaultRepeatFooter = true,
  header,
  body,
  children,
  footer,
  body80,
  posBody,
  className = "",
}) {
  const printSourceRef = useRef(null);
  
  const has80mmSupport = enable80mm || !!body80 || !!posBody || initialMode === "80mm" || initialMode === "pos80";

  const [mode, setMode] = useState(
    has80mmSupport && (initialMode === "80mm" || initialMode === "pos80") ? "80mm" : "a4",
  );
  const [repeatHeader, setRepeatHeader] = useState(defaultRepeatHeader);
  const [repeatFooter, setRepeatFooter] = useState(defaultRepeatFooter);

  if (!open) return null;

  const is80mm = has80mmSupport && (mode === "80mm" || mode === "pos80");
  const activeModeClass = is80mm ? "print-mode-80mm" : "print-mode-a4";

  // Helper to resolve Header (data object, function (mode) => JSX, or JSX)
  const resolveHeader = () => {
    if (typeof header === "function") return header(mode);
    if (header && typeof header === "object" && !header.$$typeof) {
      return <PrintHeader {...header} mode={is80mm ? "80mm" : "a4"} />;
    }
    if (isValidElement(header)) {
      return cloneElement(header, { mode: is80mm ? "80mm" : "a4" });
    }
    return header;
  };

  // Helper to resolve Footer (data object, function (mode) => JSX, or JSX)
  const resolveFooter = () => {
    if (typeof footer === "function") return footer(mode);
    if (footer && typeof footer === "object" && !footer.$$typeof) {
      return <PrintFooter {...footer} mode={is80mm ? "80mm" : "a4"} />;
    }
    if (isValidElement(footer)) {
      return cloneElement(footer, { mode: is80mm ? "80mm" : "a4" });
    }
    return footer;
  };

  // Helper to resolve Body
  const resolveBody = () => {
    if (is80mm && (body80 || posBody)) {
      return body80 || posBody;
    }
    const content = body || children;
    if (typeof content === "function") return content(mode);
    return content;
  };

  const resolvedHeader = resolveHeader();
  const resolvedFooter = resolveFooter();
  const currentBody = resolveBody();

  // In 80mm thermal receipt mode, repeat across pages is typically not applicable
  const shouldRepeatHeader = !is80mm && repeatHeader && !!resolvedHeader;
  const shouldRepeatFooter = !is80mm && repeatFooter && !!resolvedFooter;

  const renderDocument = (isPrintSource) => (
    <div
      ref={isPrintSource ? printSourceRef : null}
      className={[
        "report-print-area",
        "print-doc",
        isPrintSource ? "report-print-area--print" : "",
        activeModeClass,
        is80mm ? "print-mode-pos80" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        color: "#000",
        backgroundColor: "#fff",
      }}
    >
      <table className="print-sheet" style={{ width: "100%", borderCollapse: "collapse" }}>
        {shouldRepeatHeader && (
          <thead>
            <tr>
              <td style={{ padding: 0, border: "none" }}>{resolvedHeader}</td>
            </tr>
          </thead>
        )}
        <tbody>
          <tr>
            <td style={{ padding: 0, border: "none" }}>
              {!shouldRepeatHeader && resolvedHeader && (
                <div className="print-sheet__header" style={{ marginBottom: 4 }}>{resolvedHeader}</div>
              )}
              {currentBody}
              {!shouldRepeatFooter && resolvedFooter && (
                <div className="print-sheet__footer" style={{ marginTop: 8 }}>{resolvedFooter}</div>
              )}
            </td>
          </tr>
        </tbody>
        {shouldRepeatFooter && (
          <tfoot>
            <tr>
              <td style={{ padding: 0, border: "none" }}>{resolvedFooter}</td>
            </tr>
          </tfoot>
        )}
      </table>
      {isPrintSource && !is80mm && (
        <div className="print-page-info">
          <span className="print-page-info__date">
            Printed: {new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
          </span>
          <span className="print-page-info__page"></span>
        </div>
      )}
    </div>
  );

  const handlePrint = () => {
    printReport(title, printSourceRef.current);
  };

  const handleDownload = () => {
    downloadPrintHtml(printSourceRef.current, `${title.replace(/\s+/g, "_")}.html`, title);
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
          {/* Header */}
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

          {/* Toolbar — Single Unified Button Group */}
          <div className="print-preview__toolbar">
            <div className="print-preview__btn-group">
              {/* Paper Mode Selection (only shown when 80mm is supported for this document) */}
              {has80mmSupport && (
                <>
                  <button
                    type="button"
                    className={`print-toolbar-btn ${mode === "a4" ? "active" : ""}`}
                    onClick={() => setMode("a4")}
                    title="A4 standard sheet"
                  >
                    A4
                  </button>
                  <button
                    type="button"
                    className={`print-toolbar-btn ${mode === "80mm" ? "active" : ""}`}
                    onClick={() => setMode("80mm")}
                    title="80mm thermal receipt"
                  >
                    80MM
                  </button>
                </>
              )}

              {/* Repeat Options */}
              {!is80mm && resolvedHeader && (
                <button
                  type="button"
                  className={`print-toolbar-btn ${repeatHeader ? "active" : ""}`}
                  onClick={() => setRepeatHeader((v) => !v)}
                  title="Repeat header on every printed page"
                >
                  Repeat Header
                </button>
              )}
              {!is80mm && resolvedFooter && (
                <button
                  type="button"
                  className={`print-toolbar-btn ${repeatFooter ? "active" : ""}`}
                  onClick={() => setRepeatFooter((v) => !v)}
                  title="Repeat footer on every printed page"
                >
                  Repeat Footer
                </button>
              )}

              <span className="print-toolbar-divider" />

              {/* Actions */}
              <button
                type="button"
                className="print-toolbar-btn print-toolbar-btn--primary"
                onClick={handlePrint}
                title="Print document"
              >
                <IconPrint size={14} />
                <span>Print</span>
              </button>
              <button
                type="button"
                className="print-toolbar-btn"
                onClick={handlePrint}
                title="Save as PDF using the browser print dialog"
              >
                <IconDownload size={14} />
                <span>Export PDF</span>
              </button>
              <button
                type="button"
                className="print-toolbar-btn"
                onClick={handleDownload}
                title="Download offline HTML document"
              >
                <IconDownload size={14} />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Preview Page Canvas */}
          <div className="modal__body print-preview__body">
            <div
              className={`print-preview__page ${
                is80mm ? "print-preview__page--80mm" : "print-preview__page--a4"
              }`}
            >
              {renderDocument(false)}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print Source (triggered by window.print()) */}
      {renderDocument(true)}
    </>,
    document.body,
  );
}
