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
  MetaGrid,
} from "@/print";

import ConvertUOM from "@/components/common/ConvertUOM";
import ConvertSize from "@/components/common/ConvertSize";

/**
 * Delivery Trip Print component (A4).
 */
const DeliveryTripPrint = ({ open, onClose, formData }) => {
  const { user, business } = useApp();

  const summary = formData?.summary?.[0] || {};
  let totalInv = 0;
  let totalDue = 0;
  let totalCol = 0;
  const details = (formData?.details || []).map((row, idx) => {
    const inv = Number(row.tripc_inval) || 0;
    const due = Number(row.tripc_duval) || 0;
    const col = Number(row.tripc_clval) || 0;
    totalInv += inv;
    totalDue += due;
    totalCol += col;
    return {
      ...row,
      _idx: idx + 1,
    };
  });
  const totalDueBalance = Number(totalDue) - Number(totalCol);

  const items = (formData?.items || []).map((row, idx) => {
    return {
      ...row,
      _idx: idx + 1,
    };
  });

  // Group orders by order (odrdm_trnno or odrdc_odrdm)
  const orderGroups = (formData?.orders || []).reduce((acc, row) => {
    const key = row.odrdm_trnno || row.odrdc_odrdm || `order_${acc.length}`;
    let group = acc.find((g) => g.orderKey === key);
    if (!group) {
      group = {
        orderKey: key,
        dpart_cname: row.dpart_cname,
        cntct_cname: row.cntct_cname,
        odrdm_trnno: row.odrdm_trnno,
        odrdm_trdat: row.odrdm_trdat,
        odrdm_notes: row.odrdm_notes,
        odrdm_pyamt: row.odrdm_pyamt,
        odrdm_pdamt: row.odrdm_pdamt,
        odrdm_duamt: row.odrdm_duamt,
        tripc_dldat: row.tripc_dldat,
        tripc_isdlv: row.tripc_isdlv,
        tripc_atmpt: row.tripc_atmpt,
        items: [],
      };
      acc.push(group);
    }
    group.items.push({
      ...row,
      _idx: group.items.length + 1,
    });
    // console.log("acc", acc);
    return acc;
  }, []);

  const statementTitle = `${summary.tripm_trnno || ""} ~ DELIVERY TRIP`;

  return (
    <PrintModal
      open={open}
      onClose={onClose}
      title={`Delivery Trip - ${summary.tripm_trnno || ""} ~ ${summary.party_cname || ""}`}
      mode="a4"
      orientation="portrait"
      repeatHeader
      repeatFooter
      header={
        <PrintHeader
          company={{
            name: business?.bsins_cname,
            contact: business?.bsins_cntct + ", " + business?.bsins_email,
            address: business?.bsins_addrs + ", " + business?.bsins_timzn,
            taxId: business?.bsins_binno,
          }}
          title={statementTitle}
          subtitle={`${summary.dpart_cname || "-"} [${summary.tripm_sorce || "—"}]`}
          docNoLabel="Party"
          docNo={summary.party_cname || "-"}
          dateLabel="Print Date"
          date={formatDate(new Date())}
          extra={[
            ...(summary.tripm_trdat
              ? [{ label: "Trip Date", value: formatDate(summary.tripm_trdat) }]
              : []),
          ]}
        />
      }
      body={
        <>
          {/* =========================================================
              SECTION 1: DETAILS + SUMMARY (Page 1)
              ========================================================= */}
          <div className="print-party-block">
            <MetaGrid
              columns="repeat(4, 1fr)"
              items={[
                { label: "VAN", value: summary.tripm_trpmv },
                { label: "By", value: summary.tripm_trpma },
                { label: "Notes", value: summary.tripm_notes },
                {
                  label: "Last Delivery",
                  value: formatDate(summary.tripm_lsdat),
                },
                { label: "Bill", value: fmt(summary.tripm_blamt) },
                {
                  label: "Status",
                  value: summary.tripm_ispnd ? "Delivered" : "Pending",
                },
              ]}
            />
          </div>

          {/* DETAILS Table */}
          <PrintTable
            columns={[
              {
                key: "_idx",
                header: "#",
                align: "left",
                render: (r) => r._idx + ".",
              },
              {
                key: "odrdm_trnno",
                header: "No",
                render: (r) => r.odrdm_trnno || "—",
              },
              {
                key: "cntct_cname",
                header: "Customer",
                render: (r) => `${r.cntct_cname}, ${r.tripc_addrs}` || "—",
              },
              {
                key: "tripc_isdlv",
                header: "Status",
                render: (r) => (r.tripc_isdlv ? "Delivered" : "Pending"),
              },
              {
                key: "tripc_atmpt",
                header: "Attempt",
                render: (r) => r.tripc_atmpt || "0",
              },
              {
                key: "tripc_inval",
                header: "Invoice",
                align: "right",
                render: (r) => fmt(r.tripc_inval) || "0",
              },
              {
                key: "tripc_duval",
                header: "Due",
                align: "right",
                render: (r) => fmt(r.tripc_duval) || "0",
              },
              {
                key: "tripc_clval",
                header: "Collections",
                align: "right",
                render: (r) => fmt(r.tripc_clval) || "0",
              },
              {
                key: "tripc_notes",
                header: "Notes",
                align: "right",
                render: (r) => r.tripc_notes || "—",
              },
            ]}
            rows={details}
            emptyText="No data found"
            footer={
              <tr className="print-table-footer">
                <td colSpan={6}>Total ({details.length} transactions)</td>
                <td>{fmt(totalInv)}</td>
                <td>{fmt(totalDue)}</td>
                <td>{fmt(totalCol)}</td>
                <td colSpan={2}></td>
              </tr>
            }
          />

          {/* Summary Totals */}
          <Summary
            rows={[
              { label: "Total Due", value: fmt(totalDue) },
              { label: "Total Collection", value: fmt(totalCol) },
              {
                label: "Net Due Balance",
                value: fmt(totalDueBalance),
                strong: true,
                divider: true,
              },
            ]}
          />

          {/* =========================================================
              SECTION 2: ITEMS — Always start a new page
              ========================================================= */}
          <div
            className="page-break print-page-break"
            style={{ pageBreakBefore: "always", breakBefore: "page" }}
          >
            <PrintSection title="Trip Items" marginTop={14}>
              <PrintTable
                columns={[
                  {
                    key: "_idx",
                    header: "#",
                    align: "left",
                    render: (r) => r._idx + ".",
                  },
                  {
                    key: "price_cname",
                    header: "Item",
                    render: (r) => r.price_cname || "—",
                  },
                  {
                    key: "items_pkqty",
                    header: "Pack",
                    render: (r) => (
                      <ConvertUOM
                        qty={r.odrdc_itqty}
                        dfQty={r.items_pkqty}
                        runit={r.runit_cname}
                        punit={r.punit_cname}
                      />
                    ),
                  },
                  {
                    key: "items_szqty",
                    header: "Size",
                    render: (r) => (
                      <ConvertSize
                        qty={r.odrdc_itqty}
                        dfQty={r.items_szqty}
                        sunit={r.sunit_cname}
                      />
                    ),
                  },
                  {
                    key: "odrdc_itqty",
                    header: "Qty",
                    align: "right",
                    render: (r) =>
                      `${fmt(r.odrdc_itqty)} ${r.runit_cname || ""}`.trim() ||
                      "0",
                  },
                ]}
                rows={items}
                emptyText="No items found"
                footer={
                  <tr className="print-table-footer">
                    <td colSpan={4}>Total ({items.length} items)</td>
                    <td>
                      {fmt(
                        items.reduce(
                          (sum, r) => sum + (Number(r.odrdc_itqty) || 0),
                          0,
                        ),
                      )}
                    </td>
                  </tr>
                }
              />
            </PrintSection>
          </div>

          {/* =========================================================
              SECTION 3: ORDERS — Group By MetaGrid, always start a new page
              ========================================================= */}
          {orderGroups.map((group, gIdx) => (
            <div
              key={group.orderKey || gIdx}
              className="page-break print-page-break"
              style={{ pageBreakBefore: "always", breakBefore: "page" }}
            >
              <PrintSection
                title={`${group.odrdm_trnno || `Order #${gIdx + 1}`}`}
                marginTop={14}
              >
                <div className="print-party-block">
                  {/* {JSON.stringify(group)} */}
                  <MetaGrid
                    columns="repeat(5, 1fr)"
                    items={[
                      { label: "Customer", value: group.cntct_cname || "—" },
                      {
                        label: "Date",
                        value: formatDate(group.odrdm_trdat) || "—",
                      },
                      { label: "Notes", value: group.odrdm_notes || "—" },
                      { label: "Payable", value: fmt(group.odrdm_pyamt) },
                      { label: "Paid", value: fmt(group.odrdm_pdamt) },
                      { label: "Due", value: fmt(group.odrdm_duamt) },
                      { label: "Discount", value: fmt(group.odrdm_itmds) },
                      {
                        label: "Delivered",
                        value: formatDate(group.tripc_dldat) || "—",
                      },
                      {
                        label: "Status",
                        value: group.tripc_isdlv ? "Delivered" : "Pending",
                      },
                      { label: "Attempt", value: group.tripc_atmpt || 0 },
                    ]}
                  />
                </div>

                <PrintTable
                  columns={[
                    {
                      key: "_idx",
                      header: "#",
                      align: "left",
                      render: (r) => r._idx + ".",
                    },
                    {
                      key: "price_cname",
                      header: "Item",
                      render: (r) => r.price_cname || "—",
                    },
                    {
                      key: "odrdc_itqty",
                      header: "Qty",
                      render: (r) =>
                        `${fmt(r.odrdc_itqty)} x ${fmt(r.odrdc_itrat)} ${r.runit_cname || ""} = ${fmt(r.odrdc_itqty * r.odrdc_itrat)}`.trim() ||
                        "0",
                    },
                    {
                      key: "odrdc_dsamt",
                      header: "Discount",
                      render: (r) => `${fmt(r.odrdc_dsamt)}` || "0",
                    },
                    {
                      key: "items_pkqty",
                      header: "Pack",
                      render: (r) => (
                        <ConvertUOM
                          qty={r.odrdc_itqty}
                          dfQty={r.items_pkqty}
                          runit={r.runit_cname}
                          punit={r.punit_cname}
                        />
                      ),
                    },
                    {
                      key: "items_szqty",
                      header: "Size",
                      render: (r) => (
                        <ConvertSize
                          qty={r.odrdc_itqty}
                          dfQty={r.items_szqty}
                          sunit={r.sunit_cname}
                        />
                      ),
                    },
                  ]}
                  rows={group.items}
                  emptyText="No items found for this order"
                  footer={
                    <tr className="print-table-footer">
                      <td colSpan={4}>Total ({group.items.length} items)</td>
                      <td>
                        {fmt(
                          group.items.reduce(
                            (sum, r) => sum + (Number(r.odrdc_itqty) || 0),
                            0,
                          ),
                        )}
                      </td>
                    </tr>
                  }
                />
              </PrintSection>
            </div>
          ))}
        </>
      }
      footer={
        <PrintFooter
          currency={business?.bsins_crncy || "BDT"}
          docName="Delivery Trip"
          amountInWordsText={amountInWords(totalDueBalance)}
          signerName={user?.users_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Checked By", "Authorized"]}
        />
      }
    />
  );
};

export default DeliveryTripPrint;
