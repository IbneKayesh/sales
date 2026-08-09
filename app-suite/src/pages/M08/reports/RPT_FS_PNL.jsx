import { useEffect } from "react";
import TreeDataTable from "@/components/TreeDataTable";
import EmptyState from "@/components/EmptyState";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_FS_PNL = ({ listData, onRegisterExport }) => {
  // Aggregate journal lines per account
  const accountMap = {};
  listData.forEach((row) => {
    const key = row.jrnlc_chtac;
    if (!accountMap[key]) {
      accountMap[key] = {
        id: key,
        name: row.chtac_cname,
        chartNo: row.chtac_chtno,
        ctype: row.chtac_ctype,
        ntype: row.chtac_ntype,
        drVal: 0,
        crVal: 0,
      };
    }
    accountMap[key].drVal += Number(row.jrnlc_drval) || 0;
    accountMap[key].crVal += Number(row.jrnlc_crval) || 0;
  });

  const accounts = Object.values(accountMap);

  // Debit/credit nature comes from chtac_ntype (fallback to ctype heuristics)
  const balanceOf = (a) =>
    (a.ntype ? a.ntype === "Dr" : a.ctype === "Expenses")
      ? a.drVal - a.crVal
      : a.crVal - a.drVal;

  const section = (ctype) =>
    accounts
      .filter((a) => a.ctype === ctype)
      .map((a) => ({ ...a, balance: balanceOf(a) }))
      .filter((a) => a.balance !== 0);

  const incomeItems = section("Income");
  const expenseItems = section("Expenses");

  const totalIncome = incomeItems.reduce((s, i) => s + i.balance, 0);
  const totalExpenses = expenseItems.reduce((s, i) => s + i.balance, 0);
  const netProfit = totalIncome - totalExpenses;
  const hasReportData = !!incomeItems.length || !!expenseItems.length;

  const treeData = [
    {
      id: "income",
      name: "INCOME",
      isRoot: true,
      balance: totalIncome,
      children: incomeItems.map((i) => ({
        id: `inc-${i.id}`,
        name: i.name,
        chartNo: i.chartNo,
        balance: i.balance,
      })),
    },
    {
      id: "expenses",
      name: "EXPENSES",
      isRoot: true,
      balance: totalExpenses,
      children: expenseItems.map((i) => ({
        id: `exp-${i.id}`,
        name: i.name,
        chartNo: i.chartNo,
        balance: i.balance,
      })),
    },
    {
      id: "net",
      name: `NET ${netProfit >= 0 ? "PROFIT" : "LOSS"}`,
      isFooter: true,
      balance: Math.abs(netProfit),
      children: [],
    },
  ];

  const columns = [
    {
      key: "name",
      header: "Account",
      render: (v, node) => {
        if (node.isFooter || node.isRoot)
          return <span className="fw-bold">{node.name}</span>;
        return <span style={{ paddingLeft: 16 }}>{node.name}</span>;
      },
    },
    {
      key: "chartNo",
      header: "Chart No",
      render: (v, node) =>
        node.isRoot || node.isFooter ? "" : <span className="text-muted">{v}</span>,
    },
    {
      key: "balance",
      header: "Amount",
      align: "right",
      render: (v, node) => {
        if (node.isFooter)
          return (
            <span
              className={`fw-bold ${
                netProfit >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatNumber(node.balance)}
            </span>
          );
        if (node.isRoot)
          return <span className="fw-bold">{formatNumber(node.balance)}</span>;
        return formatNumber(Math.abs(node.balance));
      },
    },
  ];

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = [
      ...incomeItems.map((i) => ({
        account: i.name,
        chartNo: i.chartNo,
        type: "Income",
        amount: Math.abs(i.balance),
      })),
      ...expenseItems.map((i) => ({
        account: i.name,
        chartNo: i.chartNo,
        type: "Expense",
        amount: Math.abs(i.balance),
      })),
      { account: "Net Profit/Loss", chartNo: "", type: "", amount: netProfit },
    ];
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["account", "chartNo", "type", "amount"],
          ["Account", "Chart No", "Type", "Amount"],
        ),
        "profit-and-loss.csv",
      ),
    );
  }, [onRegisterExport, listData]);

  if (!hasReportData) {
    return <EmptyState message="No transactions found for the selected period." />;
  }

  return (
    <div className="overflow-auto" style={{ maxHeight: 600 }}>
      <TreeDataTable columns={columns} data={treeData} sortable={false} dense />
    </div>
  );
};

export default RPT_FS_PNL;
