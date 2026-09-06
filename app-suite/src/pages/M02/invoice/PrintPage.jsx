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
  PrintSection,
  Summary,
  MetaItem,
} from "@/print";


/**
 * POS receipt variant — compact 80mm thermal-roll layout for the invoice.
 * Omitted vs. the A4 version: costing/payment tables, signature grid and the
 * full-width header; kept: company block, meta, two-line item rows, totals,
 * amount in words and a thank-you footer.
 */
const PosReceipt = ({ business, formData, listDataItem, customer }) => {
  const currency = formData.invcm_crncy || business?.bsins_crncy || "BDT";

  const totals = [
    { label: "Total Amount", value: fmt(formData.invcm_tramt) },
    { label: "Item Discount", value: fmt(formData.invcm_itmds) },
    ...(formData.invcm_invds
      ? [{ label: "Invoice Discount", value: fmt(formData.invcm_invds) }]
      : []),
    ...(Number(formData.invcm_lylds)
      ? [{ label: "Loyalty Discount", value: fmt(formData.invcm_lylds) }]
      : []),
    { label: "VAT", value: fmt(formData.invcm_vtamt) },
    { label: "Payable", value: fmt(formData.invcm_pyamt), strong: true, top: true },
    { label: "Paid", value: fmt(formData.invcm_pdamt) },
    { label: "Due", value: fmt(formData.invcm_duamt), strong: true },
  ];

  return (
    <div className="pos-receipt">
      {/* Company block */}
      <div className="print-hdr__company">
        <div className="print-hdr-80__company-name">
          {business?.bsins_cname || "AppSuite Inc."}
        </div>
        {(business?.bsins_ofadr || business?.bsins_addr) && (
          <div className="print-hdr__company-detail">
            {business.bsins_ofadr || business.bsins_addr}
          </div>
        )}
        {business?.bsins_bin && (
          <div className="print-hdr__company-tax">{business.bsins_bin}</div>
        )}
        <div className="pos-receipt__divider" />
        <div className="print-hdr-80__title">
          {formData.invcm_ttype || "INVOICE"}
        </div>
      </div>

      {/* Meta */}
      <div style={{ marginBottom: 4 }}>
        <div className="pos-receipt__line">
          <span>Invoice No</span>
          <strong>{formData.invcm_trnno || formData.invcm_refno || "—"}</strong>
        </div>
        <div className="pos-receipt__line">
          <span>Date</span>
          <strong>{formatDate(formData.invcm_trdat)}</strong>
        </div>
        <div className="pos-receipt__line">
          <span>Customer</span>
          <strong>{customer?.cntct_cname || formData.invcm_cntct || "—"}</strong>
        </div>
        {formData.invcm_refno && (
          <div className="pos-receipt__line">
            <span>Ref</span>
            <strong>{formData.invcm_refno}</strong>
          </div>
        )}
      </div>
      <div className="pos-receipt__divider" />

      {/* Item rows — name line + "qty × rate = amount" line */}
      {listDataItem.map((r, idx) => (
        <div key={r.id || idx} style={{ marginBottom: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 600 }}>
            {r.items_iname || "—"}
          </div>
          <div className="pos-receipt__line">
            <span>
              {fmt(r.invcc_itqty)} x {fmt(r.invcc_itrat)}
            </span>
            <span>{fmt(r.invcc_itamt)}</span>
          </div>
        </div>
      ))}
      <div className="pos-receipt__divider" />

      {/* Totals */}
      <div className="pos-receipt__totals">
        {totals.map((row, idx) => (
          <div
            key={idx}
            className={`pos-receipt__total-row ${row.strong ? "print-summary__row--strong" : ""}`}
          >
            <span className={row.top ? "print-summary__row--divider" : ""}>
              {row.label}
            </span>
            <strong
              className={[
                "print-summary__value",
                row.strong ? "print-summary__row--strong" : "",
                row.top ? "print-summary__row--divider" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {row.value}
            </strong>
          </div>
        ))}
      </div>
      <div className="pos-receipt__total-divider" />

      {/* Amount in words + footer */}
      <div className="print-ftr-80__words">
        In words: {amountInWords(formData.invcm_pyamt)}
      </div>
      <div className="print-ftr-80__note">
        Amounts are in {currency}. Computer generated invoice.
      </div>
      <div className="print-ftr-80__thankyou">
        *** THANK YOU ***
      </div>
    </div>
  );
};

/**
 * Invoice print (Sales Invoice - M02) — thin wrapper around the generic
 * PrintModal. Company + title data go to the header, customer block / items /
 * summary / costing / payments to the body JSX, and the amount note +
 * signatures to the footer. A POS receipt variant is available via the
 * A4 / POS toggle in the modal toolbar.
 */
const PrintPage = ({
  open,
  onClose,
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
    <PrintModal
      open={open}
      onClose={onClose}
      title={`Invoice - ${formData.invcm_trnno || formData.invcm_refno || ""}`}
      mode="a4"
      repeatHeader
      repeatFooter
      posBody={
        <PosReceipt
          business={business}
          formData={formData}
          listDataItem={listDataItem}
          customer={customer}
        />
      }
      header={
        <PrintHeader
          company={{
            name: business?.bsins_cname,
            address: business?.bsins_ofadr || business?.bsins_addr,
            taxId: business?.bsins_bin,
          }}
          title={formData.invcm_ttype || "INVOICE"}
          subtitle={deptName || business?.bsins_cname || ""}
          docNoLabel="Invoice No"
          docNo={formData.invcm_trnno || formData.invcm_refno}
          date={formatDate(formData.invcm_trdat)}
          extra={[
            { label: "Ref No", value: formData.invcm_refno },
            { label: "Currency", value: formData.invcm_crncy || business?.bsins_crncy || "BDT" },
          ]}
        />
      }
      body={
        <>
          {/* Customer block */}
          <div className="print-party-block">
            <MetaItem
              label="Customer"
              value={customer?.cntct_cname || formData.invcm_cntct || "—"}
            />
            {customer?.cntct_ofadr && (
              <div className="print-party-detail">
                {customer.cntct_ofadr}
              </div>
            )}
            {customer?.cntct_cntno && (
              <div className="print-party-detail">
                {customer.cntct_cntps || "Contact"}: {customer.cntct_cntno}
              </div>
            )}
          </div>
          {formData.invcm_notes && (
            <div className="print-remarks">
              <strong>Remarks: </strong>
              {formData.invcm_notes}
            </div>
          )}

          {/* Items table */}
          <PrintTable
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
              <tr className="print-table-footer">
                <td colSpan={3}>Total ({listDataItem.length} lines)</td>
                <td>{fmt(totalQty)}</td>
                <td />
                <td>{fmt(formData.invcm_tramt)}</td>
                <td />
                <td>{fmt(formData.invcm_itmds)}</td>
                <td>{fmt(formData.invcm_vtamt)}</td>
                <td>{fmt(formData.invcm_pyamt)}</td>
              </tr>
            }
          />

          {/* Summary */}
          <Summary
            rows={[
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
          />

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
        </>
      }
      footer={
        <PrintFooter
          currency={formData.invcm_crncy || "BDT"}
          docName="invoice"
          amountInWordsText={amountInWords(formData.invcm_pyamt)}
          signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Authorized"]}
        />
      }
    />
  );
};

export default PrintPage;