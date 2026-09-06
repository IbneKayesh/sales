/* ==========================================================================
   PrintHeader — clean, data-driven document header for PrintModal.
   Supports company block + document meta info (title, doc no, date, extra).
   Adapts cleanly to A4 and 80MM roll modes.
   ========================================================================== */

const DEFAULT_COMPANY = {
  name: "AppSuite Inc.",
  address: "House 12, Road 5, Gulshan-1, Dhaka 1212, Bangladesh",
  taxId: "BIN: 001234567-0101",
};

/**
 * @param {object} company  — { name, address, taxId, phone, email }
 * @param {string} title    — Document title (e.g. "INVOICE", "MATERIAL RECEIPT REPORT")
 * @param {string} subtitle — Subtitle (e.g. department / branch name)
 * @param {string} docNo    — Document number
 * @param {string} docNoLabel — Label for doc no (default: "Doc No")
 * @param {string} date     — Document date
 * @param {string} dateLabel — Label for date (default: "Date")
 * @param {Array}  extra    — Array of [{ label, value }]
 * @param {string} mode     — "a4" | "80mm"
 */
export default function PrintHeader({
  company = {},
  title = "Document",
  subtitle,
  docNo,
  docNoLabel = "Doc No",
  date,
  dateLabel = "Date",
  extra = [],
  mode = "a4",
}) {
  const comp = { ...DEFAULT_COMPANY, ...company };
  const is80mm = mode === "80mm" || mode === "pos80";

  if (is80mm) {
    return (
      <div className="print-hdr-80">
        {comp.name && <div className="print-hdr-80__company-name">{comp.name}</div>}
        {comp.address && <div className="print-hdr__company-detail">{comp.address}</div>}
        {comp.taxId && <div className="print-hdr__company-tax">{comp.taxId}</div>}
        <div className="print-hdr-80__divider" />
        <div className="print-hdr-80__title">{title}</div>
        {subtitle && <div className="print-hdr-80__subtitle">{subtitle}</div>}
        <div className="print-hdr-80__meta">
          {docNo && (
            <div className="print-hdr-80__row">
              <span>{docNoLabel}:</span>
              <strong>{docNo}</strong>
            </div>
          )}
          {date && (
            <div className="print-hdr-80__row">
              <span>{dateLabel}:</span>
              <strong>{date}</strong>
            </div>
          )}
          {extra.map((item, idx) => (
            <div key={idx} className="print-hdr-80__row">
              <span>{item.label}:</span>
              <strong>{item.value || "—"}</strong>
            </div>
          ))}
        </div>
        <div className="print-hdr-80__divider" />
      </div>
    );
  }

  return (
    <div className="print-hdr">
      {/* Company Block (Top Centered) */}
      <div className="print-hdr__company">
        <div className="print-hdr__company-name">{comp.name}</div>
        {comp.address && <div className="print-hdr__company-detail">{comp.address}</div>}
        {comp.taxId && <div className="print-hdr__company-tax">{comp.taxId}</div>}
      </div>

      {/* Document Title & Meta Bar */}
      <div className="print-hdr__meta-bar">
        <div>
          <div className="print-hdr__title">{title}</div>
          {subtitle && <div className="print-hdr__subtitle">{subtitle}</div>}
        </div>
        <div className="print-hdr__info">
          {docNo && (
            <div>
              {docNoLabel}: <strong>{docNo}</strong>
            </div>
          )}
          {date && (
            <div>
              {dateLabel}: <strong>{date}</strong>
            </div>
          )}
          {extra.map((item, idx) => (
            <div key={idx}>
              {item.label}: <strong>{item.value || "—"}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
