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
  // Business-wide default currency. The Delivery Trip payload carries no
  // currency column of its own, so an order only states its currency in the
  // amount-in-words row when it differs from this default.
  const businessCurrency = business?.bsins_crncy || "BDT";
  const details = (formData?.details || []).map((row, idx) => ({
    ...row,
    _idx: idx + 1,
  }));

  const sumOf = (rows, field) =>
    rows.reduce((sum, row) => sum + (Number(row?.[field]) || 0), 0);

  const totalInv = sumOf(details, "tripc_inval");
  const totalDue = sumOf(details, "tripc_duval");
  const totalCol = sumOf(details, "tripc_clval");
  const totalDueBalance = Number(totalDue) - Number(totalCol);

  const items = (formData?.items || []).map((row, idx) => {
    return {
      ...row,
      _idx: idx + 1,
    };
  });

  // Trip-charge status columns (delivered date / delivered flag / attempts) are
  // not guaranteed to be on the order rows that make up a group — the print
  // payload carries them on the trip-charge rows (the DETAILS table). Keep a
  // lookup keyed by order no so each ORDER section can fall back to it.
  const detailByOrder = new Map();
  details.forEach((d) => {
    const key = d.odrdm_trnno || d.odrdc_odrdm;
    if (key && !detailByOrder.has(key)) detailByOrder.set(key, d);
  });

  // First non-empty value for a field across all rows of a group, since the
  // trip-charge columns may only be populated on some of the returned rows.
  const firstValue = (rows, field) => {
    for (const row of rows) {
      const value = row?.[field];
      if (value !== null && value !== undefined && value !== "") return value;
    }
    return undefined;
  };

  const resolveTripField = (group, field) =>
    firstValue(group.items, field) ??
    detailByOrder.get(group.odrdm_trnno)?.[field] ??
    detailByOrder.get(group.orderKey)?.[field];

  // Group orders by order (odrdm_trnno or odrdc_odrdm)
  const rawOrderGroups = (formData?.orders || []).reduce((acc, row) => {
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

  // Order-level totals. The order master columns are used when the print
  // payload carries them; otherwise they are summed from the order's rows the
  // same way the Orders module derives them when saving
  // (odrdm_pyamt = Σ odrdc_pyamt, odrdm_itmds = Σ odrdc_dsamt,
  //  odrdm_duamt = payable - paid).
  const orderGroups = rawOrderGroups.map((group) => {
    const rows = group.items;
    const payable =
      firstValue(rows, "odrdm_pyamt") ?? sumOf(rows, "odrdc_pyamt");
    // Payments are not part of the order rows, so "Paid" stays unknown ("—")
    // when the payload omits the order master column.
    const paid = firstValue(rows, "odrdm_pdamt");
    const due =
      firstValue(rows, "odrdm_duamt") ??
      (paid == null ? null : payable - paid);

    return {
      ...group,
      tripc_dldat: resolveTripField(group, "tripc_dldat"),
      tripc_isdlv: resolveTripField(group, "tripc_isdlv"),
      tripc_atmpt: resolveTripField(group, "tripc_atmpt"),
      odrdm_pyamt: payable,
      odrdm_pdamt: paid,
      odrdm_duamt: due,
      // Amount this order is answerable for — drives the order footer's
      // amount-in-words line (its due, or its payable when payment is unknown).
      _dueAmount: due ?? payable,
      // Currency this order is printed in (falls back to the business default).
      _currency: firstValue(rows, "odrdm_crncy") ?? businessCurrency,
      odrdm_itmds: firstValue(rows, "odrdm_itmds") ?? sumOf(rows, "odrdc_dsamt"),
    };
  });

  // Amount cell that shows a dash instead of a misleading 0.00 for values the
  // print payload does not carry.
  const money = (value) =>
    value === null || value === undefined || value === "" ? "—" : fmt(value);

  // Order footer rows: this order's totals, closing with the amount in words
  // (omitted when the order amount is not known at all). The currency is only
  // named when it differs from the business default, since that is what the
  // trip is normally printed in.
  const orderTotalsRows = (group) => {
    const showsCurrency =
      !!group._currency && group._currency !== businessCurrency;

    return [
      { label: "Discount", value: money(group.odrdm_itmds) },
      { label: "Payable", value: money(group.odrdm_pyamt) },
      { label: "Paid", value: money(group.odrdm_pdamt) },
      { label: "Due", value: money(group.odrdm_duamt), strong: true, divider: true },
      ...(group._dueAmount == null
        ? []
        : [
            {
              label: showsCurrency
                ? `Amount in Words (${group._currency})`
                : "Amount in Words",
              value: amountInWords(group._dueAmount),
            },
          ]),
    ];
  };

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
                render: (r) =>
                  [r.cntct_cname, r.tripc_addrs].filter(Boolean).join(", ") ||
                  "—",
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
                <td colSpan={5}>Total ({details.length} transactions)</td>
                <td>{fmt(totalInv)}</td>
                <td>{fmt(totalDue)}</td>
                <td>{fmt(totalCol)}</td>
                <td></td>
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
                    columns="repeat(3, 1fr)"
                    items={[
                      { label: "Customer", value: group.cntct_cname || "—" },
                      {
                        label: "Date",
                        value: formatDate(group.odrdm_trdat) || "—",
                      },
                      { label: "Notes", value: group.odrdm_notes || "—" },
                      {
                        label: "Delivered",
                        value: formatDate(group.tripc_dldat) || "—",
                      },
                      {
                        label: "Status",
                        value:
                          group.tripc_isdlv == null
                            ? "—"
                            : group.tripc_isdlv
                              ? "Delivered"
                              : "Pending",
                      },
                      {
                        label: "Attempt",
                        value:
                          group.tripc_atmpt == null
                            ? "—"
                            : String(group.tripc_atmpt),
                      },
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
                      <td colSpan={2}>Total ({group.items.length} items)</td>
                      <td>
                        {fmt(
                          group.items.reduce(
                            (sum, r) => sum + (Number(r.odrdc_itqty) || 0),
                            0,
                          ),
                        )}
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                  }
                />

                {/* Order footer — this order's totals and amount in words */}
                <div className="print-ftr">
                  <Summary rows={orderTotalsRows(group)} />
                </div>
              </PrintSection>
            </div>
          ))}
        </>
      }
      footer={
        // Trip-level footer: disclaimer + signatures only. The amount in words
        // (and its currency) is printed once per order in that order's own
        // footer below, so it is deliberately not repeated here — the trip
        // footer shows on every page.
        <PrintFooter
          docName="Delivery Trip"
          signerName={user?.users_cname || DEFAULT_SIGNER_NAME}
          roles={["Prepared By", "Checked By", "Authorized"]}
        />
      }
    />
  );
};

export default DeliveryTripPrint;
