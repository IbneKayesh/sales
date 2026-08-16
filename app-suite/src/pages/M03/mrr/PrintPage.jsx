import { useApp } from "@/context/AppContext";
import { formatDate } from "@/utils/datetime";
import { fmt, amountInWords, DEFAULT_SIGNER_NAME } from "@/print";
import PrintHeader from "@/print/PrintHeader";
import PrintFooter from "@/print/PrintFooter";
import PrintBody, { PrintSection, PrintTable } from "@/print/PrintBody";

/**
 * Print-only MRR document (Material Receipt Report).
 * Rendered with .mrr-print-area which is hidden on screen and shown only
 * while printing (A4 portrait, see index.css print section).
 *
 * The company header (name / address / BIN) comes from the live business
 * data in AppContext, falling back to defaults when not available.
 */
const PrintPage = ({ formData, listDataItem, listDataCost, listDataPayment, dpart_Options, cntct_Options }) => {
  const { business } = useApp();

  const deptName =
    dpart_Options?.find((o) => o.id === formData.mrrdm_dpart)?.dpart_cname ||
    formData.mrrdm_dpart ||
    "";

  const supplier =
    cntct_Options?.find((o) => o.id === formData.mrrdm_cntct) || null;

  const totalQty = listDataItem.reduce(
    (s, i) => s + (Number(i.mrrdc_itqty) || 0),
    0,
  );

  return (
    <div
      className="report-print-area mrr-print-area"
      style={{ fontFamily: "var(--font-sans)", color: "#000", maxWidth: "100%" }}
    >
      {/* Company / seller header (live business data) + MRR title row */}
      <PrintHeader
        companyName={business?.bsins_cname}
        companyAddress={business?.bsins_ofadr || business?.bsins_addr}
        companyTaxId={business?.bsins_bin}
        title="Material Receipt Report"
        subtitle={deptName || business?.bsins_cname || ""}
        docNoLabel="MRR No"
        docNo={formData.mrrdm_trnno || formData.mrrdm_refno}
        date={formatDate(formData.mrrdm_trdat)}
        extra={[
          { label: "Ref No", value: formData.mrrdm_refno },
          {
            label: "Currency",
            value: formData.mrrdm_crncy || business?.bsins_crncy || "BDT",
          },
          ...(formData.mrrdm_vehid
            ? [{ label: "Vehicle", value: formData.mrrdm_vehid }]
            : []),
        ]}
        titleMarginTop={6}
        titleMarginBottom={6}
      />

      {/* Supplier block + lines table + summary + sections */}
      <PrintBody
        metaChildren={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              padding: "3px 8px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: 0, lineHeight: 1.25 }}
            >
              <span
                style={{
                  fontSize: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#555",
                }}
              >
                Supplier
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#000" }}>
                {supplier?.cntct_cname || formData.mrrdm_cntct || "—"}
              </span>
              {supplier?.cntct_ofadr && (
                <span style={{ fontSize: 8, color: "#333" }}>
                  {supplier.cntct_ofadr}
                </span>
              )}
              {supplier?.cntct_cntno && (
                <span style={{ fontSize: 8, color: "#333" }}>
                  {supplier.cntct_cntps || "Contact"}: {supplier.cntct_cntno}
                </span>
              )}
            </div>
          </div>
        }
        note={formData.mrrdm_notes}
        noteLabel="Remarks"
        columns={[
          { key: "#", header: "#", width: 24, align: "right", render: (_, idx) => idx + 1 },
          { key: "items_iname", header: "Item" },
          { key: "runit_uname", header: "Unit" },
          { key: "mrrdc_itqty", header: "Qty", width: 55, align: "right", render: (r) => fmt(r.mrrdc_itqty) },
          { key: "mrrdc_itrat", header: "Rate", width: 70, align: "right", render: (r) => fmt(r.mrrdc_itrat) },
          { key: "mrrdc_itamt", header: "Amount", width: 70, align: "right", render: (r) => fmt(r.mrrdc_itamt) },
          { key: "mrrdc_dspct", header: "Disc %", width: 55, align: "right", render: (r) => (r.mrrdc_dspct ? Number(r.mrrdc_dspct) + "%" : "—") },
          { key: "mrrdc_dsamt", header: "Disc Amt", width: 70, align: "right", render: (r) => fmt(r.mrrdc_dsamt) },
          { key: "mrrdc_vtamt", header: "VAT", width: 70, align: "right", render: (r) => fmt(r.mrrdc_vtamt) },
          { key: "mrrdc_ntamt", header: "Net", width: 70, align: "right", render: (r) => fmt(r.mrrdc_ntamt) },
        ]}
        rows={listDataItem}
        emptyText="No items"
        footer={
          <tr style={{ borderTop: "2px solid #000", fontWeight: 700 }}>
            <td colSpan={3} style={{ textAlign: "right", padding: "2px 6px" }}>
              Total ({listDataItem.length} lines)
            </td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(totalQty)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }} />
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.mrrdm_tramt)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }} />
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.mrrdm_itmds)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.mrrdm_vtamt)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.mrrdm_pyamt)}</td>
          </tr>
        }
        summary={[
          { label: "Total Amount", value: fmt(formData.mrrdm_tramt) },
          { label: "Item Discount", value: fmt(formData.mrrdm_itmds) },
          ...(formData.mrrdm_invds
            ? [{ label: "Invoice Discount", value: fmt(formData.mrrdm_invds) }]
            : []),
          ...(Number(formData.mrrdm_ivtmt)
            ? [{ label: "iVAT Amount", value: fmt(formData.mrrdm_ivtmt) }]
            : []),
          { label: "VAT Amount", value: fmt(formData.mrrdm_vtamt) },
          { label: "Include Cost", value: fmt(formData.mrrdm_icamt) },
          { label: "Exclude Cost", value: fmt(formData.mrrdm_ecamt) },
          { label: "Payable Amount", value: fmt(formData.mrrdm_pyamt), strong: true, divider: true },
          { label: "Paid Amount", value: fmt(formData.mrrdm_pdamt) },
          { label: "Due Amount", value: fmt(formData.mrrdm_duamt), strong: true },
        ]}
      >
        {/* Costing summary */}
        {listDataCost?.length > 0 && (
          <PrintSection title="Costing Details">
            <PrintTable
              columns={[
                { key: "party_cname", header: "Cost Name" },
                { key: "mrrcs_csmod", header: "Mode" },
                { key: "mrrcs_clmod", header: "Calculation" },
                { key: "mrrcs_value", header: "Amount", width: 90, align: "right", render: (r) => fmt(r.mrrcs_value) },
                { key: "mrrcs_notes", header: "Notes" },
              ]}
              rows={listDataCost}
            />
          </PrintSection>
        )}

        {/* Payments */}
        {listDataPayment?.length > 0 && (
          <PrintSection title="Payment Details">
            <PrintTable
              columns={[
                { key: "party_cname", header: "Payment" },
                { key: "mrrpy_pydat", header: "Date", render: (r) => formatDate(r.mrrpy_pydat) },
                { key: "mrrpy_refno", header: "Ref No" },
                { key: "mrrpy_pdamt", header: "Amount", width: 90, align: "right", render: (r) => fmt(r.mrrpy_pdamt) },
                { key: "mrrpy_notes", header: "Notes" },
              ]}
              rows={listDataPayment}
            />
          </PrintSection>
        )}
      </PrintBody>



      {/* Amount in words + note + signatures */}
      <PrintFooter
        currency={formData.mrrdm_crncy || "BDT"}
        docName="MRR"
        amountInWordsText={amountInWords(formData.mrrdm_pyamt)}
        signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
        roles={["Prepared By", "Authorized"]}
        marginTop={20}
      />
    </div>
  );
};

export default PrintPage;
