import { formatDate } from "@/utils/datetime.js";
import {
  fmt,
  DEFAULT_SIGNER_NAME,
  PrintModal,
  PrintHeader,
  PrintFooter,
  PrintTable,
  MetaGrid,
} from "@/print";

/**
 * Journal voucher print — thin wrapper around the generic PrintModal.
 * Meta data goes to the header grid, journal lines to the body table, and
 * the signature block to the footer. Header & footer repeat on every page.
 */
const JournalPrint = ({
  open,
  onClose,
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
    <PrintModal
      open={open}
      onClose={onClose}
      title={`Journal Voucher - ${
        formData.jrnlm_trnno || formData.jrnlm_refno || ""
      }`}
      mode="a4"
      repeatHeader
      repeatFooter
      header={
        <PrintHeader
          title="JOURNAL VOUCHER"
          subtitle={formData.jrnlm_trtyp || "Journal Entry"}
          docNoLabel="Voucher No"
          docNo={formData.jrnlm_trnno || formData.jrnlm_refno}
          date={formatDate(formData.jrnlm_trdat)}
        />
      }
      body={
        <>
          <div className="print-party-block" style={{ padding: 0 }}>
            <MetaGrid
              columns="repeat(4, 1fr)"
              items={[
                { label: "Department", value: deptName },
                { label: "Fiscal Year", value: fyName },
                { label: "Period", value: prdName },
                { label: "Currency", value: formData.jrnlm_crncy },
                { label: "Reference No", value: formData.jrnlm_refno },
                { label: "Transaction Date", value: formatDate(formData.jrnlm_trdat) },
                { label: "Journal Type", value: formData.jrnlm_trtyp },
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
              { key: "chtac_cname", header: "Account (Ledger)", render: (r) => r.chtac_cname || "Invalid GL" },
              { key: "party_cname", header: "Sub Ledger" },
              { key: "jrnlc_descr", header: "Description" },
              { key: "jrnlc_drval", header: "Debit", width: 90, align: "right", render: (r) => (Number(r.jrnlc_drval) ? fmt(r.jrnlc_drval) : "") },
              { key: "jrnlc_crval", header: "Credit", width: 90, align: "right", render: (r) => (Number(r.jrnlc_crval) ? fmt(r.jrnlc_crval) : "") },
            ]}
            rows={listDataItem}
            emptyText="No journal lines"
            footer={
              <tr className="print-table-footer">
                <td colSpan={4}>Total</td>
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
          docName="voucher"
          signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Checked By", "Approved By"]}
        />
      }
    />
  );
};

export default JournalPrint;