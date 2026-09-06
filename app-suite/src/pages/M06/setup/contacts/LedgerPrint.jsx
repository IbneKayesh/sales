import { useApp } from "@/context/AppContext";
import { formatDate } from "@/utils/datetime";
import {
  fmt,
  amountInWords,
  DEFAULT_SIGNER_NAME,
  PrintModal,
  PrintHeader,
  PrintFooter,
  PrintTable,
  Summary,
  MetaGrid,
} from "@/print";

/**
 * Contact Ledger Statement Print component (A4).
 */
const LedgerPrint = ({ open, onClose, formData = {}, listDataItem = [] }) => {
  const { business } = useApp();

  const firstRow = listDataItem[0] || {};
  const contact = {
    cntct_cname: formData.cntct_cname || firstRow.cntct_cname || "",
    cntct_ccode: formData.cntct_ccode || firstRow.cntct_ccode || "",
    cntct_ctype: formData.cntct_ctype || firstRow.cntct_ctype || "",
    cntct_cntps: formData.cntct_cntps || firstRow.cntct_cntps || "",
    cntct_cntno: formData.cntct_cntno || firstRow.cntct_cntno || "",
    cntct_email: formData.cntct_email || firstRow.cntct_email || "",
    cntct_ofadr: formData.cntct_ofadr || firstRow.cntct_ofadr || "",
    cntct_cntry: formData.cntct_cntry || firstRow.cntct_cntry || "",
    party_ccode: formData.party_ccode || firstRow.party_ccode || "",
  };

  // Compute running balance
  let cumulative = 0;
  let totalDr = 0;
  let totalCr = 0;

  const tableRows = (listDataItem || []).map((row, idx) => {
    const dr = Number(row.jrnlc_drval) || 0;
    const cr = Number(row.jrnlc_crval) || 0;
    totalDr += dr;
    totalCr += cr;
    cumulative += dr - cr;
    return {
      ...row,
      _idx: idx + 1,
      _dr: dr,
      _cr: cr,
      _balance: cumulative,
    };
  });

  const closingBalance = cumulative;
  const balanceText = `${fmt(Math.abs(closingBalance))} ${closingBalance >= 0 ? "Dr" : "Cr"}`;
  const statementTitle = contact.cntct_ctype
    ? `${contact.cntct_ctype.toUpperCase()} LEDGER STATEMENT`
    : "CONTACT LEDGER STATEMENT";

  return (
    <PrintModal
      open={open}
      onClose={onClose}
      title={`Ledger - ${contact.cntct_cname || contact.cntct_ccode || "Statement"}`}
      mode="a4"
      repeatHeader
      repeatFooter
      header={
        <PrintHeader
          company={{
            name: business?.bsins_cname,
            address: business?.bsins_ofadr || business?.bsins_addr,
            taxId: business?.bsins_bin,
          }}
          title={statementTitle}
          subtitle={contact.cntct_cname || ""}
          docNoLabel="Contact Code"
          docNo={contact.cntct_ccode || "—"}
          dateLabel="Date"
          date={formatDate(new Date())}
          extra={[
            ...(contact.party_ccode
              ? [{ label: "Sub Ledger", value: contact.party_ccode }]
              : []),
            ...(contact.cntct_cntno
              ? [{ label: "Phone", value: contact.cntct_cntno }]
              : []),
          ]}
        />
      }
      body={
        <>
          {/* Contact Details Card */}
          <div className="print-party-block">
            <MetaGrid
              columns="repeat(4, 1fr)"
              items={[
                { label: "Contact Name", value: contact.cntct_cname },
                { label: "Contact Person", value: contact.cntct_cntps },
                { label: "Contact No", value: contact.cntct_cntno },
                { label: "Email", value: contact.cntct_email },
                { label: "Address", value: contact.cntct_ofadr },
                { label: "Country", value: contact.cntct_cntry },
                { label: "Category", value: contact.cntct_ctype },
                { label: "Sub Ledger Code", value: contact.party_ccode },
              ].filter((i) => i.value)}
            />
          </div>

          {/* Transactions Ledger Table */}
          <PrintTable
            columns={[
              {
                key: "_idx",
                header: "#",
                width: 24,
                align: "right",
                render: (r) => r._idx,
              },
              {
                key: "jrnlm_trdat",
                header: "Date",
                width: 75,
                render: (r) => formatDate(r.jrnlm_trdat),
              },
              {
                key: "jrnlm_refno",
                header: "Ref No",
                width: 90,
                render: (r) => r.jrnlm_refno || "—",
              },
              {
                key: "jrnlc_sorce",
                header: "Source",
                width: 70,
                render: (r) => r.jrnlc_sorce || "—",
              },
              {
                key: "jrnlc_descr",
                header: "Description",
                render: (r) => r.jrnlc_descr || "—",
              },
              {
                key: "jrnlc_drval",
                header: "Debit",
                width: 85,
                align: "right",
                render: (r) => (r._dr ? fmt(r._dr) : "—"),
              },
              {
                key: "jrnlc_crval",
                header: "Credit",
                width: 85,
                align: "right",
                render: (r) => (r._cr ? fmt(r._cr) : "—"),
              },
              {
                key: "_balance",
                header: "Balance",
                width: 95,
                align: "right",
                render: (r) =>
                  `${fmt(Math.abs(r._balance))} ${r._balance >= 0 ? "Dr" : "Cr"}`,
              },
            ]}
            rows={tableRows}
            emptyText="No transactions found for this contact"
            footer={
              <tr className="print-table-footer">
                <td colSpan={5}>Total ({tableRows.length} transactions)</td>
                <td>{fmt(totalDr)}</td>
                <td>{fmt(totalCr)}</td>
                <td>{balanceText}</td>
              </tr>
            }
          />

          {/* Summary Totals */}
          <Summary
            rows={[
              { label: "Total Debit Amount", value: fmt(totalDr) },
              { label: "Total Credit Amount", value: fmt(totalCr) },
              {
                label: "Net Closing Balance",
                value: balanceText,
                strong: true,
                divider: true,
              },
            ]}
          />
        </>
      }
      footer={
        <PrintFooter
          currency={business?.bsins_crncy || "BDT"}
          docName="ledger statement"
          amountInWordsText={amountInWords(Math.abs(closingBalance))}
          signerName={DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Checked By", "Authorized"]}
        />
      }
    />
  );
};

export default LedgerPrint;
