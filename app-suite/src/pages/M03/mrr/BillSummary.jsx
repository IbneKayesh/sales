import { Fragment } from "react";
import InputNumber from "@/components/InputNumber";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";

// Bill summary — MRR split values rendered invoice-entry style at the
// bottom of the MRR entry page. Read-only totals from the master record,
// with the Invoice Discount amount kept editable (re-splits across item
// lines). Styling reuses the shared utility classes and PageCard pieces.
const BillSummary = ({ formData = {}, readOnly, onChange = () => {} }) => {
  const fmt = (v) =>
    (Number(v) || 0).toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });

  const dueAmt = Number(formData.mrrdm_duamt) || 0;

  const summaryRows = [
    { label: "Total Amount", value: formData.mrrdm_tramt },
    { label: "Item Discount", value: formData.mrrdm_itmds },
    { label: "Invoice Discount %", value: formData.mrrdm_dspct },
    { label: "Invoice Discount", value: formData.mrrdm_invds, editable: true },
    { label: "iVAT Amount", value: formData.mrrdm_ivtmt },
    { label: "VAT Amount", value: formData.mrrdm_vtamt },
    { label: "TAX Amount", value: formData.mrrdm_txamt },
    { label: "Fix Amount", value: formData.mrrdm_fcamt },
    { label: "Include Cost", value: formData.mrrdm_icamt },
    { label: "Exclude Cost", value: formData.mrrdm_ecamt },
  ];

  const keyRows = [
    { label: "Payable Amount", value: formData.mrrdm_pyamt, bold: true },
    { label: "Paid Amount", value: formData.mrrdm_pdamt, bold: true },
    {
      label: "Due Amount",
      value: formData.mrrdm_duamt,
      bold: true,
      color: dueAmt > 0 ? "text-danger" : "text-success",
    },
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
              onChange={(e) => onChange("mrrdm_invds", e.target.value)}
              step="0.01"
              disabled={readOnly || Number(formData.mrrdm_dspct) > 0}
            />
          </div>
        ) : (
          <span className={`col-span-6 ${valueClass}`}>{fmt(row.value)}</span>
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
