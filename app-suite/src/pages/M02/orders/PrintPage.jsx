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
 * Compact 80mm thermal receipt variant for the Sales Order.
 */
const PosReceipt = ({ formData, listDataItem, customer }) => {
  const totals = [
    { label: "Total Amount", value: fmt(formData.odrdm_tramt) },
    { label: "Item Discount", value: fmt(formData.odrdm_itmds) },
    ...(formData.odrdm_invds
      ? [{ label: "Invoice Discount", value: fmt(formData.odrdm_invds) }]
      : []),
    { label: "VAT", value: fmt(formData.odrdm_vtamt) },
    { label: "Payable", value: fmt(formData.odrdm_pyamt), strong: true, top: true },
    { label: "Paid", value: fmt(formData.odrdm_pdamt) },
    { label: "Due", value: fmt(formData.odrdm_duamt), strong: true },
  ];

  return (
    <div className="pos-receipt">
      {/* Doc info */}
      <div style={{ marginBottom: 4 }}>
        <div className="pos-receipt__line">
          <span>SO No</span>
          <strong>{formData.odrdm_trnno || formData.odrdm_refno || "—"}</strong>
        </div>
        <div className="pos-receipt__line">
          <span>Date</span>
          <strong>{formatDate(formData.odrdm_trdat)}</strong>
        </div>
        <div className="pos-receipt__line">
          <span>Customer</span>
          <strong>{customer?.cntct_cname || formData.odrdm_cntct || "—"}</strong>
        </div>
        {formData.odrdm_refno && (
          <div className="pos-receipt__line">
            <span>Ref No</span>
            <strong>{formData.odrdm_refno}</strong>
          </div>
        )}
      </div>
      <div className="pos-receipt__divider" />

      {/* Item rows */}
      {listDataItem.map((r, idx) => (
        <div key={r.id || idx} style={{ marginBottom: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 600 }}>
            {r.items_iname || r.price_cname || "—"}
          </div>
          <div className="pos-receipt__line">
            <span>
              {fmt(r.odrdc_itqty)} {r.runit_cname || ""} x {fmt(r.odrdc_itrat)}
            </span>
            <span>{fmt(r.odrdc_itamt)}</span>
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

      {/* Amount in words */}
      <div className="print-ftr-80__words">
        In words: {amountInWords(formData.odrdm_pyamt)}
      </div>
    </div>
  );
};

/**
 * Sales Order print (M02) — thin document wrapper around the generic
 * PrintModal. `formData` is the order master (odrdm_*) and `listDataItem` the
 * order lines (odrdc_*); costing (mrrcs_*) and payments (mrrpy_*) mirror the
 * Orders module's own child tables.
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

  // Business-wide default currency — the amount-in-words row only names the
  // currency when this order's currency differs from it.
  const businessCurrency = business?.bsins_crncy || "BDT";
  const docCurrency = formData.odrdm_crncy || businessCurrency;

  const deptName =
    dpart_Options?.find((o) => o.id === formData.odrdm_dpart)?.dpart_cname ||
    formData.dpart_cname ||
    formData.odrdm_dpart ||
    "";

  const customer =
    cntct_Options?.find((o) => o.id === formData.odrdm_cntct) || null;

  const totalQty = listDataItem.reduce(
    (s, i) => s + (Number(i.odrdc_itqty) || 0),
    0,
  );

  return (
    <PrintModal
      open={open}
      onClose={onClose}
      title={`Sales Order - ${formData.odrdm_trnno || formData.odrdm_refno || ""}`}
      mode="a4"
      repeatHeader
      repeatFooter
      body80={
        <PosReceipt
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
          title={formData.odrdm_ttype || "SALES ORDER"}
          subtitle={deptName || business?.bsins_cname || ""}
          docNoLabel="SO No"
          docNo={formData.odrdm_trnno || formData.odrdm_refno}
          date={formatDate(formData.odrdm_trdat)}
          extra={[
            { label: "Ref No", value: formData.odrdm_refno },
            { label: "Currency", value: docCurrency },
            ...(formData.odrdm_vehid
              ? [{ label: "Vehicle", value: formData.odrdm_vehid }]
              : []),
          ]}
        />
      }
      body={
        <>
          {/* Customer block */}
          <div className="print-party-block">
            <MetaItem
              label="Customer"
              value={customer?.cntct_cname || formData.cntct_cname || "—"}
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
          {formData.odrdm_notes && (
            <div className="print-remarks">
              <strong>Remarks: </strong>
              {formData.odrdm_notes}
            </div>
          )}

          {/* Items table */}
          <PrintTable
            columns={[
              { key: "#", header: "#", width: 24, align: "right", render: (_, idx) => idx + 1 },
              { key: "items_iname", header: "Item", render: (r) => r.items_iname || r.price_cname || "—" },
              { key: "runit_cname", header: "Unit" },
              { key: "odrdc_itqty", header: "Qty", width: 55, align: "right", render: (r) => fmt(r.odrdc_itqty) },
              { key: "odrdc_itrat", header: "Rate", width: 70, align: "right", render: (r) => fmt(r.odrdc_itrat) },
              { key: "odrdc_itamt", header: "Amount", width: 70, align: "right", render: (r) => fmt(r.odrdc_itamt) },
              { key: "odrdc_dspct", header: "Disc %", width: 55, align: "right", render: (r) => (r.odrdc_dspct ? Number(r.odrdc_dspct) + "%" : "—") },
              { key: "odrdc_dsamt", header: "Disc Amt", width: 70, align: "right", render: (r) => fmt(r.odrdc_dsamt) },
              { key: "odrdc_vtamt", header: "VAT", width: 70, align: "right", render: (r) => fmt(r.odrdc_vtamt) },
              { key: "odrdc_pyamt", header: "Payable", width: 70, align: "right", render: (r) => fmt(r.odrdc_pyamt) },
            ]}
            rows={listDataItem}
            emptyText="No items"
            footer={
              <tr className="print-table-footer">
                <td colSpan={3}>Total ({listDataItem.length} lines)</td>
                <td>{fmt(totalQty)}</td>
                <td />
                <td>{fmt(formData.odrdm_tramt)}</td>
                <td />
                <td>{fmt(formData.odrdm_itmds)}</td>
                <td>{fmt(formData.odrdm_vtamt)}</td>
                <td>{fmt(formData.odrdm_pyamt)}</td>
              </tr>
            }
          />

          {/* Summary */}
          <Summary
            rows={[
              { label: "Total Amount", value: fmt(formData.odrdm_tramt) },
              { label: "Item Discount", value: fmt(formData.odrdm_itmds) },
              ...(formData.odrdm_invds
                ? [{ label: "Invoice Discount", value: fmt(formData.odrdm_invds) }]
                : []),
              { label: "VAT Amount", value: fmt(formData.odrdm_vtamt) },
              { label: "Include Cost", value: fmt(formData.odrdm_icamt) },
              { label: "Exclude Cost", value: fmt(formData.odrdm_ecamt) },
              { label: "Payable Amount", value: fmt(formData.odrdm_pyamt), strong: true, divider: true },
              { label: "Paid Amount", value: fmt(formData.odrdm_pdamt) },
              { label: "Due Amount", value: fmt(formData.odrdm_duamt), strong: true },
              {
                label:
                  docCurrency === businessCurrency
                    ? "Amount in Words"
                    : `Amount in Words (${docCurrency})`,
                value: amountInWords(formData.odrdm_pyamt),
              },
            ]}
          />

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
        </>
      }
      footer={
        <PrintFooter
          docName="Sales Order"
          signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Authorized"]}
        />
      }
    />
  );
};

export default PrintPage;