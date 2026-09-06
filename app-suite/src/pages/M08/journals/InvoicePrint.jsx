import { formatDate } from "@/utils/datetime.js";
import { useApp } from "@/context/AppContext";
import {
  fmt,
  MetaItem,
  amountInWords,
  DEFAULT_SIGNER_NAME,
  PrintModal,
  PrintHeader,
  PrintFooter,
  PrintTable,
  MetaGrid,
} from "@/print";

/**
 * Client invoice print (from journal) — thin wrapper around the generic
 * PrintModal. Bill To / meta go to the header area, invoice lines to the
 * body table, and the amount note + signatures to the footer.
 */
const InvoicePrint = ({ open, onClose, formData, listDataItem, dpart_Options }) => {
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
    <PrintModal
      open={open}
      onClose={onClose}
      title={`${
        formData.jrnlm_trtyp || "Invoice"
      } - ${formData.jrnlm_trnno || formData.jrnlm_refno || ""}`}
      mode="a4"
      repeatHeader
      repeatFooter
      header={
        <PrintHeader
          company={{ name: business?.bsins_cname }}
          title={formData.jrnlm_trtyp || "INVOICE"}
          subtitle={deptName || business?.bsins_cname || ""}
          docNoLabel="Invoice No"
          docNo={formData.jrnlm_trnno || formData.jrnlm_refno}
          date={formatDate(formData.jrnlm_trdat)}
        />
      }
      body={
        <>
          <div className="print-party-block" style={{ padding: 0 }}>
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
            <MetaGrid
              columns="repeat(5, 1fr)"
              items={[
                { label: "Department", value: deptName },
                { label: "Currency", value: formData.jrnlm_crncy },
                { label: "Reference No", value: formData.jrnlm_refno },
                { label: "Transaction Date", value: formatDate(formData.jrnlm_trdat) },
                { label: "Status", value: formData.jrnlm_stats },
              ]}
            />
          </div>
          {formData.jrnlm_narrt && (
            <div className="print-remarks">
              <strong>Narration: </strong>
              {formData.jrnlm_narrt}
            </div>
          )}

          <PrintTable
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
              <tr className="print-table-footer">
                <td colSpan={3}>Total</td>
                <td>{fmt(totalDr)}</td>
                <td>{fmt(totalCr)}</td>
              </tr>
            }
          />
        </>
      }
      footer={
        <PrintFooter
          currency={formData.jrnlm_crncy || "BDT"}
          docName="invoice"
          amountInWordsText={amountInWords(totalDr || totalCr)}
          signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Authorized"]}
        />
      }
    />
  );
};

export default InvoicePrint;