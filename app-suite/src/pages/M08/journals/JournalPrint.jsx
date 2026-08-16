import { formatDate } from "@/utils/datetime.js";
import { fmt, DEFAULT_SIGNER_NAME } from "@/print";
import PrintHeader from "@/print/PrintHeader";
import PrintFooter from "@/print/PrintFooter";
import PrintBody from "@/print/PrintBody";

const JournalPrint = ({
  formData,
  listDataItem,
  dpart_Options,
  fsyar_Options,
  acprd_Options,
}) => {
  const totalDr = listDataItem.reduce(
    (s, i) => s + (Number(i.jrnlc_drval) || 0),
    0,
  );
  const totalCr = listDataItem.reduce(
    (s, i) => s + (Number(i.jrnlc_crval) || 0),
    0,
  );

  const deptName =
    dpart_Options.find((o) => o.id === formData.jrnlm_dpart)?.dpart_cname ||
    formData.jrnlm_dpart ||
    "";
  const fyName =
    fsyar_Options.find((o) => o.id === formData.jrnlm_fsyar)?.fsyar_cname ||
    formData.jrnlm_fsyar ||
    "";
  const prdName =
    acprd_Options.find((o) => o.id === formData.jrnlm_acprd)?.acprd_cname ||
    formData.jrnlm_acprd ||
    "";

  return (
    <div
      className="report-print-area journal-print-area"
      style={{
        fontFamily: "var(--font-sans)",
        color: "#000",
        maxWidth: "100%",
      }}
    >
      {/* Company / seller header + voucher title row */}
      <PrintHeader
        title="JOURNAL VOUCHER"
        subtitle={formData.jrnlm_trtyp || "Journal Entry"}
        docNoLabel="Voucher No"
        docNo={formData.jrnlm_trnno || formData.jrnlm_refno}
        date={formatDate(formData.jrnlm_trdat)}
      />

      {/* Meta block + lines table */}
      <PrintBody
        metaGrid={[
          { label: "Department", value: deptName },
          { label: "Fiscal Year", value: fyName },
          { label: "Period", value: prdName },
          { label: "Currency", value: formData.jrnlm_crncy },
          { label: "Reference No", value: formData.jrnlm_refno },
          {
            label: "Transaction Date",
            value: formatDate(formData.jrnlm_trdat),
          },
          { label: "Journal Type", value: formData.jrnlm_trtyp },
          { label: "Status", value: formData.jrnlm_stats },
        ]}
        metaColumns="repeat(4, 1fr)"
        note={formData.jrnlm_narrt}
        noteLabel="Narration"
        columns={[
          { key: "#", header: "#", width: 24, align: "right", render: (_, idx) => idx + 1 },
          { key: "chtac_cname", header: "Account (Ledger)", render: (r) => r.chtac_cname || "Invalid GL" },
          { key: "party_cname", header: "Sub Ledger" },
          { key: "jrnlc_descr", header: "Description" },
          { key: "jrnlc_drval", header: "Debit", width: 90, align: "right", render: (r) => (Number(r.jrnlc_drval) ? fmt(r.jrnlc_drval) : "") },
          { key: "jrnlc_crval", header: "Credit", width: 90, align: "right", render: (r) => (Number(r.jrnlc_crval) ? fmt(r.jrnlc_crval) : "") },
        ]}
        rows={listDataItem}
        emptyText="No journal lines"
        footer={
          <tr style={{ borderTop: "2px solid #000", fontWeight: 700 }}>
            <td colSpan={4} style={{ textAlign: "right", padding: "2px 6px" }}>
              Total
            </td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(totalDr)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(totalCr)}</td>
          </tr>
        }
      />

      {/* Amount note + signatures */}
      <PrintFooter
        currency={formData.jrnlm_crncy || "BDT"}
        docName="voucher"
        signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
        roles={["Prepared By", "Checked By", "Approved By"]}
      />
    </div>
  );
};

export default JournalPrint;
