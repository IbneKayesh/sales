import { useEffect, useMemo, useState } from "react";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import { DataCard, DataCardGrid } from "@/components/DataCard";
import EmptyState from "@/components/EmptyState";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_BC_CB = ({ listData, onRegisterExport }) => {
  // Bank/cash accounts
  const cashAcctIds = useMemo(
    () =>
      new Set(
        listData
          .filter(
            (r) =>
              r.chtac_ctype === "Assets" &&
              ((r.chtac_cname || "").toLowerCase().includes("bank") ||
                (r.chtac_cname || "").toLowerCase().includes("cash")),
          )
          .map((r) => r.jrnlc_chtac),
      ),
    [listData],
  );

  const accounts = useMemo(() => {
    const map = {};
    listData.forEach((row) => {
      if (!cashAcctIds.has(row.jrnlc_chtac)) return;
      if (!map[row.jrnlc_chtac]) {
        map[row.jrnlc_chtac] = {
          id: row.jrnlc_chtac,
          name: row.chtac_cname,
        };
      }
    });
    return Object.values(map);
  }, [listData, cashAcctIds]);

  const [accountFilter, setAccountFilter] = useState("");

  // Transactions sorted by date with running balance
  const { items, totalDr, totalCr, closingBalance } = useMemo(() => {
    const lines = listData
      .filter(
        (r) =>
          cashAcctIds.has(r.jrnlc_chtac) &&
          (!accountFilter || r.jrnlc_chtac === accountFilter),
      )
      .sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat));

    let running = 0;
    const txns = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dr = Number(line.jrnlc_drval) || 0;
      const cr = Number(line.jrnlc_crval) || 0;
      running += dr - cr;
      txns.push({
        id: line.id || `${line.jrnlc_chtac}-${i}`,
        date: (line.jrnlm_trdat || "").split("T")[0],
        accountName: line.chtac_cname,
        trnType: line.jrnlm_trtyp || "",
        trnNo: line.jrnlm_refno || "",
        narration: line.jrnlm_narrt || line.jrnlc_descr || "",
        debit: dr,
        credit: cr,
        runningBalance: running,
      });
    }
    return {
      items: txns,
      totalDr: txns.reduce((s, t) => s + t.debit, 0),
      totalCr: txns.reduce((s, t) => s + t.credit, 0),
      closingBalance: running,
    };
  }, [listData, cashAcctIds, accountFilter]);

  const hasReportData = items.length > 0;

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = items.map((t) => ({
      date: t.date,
      account: t.accountName,
      type: t.trnType,
      trnNo: t.trnNo,
      narration: t.narration,
      dr: t.debit,
      cr: t.credit,
      balance: t.runningBalance,
    }));
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["date", "account", "type", "trnNo", "narration", "dr", "cr", "balance"],
          ["Date", "Account", "Type", "Trn No", "Narration", "Debit", "Credit", "Balance"],
        ),
        "cash-book.csv",
      ),
    );
  }, [onRegisterExport, items]);

  const columns = [
    { key: "date", header: "Date", width: "100px" },
    { key: "accountName", header: "Account", width: "150px" },
    { key: "trnType", header: "Type", width: "110px" },
    { key: "trnNo", header: "Trn No", width: "130px" },
    { key: "narration", header: "Narration", width: "200px" },
    {
      key: "debit",
      header: "Receipts (Dr)",
      width: "120px",
      align: "right",
      body: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "credit",
      header: "Payments (Cr)",
      width: "120px",
      align: "right",
      body: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "runningBalance",
      header: "Balance",
      width: "140px",
      align: "right",
      body: (v) => <span className="fw-semibold">{formatNumber(v)}</span>,
    },
  ];

  if (!hasReportData) {
    return <EmptyState message="No cash or bank transactions found for the selected period." />;
  }

  return (
    <div>
      {accounts.length > 1 && (
        <div className="d-flex align-end gap-3 mb-3">
          <div style={{ minWidth: 200 }}>
            <Dropdown
              label="Account"
              options={[{ id: "", name: "All Accounts" }, ...accounts]}
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              optionValue="id"
              optionLabel="name"
            />
          </div>
        </div>
      )}
      <DataCardGrid cols={4} gap={8} style={{ marginBottom: 16 }}>
        <DataCard
          variant="success"
          value={formatNumber(totalDr)}
          label="Total Receipts (Dr)"
        />
        <DataCard
          variant="danger"
          value={formatNumber(totalCr)}
          label="Total Payments (Cr)"
        />
        <DataCard
          variant={closingBalance >= 0 ? "success" : "danger"}
          value={formatNumber(closingBalance)}
          label="Closing Balance"
        />
        <DataCard
          variant="accent"
          value={String(items.length)}
          label="Transactions"
        />
      </DataCardGrid>
      <DataTable
        columns={columns}
        data={items}
        pageSize={25}
        sortable
        searchable
        striped
        hoverable
        dense
        exportable
        exportFilename="cash-book.csv"
      />
      <ReportFooter label="Total" values={[totalDr, totalCr, closingBalance]} />
    </div>
  );
};

export default RPT_BC_CB;
