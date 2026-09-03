import { Fragment } from "react";
import InputNumber from "@/components/InputNumber";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import { formatNumber } from "@/utils/misc";

// Bill summary — invoice split values rendered invoice-entry style at the
// bottom of the invoice entry page. Read-only totals from the master record,
// with the Invoice Discount amount kept editable (re-splits across item
// lines). Styling reuses the shared utility classes and PageCard pieces.
const BillSummary = ({ formData = {}, readOnly, onChange = () => {} }) => {

  const summaryRows = [
    { label: "Total Amount", value: formData.adjsm_tramt },
    { label: "Inventory", value: formData.adjsm_tramt },
  ];

  const keyRows = [
    { label: "Adjustment Amount", value: formData.adjsm_tramt, bold: true },
  ];

  // Zero/empty amounts are dimmed (label + value) so real (non-zero)
  // values stand out clearly in the primary colour.
  const isZero = (v) => !Number(v);

  const summaryRow = (row) => {
    const dimmed = isZero(row.value) && !row.color;
    const valueClass = [
      "text-mono",
      "text-right",
      row.color ? row.color : dimmed ? "text-muted" : "text-primary",
      row.bold ? "fw-bold" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="grid">
        <span className={`col-span-6 small${dimmed ? " text-muted" : ""}`}>
          {row.label}
        </span>
        {row.editable ? (
          <div className="col-span-6">
            <InputNumber
              dense
              value={row.value}
              onChange={(e) => onChange("column_name", e.target.value)}
              step="0.01"
              disabled={readOnly || Number(formData.column_name) > 0}
            />
          </div>
        ) : (
          <span className={`col-span-6 ${valueClass}`}>
            {formatNumber(row.value, 4)}
          </span>
        )}
      </div>
    );
  };

  // Subtle dotted separators between rows for easier scanning
  const withDividers = (rows) =>
    rows.map((row, i) => (
      <Fragment key={row.label}>
        {i > 0 && (
          <div
            className="my-1"
            style={{ borderTop: "1px dotted var(--border)" }}
          />
        )}
        {summaryRow(row)}
      </Fragment>
    ));

  return (
    <div className="d-flex justify-end mt-4">
      <PageCard className="overflow-hidden">
        <PageCardHeader>
          <PageCardTitle title="Bill Summary" />
        </PageCardHeader>
        <PageCardBody>
          <div className="px-2">
            <div className="d-flex flex-column gap-1">
              {withDividers(summaryRows)}
            </div>
            <div className="form-actions">
              <div className="d-flex flex-column gap-1 w-100">
                {withDividers(keyRows)}
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default BillSummary;
