import { PageCardFooter } from "@/components/PageCard";
import { formatNumber } from "@/utils/misc";

// Common totals footer used by all RPT_ report components
// Renders a label on the left and one or more formatted totals on the right.
const ReportFooter = ({ label = "Total", values = [] }) => {
  if (!values.length) return null;
  return (
    <PageCardFooter>
      <span className="fw-semibold">{label}</span>
      {values.length > 1 ? (
        <div className="d-flex gap-4">
          {values.map((v, i) => (
            <span
              key={i}
              className="fw-bold"
              style={{
                minWidth: "120px",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatNumber(v)}
            </span>
          ))}
        </div>
      ) : (
        <span className="fw-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatNumber(values[0])}
        </span>
      )}
    </PageCardFooter>
  );
};

// Common status banner footer (e.g. the Trial Balance / Balance Sheet balanced check)
export const ReportStatus = ({ text, tone = "success" }) => (
  <PageCardFooter
    className={`fw-semibold ${tone === "success" ? "text-success" : "text-danger"}`}
  >
    {text}
  </PageCardFooter>
);

export default ReportFooter;
