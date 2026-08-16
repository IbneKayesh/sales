import { useApp } from "@/context/AppContext";
import { formatDate } from "@/utils/datetime";
import { fmt, amountInWords, DEFAULT_SIGNER_NAME } from "@/print";
import PrintHeader from "@/print/PrintHeader";
import PrintFooter from "@/print/PrintFooter";
import PrintBody, { PrintSection, PrintTable } from "@/print/PrintBody";

/**
 * Print-only invoice document (Sales Invoice - M02).
 * Rendered with .invoice-print-area which is hidden on screen and shown only
 * while printing (A4 portrait, see index.css print section). Company header
 * comes from live business data (AppContext).
 */
const PrintPage = ({
  formData,
  listDataItem,
  listDataCost,
  listDataPayment,
  dpart_Options,
  cntct_Options,
}) => {
  const { business } = useApp();

  const deptName =
    dpart_Options?.find((o) => o.id === formData.invcm_dpart)?.dpart_cname ||
    formData.invcm_dpart ||
    "";

  const customer =
    cntct_Options?.find((o) => o.id === formData.invcm_cntct) || null;

  const totalQty = listDataItem.reduce(
    (s, i) => s + (Number(i.invcc_itqty) || 0),
    0,
  );

  return (
    <div
      className="report-print-area invoice-print-area"
      style={{ fontFamily: "var(--font-sans)", color: "#000", maxWidth: "100%" }}
    >
      {/* Company header + invoice title row */}
      <PrintHeader
        companyName={business?.bsins_cname}
        companyAddress={business?.bsins_ofadr || business?.bsins_addr}
        companyTaxId={business?.bsins_bin}
        title={formData.invcm_ttype || "INVOICE"}
        subtitle={deptName || business?.bsins_cname || ""}
        docNoLabel="Invoice No"
        docNo={formData.invcm_trnno || formData.invcm_refno}
        date={formatDate(formData.invcm_trdat)}
        extra={[
          { label: "Ref No", value: formData.invcm_refno },
          { label: "Currency", value: formData.invcm_crncy || business?.bsins_crncy || "BDT" },
        ]}
        titleMarginTop={6}
        titleMarginBottom={6}
      />

      {/* Customer block + lines table + summary + sections */}
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
                Customer
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#000" }}>
                {customer?.cntct_cname || formData.invcm_cntct || "—"}
              </span>
              {customer?.cntct_ofadr && (
                <span style={{ fontSize: 8, color: "#333" }}>
                  {customer.cntct_ofadr}
                </span>
              )}
              {customer?.cntct_cntno && (
                <span style={{ fontSize: 8, color: "#333" }}>
                  {customer.cntct_cntps || "Contact"}: {customer.cntct_cntno}
                </span>
              )}
            </div>
          </div>
        }
        note={formData.invcm_notes}
        noteLabel="Remarks"
        columns={[
          { key: "#", header: "#", width: 24, align: "right", render: (_, idx) => idx + 1 },
          { key: "items_iname", header: "Item" },
          { key: "runit_uname", header: "Unit" },
          { key: "invcc_itqty", header: "Qty", width: 55, align: "right", render: (r) => fmt(r.invcc_itqty) },
          { key: "invcc_itrat", header: "Rate", width: 70, align: "right", render: (r) => fmt(r.invcc_itrat) },
          { key: "invcc_itamt", header: "Amount", width: 70, align: "right", render: (r) => fmt(r.invcc_itamt) },
          { key: "invcc_dspct", header: "Disc %", width: 55, align: "right", render: (r) => (r.invcc_dspct ? Number(r.invcc_dspct) + "%" : "—") },
          { key: "invcc_dsamt", header: "Disc Amt", width: 70, align: "right", render: (r) => fmt(r.invcc_dsamt) },
          { key: "invcc_vtamt", header: "VAT", width: 70, align: "right", render: (r) => fmt(r.invcc_vtamt) },
          { key: "invcc_ntamt", header: "Net", width: 70, align: "right", render: (r) => fmt(r.invcc_ntamt) },
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
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.invcm_tramt)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }} />
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.invcm_itmds)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.invcm_vtamt)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(formData.invcm_pyamt)}</td>
          </tr>
        }
        summary={[
          { label: "Total Amount", value: fmt(formData.invcm_tramt) },
          { label: "Item Discount", value: fmt(formData.invcm_itmds) },
          ...(formData.invcm_invds
            ? [{ label: "Invoice Discount", value: fmt(formData.invcm_invds) }]
            : []),
          ...(Number(formData.invcm_lylds)
            ? [{ label: "Loyalty Discount", value: fmt(formData.invcm_lylds) }]
            : []),
          { label: "VAT Amount", value: fmt(formData.invcm_vtamt) },
          { label: "Include Cost", value: fmt(formData.invcm_icamt) },
          { label: "Exclude Cost", value: fmt(formData.invcm_ecamt) },
          { label: "Payable Amount", value: fmt(formData.invcm_pyamt), strong: true, divider: true },
          { label: "Paid Amount", value: fmt(formData.invcm_pdamt) },
          { label: "Due Amount", value: fmt(formData.invcm_duamt), strong: true },
        ]}
      >
        {/* Costing summary */}
        {listDataCost?.length > 0 && (
          <PrintSection title="Costing Details">
            <PrintTable
              columns={[
                { key: "party_cname", header: "Cost Name" },
                { key: "invcs_csmod", header: "Mode" },
                { key: "invcs_value", header: "Amount", width: 90, align: "right", render: (r) => fmt(r.invcs_value) },
                { key: "invcs_notes", header: "Notes" },
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
                { key: "invpy_pydat", header: "Date", render: (r) => formatDate(r.invpy_pydat) },
                { key: "invpy_refno", header: "Ref No" },
                { key: "invpy_pdamt", header: "Amount", width: 90, align: "right", render: (r) => fmt(r.invpy_pdamt) },
                { key: "invpy_notes", header: "Notes" },
              ]}
              rows={listDataPayment}
            />
          </PrintSection>
        )}
      </PrintBody>

      {/* Amount in words + note + signatures */}
      <PrintFooter
        currency={formData.invcm_crncy || "BDT"}
        docName="invoice"
        amountInWordsText={amountInWords(formData.invcm_pyamt)}
        signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
        roles={["Prepared By", "Authorized"]}
        marginTop={20}
      />
    </div>
  );
};

export default PrintPage;
