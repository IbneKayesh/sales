/* ==========================================================================
   PrintHeader — shared header for printed documents (MRR, Journal, Invoice)
   Renders the centered company block (name / address / BIN) on top, then the
   document title row (title + subtitle on the left, doc no / date / extra
   meta on the right) separated by a solid rule.

   All values are optional — anything not passed falls back to the demo
   company defaults below (until business data is wired to Settings).
   ========================================================================== */

const COMPANY_DEFAULTS = {
  name: "AppSuite Inc.",
  address: "House 12, Road 5, Gulshan-1, Dhaka 1212, Bangladesh",
  taxId: "BIN: 001234567-0101 | TIN: 123-456-789",
};

const row = { display: "flex", flexDirection: "column", gap: 0, lineHeight: 1.25 };
const labelStyle = {
  fontSize: 7,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#555",
};
const valueStyle = { fontSize: 10, fontWeight: 600, color: "#000" };

/* ---- Company / seller block (centered) -------------------------------- */

export const CompanyHeader = ({ name, address, taxId, marginBottom = 4 }) => {
  const company = {
    name: name ?? COMPANY_DEFAULTS.name,
    address: address ?? COMPANY_DEFAULTS.address,
    taxId: taxId ?? COMPANY_DEFAULTS.taxId,
  };
  return (
    <div style={{ textAlign: "center", marginBottom }}>
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.04em" }}>
        {company.name}
      </div>
      <div style={{ fontSize: 8, color: "#333", marginTop: 1 }}>
        {company.address}
      </div>
      {company.taxId && (
        <div style={{ fontSize: 8, color: "#555", marginTop: 1 }}>
          {company.taxId}
        </div>
      )}
    </div>
  );
};

/* ---- Document title row ----------------------------------------------- */

export const DocTitleRow = ({
  title,
  subtitle,
  docNoLabel = "Document No",
  docNo,
  date,
  dateLabel = "Date",
  extra = [], // [{ label, value }] rendered after the date
  marginTop = 0,
  marginBottom = 4,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      borderBottom: "2px solid #000",
      paddingBottom: 3,
      marginTop,
      marginBottom,
    }}
  >
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.02em" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 9, color: "#333", marginTop: 1 }}>
          {subtitle}
        </div>
      )}
    </div>
    <div style={{ textAlign: "right", fontSize: 10 }}>
      <div>
        {docNoLabel}: <strong>{docNo || "—"}</strong>
      </div>
      <div>
        {dateLabel}: <strong>{date || "—"}</strong>
      </div>
      {extra.map((item, idx) => (
        <div key={idx}>
          {item.label}: <strong>{item.value || "—"}</strong>
        </div>
      ))}
    </div>
  </div>
);

/* ---- Combined header ---------------------------------------------------- */

const PrintHeader = ({
  companyName,
  companyAddress,
  companyTaxId,
  companyMarginBottom = 4,
  title,
  subtitle,
  docNoLabel = "Document No",
  docNo,
  date,
  dateLabel = "Date",
  extra = [],
  titleMarginTop = 0,
  titleMarginBottom = 4,
}) => (
  <>
    <CompanyHeader
      name={companyName}
      address={companyAddress}
      taxId={companyTaxId}
      marginBottom={companyMarginBottom}
    />
    <DocTitleRow
      title={title}
      subtitle={subtitle}
      docNoLabel={docNoLabel}
      docNo={docNo}
      date={date}
      dateLabel={dateLabel}
      extra={extra}
      marginTop={titleMarginTop}
      marginBottom={titleMarginBottom}
    />
  </>
);

export default PrintHeader;
