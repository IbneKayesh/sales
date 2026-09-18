import { Fragment } from "react";
import InputNumber from "@/components/InputNumber";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import { formatNumber } from "@/utils/misc";

// Bill summary — MRR split values rendered invoice-entry style at the
// bottom of the MRR entry page. Read-only totals from the master record,
// with the Invoice Discount amount kept editable (re-splits across item
// lines). Styling reuses the shared utility classes and PageCard pieces.
const BillSummary = ({ formData = {}, readOnly, onChange = () => {} }) => {
  const dueAmt = Number(formData.odrdm_duamt) || 0;

  const summaryRows = [
    { label: "Item Amount", value: formData.odrdm_tramt },
    { label: "Item Discount", value: formData.odrdm_itmds },
    { label: "Invoice Discount %", value: formData.odrdm_dspct },
    { label: "Invoice Discount", value: formData.odrdm_invds, editable: true },
    { label: "VAT Amount", value: formData.odrdm_vtamt },
    { label: "Include Cost", value: formData.odrdm_icamt },
    { label: "Exclude Cost", value: formData.odrdm_ecamt },
    { label: "Invoice Total", value: formData.odrdm_stamt },
    { label: "Inventory", value: formData.odrdm_csamt },
  ];

  const keyRows = [
    { label: "Payable Amount", value: formData.odrdm_pyamt, bold: true },
    { label: "Paid Amount", value: formData.odrdm_pdamt, bold: true },
    {
      label: "Due Amount",
      value: formData.odrdm_duamt,
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
              onChange={(e) => onChange("odrdm_invds", e.target.value)}
              step="0.01"
              disabled={readOnly || Number(formData.odrdm_dspct) > 0}
              al
            />
          </div>
        ) : (
          <span className={`col-span-6 ${valueClass}`}>
            {formatNumber(row.value, true)}
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
