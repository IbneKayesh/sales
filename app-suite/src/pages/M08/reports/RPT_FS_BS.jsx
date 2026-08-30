import { useEffect } from "react";
import TreeDataTable from "@/components/TreeDataTable";
import EmptyState from "@/components/EmptyState";
import { ReportStatus } from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_FS_BS = ({ listData, onRegisterExport }) => {
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
    (
      a.ntype
        ? a.ntype === "Dr"
        : a.ctype === "Assets" || a.ctype === "Expenses"
    )
      ? a.drVal - a.crVal
      : a.crVal - a.drVal;

  const section = (ctype) =>
    accounts
      .filter((a) => a.ctype === ctype)
      .map((a) => ({ ...a, balance: Math.abs(balanceOf(a)) }))
      .filter((a) => a.balance !== 0);

  const signedSection = (ctype) =>
    accounts
      .filter((a) => a.ctype === ctype)
      .map((a) => ({ ...a, balance: balanceOf(a) }))
      .filter((a) => a.balance !== 0);

  const assetItems = section("Assets");
  const liabilityItems = section("Liabilities");
  const equityItems = section("Equity");

  const totalAssets = assetItems.reduce((s, i) => s + i.balance, 0);
  const totalLiabilities = liabilityItems.reduce((s, i) => s + i.balance, 0);
  const totalEquity = equityItems.reduce((s, i) => s + i.balance, 0);

  // Net profit = income - expenses (v1)
  // const totalIncome = section("Income").reduce((s, i) => s + i.balance, 0);
  // const totalExpenses = section("Expenses").reduce((s, i) => s + i.balance, 0);
  // const netProfit = totalIncome - totalExpenses;

  // Net profit = income - expenses, preserving debit/credit signs (v2)
  const incomeItems = signedSection("Income");
  const expenseItems = signedSection("Expenses");
  const totalIncome = incomeItems.reduce((s, i) => s + i.balance, 0);
  const totalExpenses = expenseItems.reduce((s, i) => s + i.balance, 0);
  const netProfit = totalIncome - totalExpenses;

  const hasReportData =
    !!assetItems.length ||
    !!liabilityItems.length ||
    !!equityItems.length ||
    !!netProfit;

  const totalLiabilitiesEquity = totalLiabilities + totalEquity + netProfit;
  const diffVal = Math.abs(totalAssets - totalLiabilitiesEquity);
  const isBalanced = diffVal < 0.01;

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = [
      ...assetItems.map((i) => ({
        section: "Assets",
        account: i.name,
        amount: i.balance,
      })),
      { section: "", account: "Total Assets", amount: totalAssets },
      ...liabilityItems.map((i) => ({
        section: "Liabilities",
        account: i.name,
        amount: i.balance,
      })),
      { section: "", account: "Total Liabilities", amount: totalLiabilities },
      ...equityItems.map((i) => ({
        section: "Equity",
        account: i.name,
        amount: i.balance,
      })),
      ...(netProfit !== 0
        ? [
            {
              section: "",
              account: `Current Year ${netProfit >= 0 ? "Earnings" : "Loss"}`,
              amount: Math.abs(netProfit),
            },
          ]
        : []),
      {
        section: "",
        account: "Total Liabilities & Equity",
        amount: totalLiabilitiesEquity,
      },
    ];
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["section", "account", "amount"],
          ["Section", "Account", "Amount"],
        ),
        "balance-sheet.csv",
      ),
    );
  }, [onRegisterExport, listData]);

  const treeData = [
    {
      id: "assets",
      name: "ASSETS",
      isRoot: true,
      children: [
        ...assetItems.map((i) => ({
          id: `ast-${i.id}`,
          name: i.name,
          balance: i.balance,
        })),
        {
          id: "ast-total",
          name: "Total Assets",
          isSubtotal: true,
          balance: totalAssets,
        },
      ],
    },
    {
      id: "liabilities",
      name: "LIABILITIES",
      isRoot: true,
      children: [
        ...liabilityItems.map((i) => ({
          id: `lia-${i.id}`,
          name: i.name,
          balance: i.balance,
        })),
        {
          id: "lia-total",
          name: "Total Liabilities",
          isSubtotal: true,
          balance: totalLiabilities,
        },
      ],
    },
    {
      id: "equity",
      name: "EQUITY",
      isRoot: true,
      children: [
        ...equityItems.map((i) => ({
          id: `eq-${i.id}`,
          name: i.name,
          balance: i.balance,
        })),
        ...(netProfit !== 0
          ? [
              {
                id: "eq-net",
                name: `Current Year ${netProfit >= 0 ? "Earnings" : "Loss"}`,
                balance: Math.abs(netProfit),
              },
            ]
          : []),
        {
          id: "eq-total",
          name: "Total Equity",
          isSubtotal: true,
          balance: totalEquity + netProfit,
        },
      ],
    },
    {
      id: "total-le",
      name: "Total Liabilities & Equity",
      isFooter: true,
      balance: totalLiabilities + totalEquity + netProfit,
      children: [],
    },
  ];

  const columns = [
    {
      key: "name",
      header: "Account",
      render: (v, node) => {
        if (node.isFooter) return <span className="fw-bold">{v}</span>;
        if (node.isRoot) return <span className="fw-bold">{v}</span>;
        if (node.isSubtotal)
          return <span className="fw-semibold text-muted">{v}</span>;
        return <span style={{ paddingLeft: 16 }}>{v}</span>;
      },
    },
    {
      key: "balance",
      header: "Amount",
      align: "right",
      render: (v, node) => {
        if (node.isFooter)
          return <span className="fw-bold">{formatNumber(node.balance)}</span>;
        if (node.isRoot) return null;
        return (
          <span className={node.isSubtotal ? "fw-semibold" : ""}>
            {formatNumber(node.balance)}
          </span>
        );
      },
    },
  ];

  if (!hasReportData) {
    return (
      <EmptyState message="No balance sheet data found for the selected period." />
    );
  }

  return (
    <div className="overflow-auto" style={{ maxHeight: 600 }}>
      <TreeDataTable columns={columns} data={treeData} sortable={false} dense />
      <ReportStatus
        text={
          isBalanced
            ? "✓ Balance Sheet is Balanced"
            : `✗ Difference: ${formatNumber(diffVal)}`
        }
        tone={isBalanced ? "success" : "danger"}
      />
    </div>
  );
};

export default RPT_FS_BS;
