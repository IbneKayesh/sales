import { formatDate } from "@/utils/datetime.js";
import { useApp } from "@/context/AppContext";
import { fmt, MetaItem, amountInWords, DEFAULT_SIGNER_NAME } from "@/print";
import PrintHeader from "@/print/PrintHeader";
import PrintFooter from "@/print/PrintFooter";
import PrintBody from "@/print/PrintBody";

const InvoicePrint = ({ formData, listDataItem, dpart_Options }) => {
  const { business } = useApp();

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

  // Bill To = the party attached to the journal lines (customer / supplier)
  const partyLine = listDataItem.find(
    (i) =>
      i.party_cname && i.party_cname !== "Invalid SGL" && i.jrnlc_crval > 0,
  );
  const billTo = partyLine
    ? partyLine.party_cname.replace(/^[^-]*-\s*/, "") +
      ", " +
      partyLine.jrnlc_descr
    : "";

  return (
    <div
      className="report-print-area invoice-print-area"
      style={{
        fontFamily: "var(--font-sans)",
        color: "#000",
        maxWidth: "100%",
      }}
    >
      {/* Company / seller header + invoice title row */}
      <PrintHeader
        companyName={business?.bsins_cname}
        title={formData.jrnlm_trtyp || "INVOICE"}
        subtitle={deptName || business?.bsins_cname || ""}
        docNoLabel="Invoice No"
        docNo={formData.jrnlm_trnno || formData.jrnlm_refno}
        date={formatDate(formData.jrnlm_trdat)}
      />

      {/* Bill To + meta block + lines table */}
      <PrintBody
        metaChildren={
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: "3px 8px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <MetaItem label="Bill To" value={billTo || "—"} />
              <MetaItem label="Transaction Type" value={formData.jrnlm_trtyp} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "4px 12px",
                padding: "3px 8px",
              }}
            >
              <MetaItem label="Department" value={deptName} />
              <MetaItem label="Currency" value={formData.jrnlm_crncy} />
              <MetaItem label="Reference No" value={formData.jrnlm_refno} />
              <MetaItem
                label="Transaction Date"
                value={formatDate(formData.jrnlm_trdat)}
              />
              <MetaItem label="Status" value={formData.jrnlm_stats} />
            </div>
          </>
        }
        note={formData.jrnlm_narrt}
        noteLabel="Narration"
        columns={[
          { key: "#", header: "#", width: 24, align: "right", render: (_, idx) => idx + 1 },
          { key: "party_cname", header: "Products" },
          { key: "jrnlc_descr", header: "Description" },
          { key: "jrnlc_drval", header: "Debit", width: 90, align: "right", render: (r) => (Number(r.jrnlc_drval) ? fmt(r.jrnlc_drval) : "") },
          { key: "jrnlc_crval", header: "Credit", width: 90, align: "right", render: (r) => (Number(r.jrnlc_crval) ? fmt(r.jrnlc_crval) : "") },
        ]}
        rows={listDataItem}
        emptyText="No invoice lines"
        footer={
          <tr style={{ borderTop: "2px solid #000", fontWeight: 700 }}>
            <td colSpan={3} style={{ textAlign: "right", padding: "2px 6px" }}>
              Total
            </td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(totalDr)}</td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>{fmt(totalCr)}</td>
          </tr>
        }
      />

      {/* Amount in words + note + signatures */}
      <PrintFooter
        currency={formData.jrnlm_crncy || "BDT"}
        docName="invoice"
        amountInWordsText={amountInWords(totalDr || totalCr)}
        signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
        roles={["Prepared By", "Authorized"]}
      />
    </div>
  );
};

export default InvoicePrint;
