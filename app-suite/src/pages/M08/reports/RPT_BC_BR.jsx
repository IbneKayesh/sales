import { useEffect } from "react";
import DataTable from "@/components/DataTable";
import { DataCard, DataCardGrid } from "@/components/DataCard";
import ReportEmpty from "./ReportEmpty";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_BC_BR = ({ listData, onRegisterExport }) => {
  // Bank/cash accounts (asset, name contains cash/bank)
  const bankAccts = listData.filter(
    (r) =>
      r.chtac_ctype === "Assets" &&
      ((r.chtac_cname || "").toLowerCase().includes("bank") ||
        (r.chtac_cname || "").toLowerCase().includes("cash")),
  );
  const bankAcctIds = new Set(bankAccts.map((r) => r.jrnlc_chtac));

  // Aggregate per account
  const accountMap = {};
  listData.forEach((row) => {
    if (!bankAcctIds.has(row.jrnlc_chtac)) return;
    const key = row.jrnlc_chtac;
    if (!accountMap[key]) {
      accountMap[key] = {
        id: key,
        accountName: row.chtac_cname,
        chartNo: row.chtac_chtno,
        totalDr: 0,
        totalCr: 0,
        transactionCount: 0,
        lastTransaction: null,
      };
    }
    accountMap[key].totalDr += Number(row.jrnlc_drval) || 0;
    accountMap[key].totalCr += Number(row.jrnlc_crval) || 0;
    accountMap[key].transactionCount += 1;
    if (
      row.jrnlm_trdat &&
      (!accountMap[key].lastTransaction ||
        row.jrnlm_trdat > accountMap[key].lastTransaction)
    ) {
      accountMap[key].lastTransaction = row.jrnlm_trdat;
    }
  });

  const accounts = Object.values(accountMap).map((a) => ({
    ...a,
    bookBalance: a.totalDr - a.totalCr,
  }));

  const hasReportData = accounts.length > 0;

  const totalBalance = accounts.reduce((s, a) => s + a.bookBalance, 0);
  const totalTxns = accounts.reduce((s, a) => s + a.transactionCount, 0);

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = accounts.map((a) => ({
      account: a.accountName,
      chartNo: a.chartNo,
      totalDr: a.totalDr,
      totalCr: a.totalCr,
      balance: a.bookBalance,
      txns: a.transactionCount,
    }));
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["account", "chartNo", "totalDr", "totalCr", "balance", "txns"],
          ["Account", "Chart No", "Total Debit", "Total Credit", "Book Balance", "Transactions"],
        ),
        "bank-reconciliation.csv",
      ),
    );
  }, [onRegisterExport, accounts]);

  const columns = [
    {
      key: "accountName",
      header: "Account",
      width: "180px",
      render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    { key: "chartNo", header: "Chart No", width: "120px" },
    {
      key: "totalDr",
      header: "Total Debit",
      width: "120px",
      align: "right",
      render: (v) => formatNumber(v),
    },
    {
      key: "totalCr",
      header: "Total Credit",
      width: "120px",
      align: "right",
      render: (v) => formatNumber(v),
    },
    {
      key: "bookBalance",
      header: "Book Balance",
      width: "140px",
      align: "right",
      render: (v) => (
        <span
          style={{
            fontWeight: 700,
            color: v >= 0 ? "var(--success, #16a34a)" : "var(--danger, #dc2626)",
          }}
        >
          {formatNumber(v)}
        </span>
      ),
    },
    {
      key: "transactionCount",
      header: "Txns",
      width: "80px",
      align: "right",
    },
    {
      key: "lastTransaction",
      header: "Last Activity",
      width: "120px",
      render: (v) => (v ? v.split("T")[0] : "—"),
    },
  ];

  if (!hasReportData) {
    return (
      <ReportEmpty message="No bank or cash accounts found for the selected period." />
    );
  }

  return (
    <div>
      <DataCardGrid cols={3} gap={8} style={{ marginBottom: 16 }}>
        <DataCard
          variant="accent"
          value={String(accounts.length)}
          label="Bank/Cash Accounts"
        />
        <DataCard
          variant={totalBalance >= 0 ? "success" : "danger"}
          value={formatNumber(totalBalance)}
          label="Total Book Balance"
        />
        <DataCard
          variant="accent"
          value={String(totalTxns)}
          label="Total Transactions"
        />
      </DataCardGrid>
      <DataTable
        columns={columns}
        data={accounts}
        pageSize={25}
        sortable
        searchable
        striped
        hoverable
        dense
        exportable
        exportFilename="bank-reconciliation.csv"
      />
      <ReportFooter label="Total Book Balance" values={[totalBalance]} />
    </div>
  );
};

export default RPT_BC_BR;
