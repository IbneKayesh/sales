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
 * Compact 80mm thermal receipt variant for MRR.
 */
const PosReceipt = ({ business, formData, listDataItem, supplier }) => {
  const currency = formData.mrrdm_crncy || business?.bsins_crncy || "BDT";

  const totals = [
    { label: "Total Amount", value: fmt(formData.mrrdm_tramt) },
    { label: "Item Discount", value: fmt(formData.mrrdm_itmds) },
    ...(formData.mrrdm_invds
      ? [{ label: "Invoice Discount", value: fmt(formData.mrrdm_invds) }]
      : []),
    ...(Number(formData.mrrdm_ivtmt)
      ? [{ label: "iVAT Amount", value: fmt(formData.mrrdm_ivtmt) }]
      : []),
    { label: "VAT", value: fmt(formData.mrrdm_vtamt) },
    { label: "Payable", value: fmt(formData.mrrdm_pyamt), strong: true, top: true },
    { label: "Paid", value: fmt(formData.mrrdm_pdamt) },
    { label: "Due", value: fmt(formData.mrrdm_duamt), strong: true },
  ];

  return (
    <div className="pos-receipt">
      {/* Supplier & Doc info */}
      <div style={{ marginBottom: 4 }}>
        <div className="pos-receipt__line">
          <span>Supplier</span>
          <strong>{supplier?.cntct_cname || formData.mrrdm_cntct || "—"}</strong>
        </div>
        {formData.mrrdm_refno && (
          <div className="pos-receipt__line">
            <span>Ref No</span>
            <strong>{formData.mrrdm_refno}</strong>
          </div>
        )}
      </div>
      <div className="pos-receipt__divider" />

      {/* Item rows */}
      {listDataItem.map((r, idx) => (
        <div key={r.id || idx} style={{ marginBottom: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 600 }}>
            {r.items_iname || "—"}
          </div>
          <div className="pos-receipt__line">
            <span>
              {fmt(r.mrrdc_itqty)} {r.runit_uname || ""} x {fmt(r.mrrdc_itrat)}
            </span>
            <span>{fmt(r.mrrdc_itamt)}</span>
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
        In words: {amountInWords(formData.mrrdm_pyamt)}
      </div>
    </div>
  );
};

/**
 * MRR print — thin document wrapper around the generic PrintModal.
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
    <PrintModal
      open={open}
      onClose={onClose}
      title={`MRR - ${formData.mrrdm_trnno || formData.mrrdm_refno || ""}`}
      mode="a4"
      repeatHeader
      repeatFooter
      body80={
        <PosReceipt
          business={business}
          formData={formData}
          listDataItem={listDataItem}
          supplier={supplier}
        />
      }
      header={
        <PrintHeader
          company={{
            name: business?.bsins_cname,
            address: business?.bsins_ofadr || business?.bsins_addr,
            taxId: business?.bsins_bin,
          }}
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
        />
      }
      body={
        <>
          {/* Supplier block */}
          <div className="print-party-block">
            <MetaItem
              label="Supplier"
              value={supplier?.cntct_cname || formData.mrrdm_cntct || "—"}
            />
            {supplier?.cntct_ofadr && (
              <div className="print-party-detail">
                {supplier.cntct_ofadr}
              </div>
            )}
            {supplier?.cntct_cntno && (
              <div className="print-party-detail">
                {supplier.cntct_cntps || "Contact"}: {supplier.cntct_cntno}
              </div>
            )}
          </div>
          {formData.mrrdm_notes && (
            <div className="print-remarks">
              <strong>Remarks: </strong>
              {formData.mrrdm_notes}
            </div>
          )}

          {/* Items table */}
          <PrintTable
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
              <tr className="print-table-footer">
                <td colSpan={3}>Total ({listDataItem.length} lines)</td>
                <td>{fmt(totalQty)}</td>
                <td />
                <td>{fmt(formData.mrrdm_tramt)}</td>
                <td />
                <td>{fmt(formData.mrrdm_itmds)}</td>
                <td>{fmt(formData.mrrdm_vtamt)}</td>
                <td>{fmt(formData.mrrdm_pyamt)}</td>
              </tr>
            }
          />

          {/* Summary */}
          <Summary
            rows={[
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
          currency={formData.mrrdm_crncy || "BDT"}
          docName="MRR"
          amountInWordsText={amountInWords(formData.mrrdm_pyamt)}
          signerName={formData.crusr_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Authorized"]}
        />
      }
    />
  );
};

export default PrintPage;