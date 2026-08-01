import { formatDate } from "@/utils/datetime.js";
import {
  fmt,
  MetaItem,
  amountInWords,
  CompanyHeader,
  DEFAULT_SIGNER_NAME,
} from "./printShared";

const InvoicePrint = ({ formData, listDataItem, dpart_Options }) => {
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
      {/* Company / seller header */}
      {/* <CompanyHeader /> */}

      {/* Invoice header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px solid #000",
          paddingBottom: 3,
          marginBottom: 4,
        }}
      >
        <div>
          <div
            style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.02em" }}
          >
            {/* {formData.jrnlm_trtyp || "INVOICE"} */}
            Purchase Order
          </div>
          <div style={{ fontSize: 9, color: "#333", marginTop: 1 }}>
            {/* {deptName} */}
            Janani Store, Hossain Market
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 10 }}>
          <div>
            Invoice No:{" "}
            <strong>
              {formData.jrnlm_trnno || formData.jrnlm_refno || "—"}
            </strong>
          </div>
          <div>
            Date: <strong>{formatDate(formData.jrnlm_trdat)}</strong>
          </div>
        </div>
      </div>

      {/* Header group: Bill To + meta grid + narration in a single block */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 2,
          overflow: "hidden",
        }}
      >
        {/* Bill To */}
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

        {/* Meta grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "4px 12px",
            padding: "2px 8px",
            borderBottom: formData.jrnlm_narrt ? "1px solid #e5e7eb" : "none",
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

        {/* Narration */}
        {formData.jrnlm_narrt && (
          <div style={{ fontSize: 10, padding: "2px 8px" }}>
            <span style={{ fontWeight: 700 }}>Narration: </span>
            {formData.jrnlm_narrt}
          </div>
        )}
      </div>

      {/* Lines table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 9,
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 24, textAlign: "right" }}>#</th>
            <th style={{ textAlign: "left" }}>Products</th>
            <th style={{ textAlign: "left" }}>Description</th>
            <th style={{ width: 90, textAlign: "right" }}>Debit</th>
            <th style={{ width: 90, textAlign: "right" }}>Credit</th>
          </tr>
        </thead>
        <tbody>
          {listDataItem.map((item, idx) => (
            <tr key={item.id || idx}>
              <td style={{ textAlign: "right" }}>{idx + 1}</td>
              <td style={{ textAlign: "left" }}>{item.party_cname || "—"}</td>
              <td style={{ textAlign: "left" }}>{item.jrnlc_descr || "—"}</td>
              <td style={{ textAlign: "right" }}>
                {Number(item.jrnlc_drval) ? fmt(item.jrnlc_drval) : ""}
              </td>
              <td style={{ textAlign: "right" }}>
                {Number(item.jrnlc_crval) ? fmt(item.jrnlc_crval) : ""}
              </td>
            </tr>
          ))}
          {listDataItem.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "#666" }}>
                No invoice lines
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: "2px solid #000", fontWeight: 700 }}>
            <td colSpan={3} style={{ textAlign: "right", padding: "2px 6px" }}>
              Total
            </td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>
              {fmt(totalDr)}
            </td>
            <td style={{ textAlign: "right", padding: "2px 6px" }}>
              {fmt(totalCr)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in words */}
      <div style={{ fontSize: 9, margin: "2px 2px", fontWeight: 600 }}>
        Amount in words: {amountInWords(totalDr || totalCr)}
      </div>

      {/* Footer note */}
      <div style={{ fontSize: 8, color: "#555", margin: "2px 2px" }}>
        Amounts are in {formData.jrnlm_crncy || "BDT"}. This is a computer
        generated invoice and does not require a signature when printed from the
        system.
      </div>

      {/* Signatures */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          marginTop: 16,
        }}
      >
        {["Prepared By", "Authorized"].map((role) => (
          <div key={role} style={{ textAlign: "center", fontSize: 9 }}>
            <div
              style={{
                marginTop: 18,
                borderTop: "1px solid #000",
                paddingTop: 2,
              }}
            >
              {role}
            </div>
            {role === "Prepared By" && (
              <div style={{ marginTop: 2, fontWeight: 600 }}>
                {formData.crusr_cname || DEFAULT_SIGNER_NAME}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicePrint;
