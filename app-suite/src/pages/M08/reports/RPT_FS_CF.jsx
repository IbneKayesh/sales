import { useEffect } from "react";
import TreeDataTable from "@/components/TreeDataTable";
import ReportEmpty from "./ReportEmpty";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_FS_CF = ({ listData, onRegisterExport }) => {
  // Aggregate journal lines per account
  const accountMap = {};
  listData.forEach((row) => {
    const key = row.jrnlc_chtac;
    if (!accountMap[key]) {
      accountMap[key] = {
        id: key,
        name: row.chtac_cname,
        ctype: row.chtac_ctype,
        drVal: 0,
        crVal: 0,
      };
    }
    accountMap[key].drVal += Number(row.jrnlc_drval) || 0;
    accountMap[key].crVal += Number(row.jrnlc_crval) || 0;
  });

  const accounts = Object.values(accountMap);

  // Cash & bank accounts (asset, name contains cash/bank)
  const cashAccts = accounts.filter(
    (a) =>
      a.ctype === "Assets" &&
      ((a.name || "").toLowerCase().includes("cash") ||
        (a.name || "").toLowerCase().includes("bank")),
  );

  const closingBalance = cashAccts.reduce(
    (s, a) => s + Math.abs(a.drVal - a.crVal),
    0,
  );

  // Operating flow = income credits - expense debits
  const incomeCr = listData
    .filter((r) => r.chtac_ctype === "Income")
    .reduce((s, r) => s + (Number(r.jrnlc_crval) || 0), 0);
  const expenseDr = listData
    .filter((r) => r.chtac_ctype === "Expenses")
    .reduce((s, r) => s + (Number(r.jrnlc_drval) || 0), 0);
  const operatingFlow = incomeCr - expenseDr;
  const hasReportData = !!cashAccts.length || !!incomeCr || !!expenseDr;

  // Format negative amounts in parentheses like the old report
  const fmtAmt = (v) =>
    v < 0 ? `(${formatNumber(Math.abs(v))})` : formatNumber(v);

  const treeData = [
    {
      id: "cash",
      name: "CASH & BANK ACCOUNTS",
      isRoot: true,
      children: [
        ...cashAccts.map((a) => ({
          id: `csh-${a.id}`,
          name: a.name,
          balance: Math.abs(a.drVal - a.crVal),
        })),
        {
          id: "csh-total",
          name: "Closing Cash Balance",
          isSubtotal: true,
          balance: closingBalance,
        },
      ],
    },
    {
      id: "operating",
      name: "OPERATING ACTIVITIES",
      isRoot: true,
      children: [
        {
          id: "op-net",
          name: "Net Income (from P&L)",
          balance: operatingFlow,
        },
        {
          id: "op-total",
          name: "Net Cash from Operating Activities",
          isSubtotal: true,
          balance: operatingFlow,
        },
      ],
    },
    {
      id: "investing",
      name: "INVESTING ACTIVITIES",
      isRoot: true,
      children: [
        {
          id: "inv-placeholder",
          name: "(Simplified — requires asset transaction data)",
          isPlaceholder: true,
          balance: null,
        },
        {
          id: "inv-total",
          name: "Net Cash from Investing Activities",
          isSubtotal: true,
          balance: 0,
        },
      ],
    },
    {
      id: "financing",
      name: "FINANCING ACTIVITIES",
      isRoot: true,
      children: [
        {
          id: "fin-placeholder",
          name: "(Simplified — requires loan/equity transaction data)",
          isPlaceholder: true,
          balance: null,
        },
        {
          id: "fin-total",
          name: "Net Cash from Financing Activities",
          isSubtotal: true,
          balance: 0,
        },
      ],
    },
    {
      id: "net",
      name: "Net Cash Flow",
      isFooter: true,
      balance: operatingFlow,
      children: [],
    },
  ];

  const columns = [
    {
      key: "name",
      header: "Cash Flow Statement",
      render: (v, node) => {
        if (node.isFooter) return <span className="fw-bold">{node.name}</span>;
        if (node.isRoot) return <span className="fw-bold">{node.name}</span>;
        if (node.isSubtotal)
          return <span className="fw-semibold text-muted">{node.name}</span>;
        if (node.isPlaceholder)
          return <span className="text-muted">{node.name}</span>;
        return <span style={{ paddingLeft: 16 }}>{node.name}</span>;
      },
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
                node.balance >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {fmtAmt(node.balance)}
            </span>
          );
        if (node.isRoot) return null;
        if (node.isPlaceholder) return <span className="text-muted">—</span>;
        return (
          <span className={node.isSubtotal ? "fw-semibold" : ""}>
            {fmtAmt(node.balance)}
          </span>
        );
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
      ...cashAccts.map((a) => ({
        account: a.name,
        type: "Cash Account",
        amount: Math.abs(a.drVal - a.crVal),
      })),
      { account: "Operating Activities", type: "Flow", amount: operatingFlow },
      { account: "Investing Activities", type: "Flow", amount: 0 },
      { account: "Financing Activities", type: "Flow", amount: 0 },
      { account: "Net Cash Flow", type: "Total", amount: operatingFlow },
      { account: "Closing Balance", type: "Total", amount: closingBalance },
    ];
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["account", "type", "amount"],
          ["Account", "Type", "Amount"],
        ),
        "cash-flow.csv",
      ),
    );
  }, [onRegisterExport, listData]);

  if (!hasReportData) {
    return (
      <ReportEmpty message="No cash flow data found for the selected period." />
    );
  }

  return (
    <div>
      <div className="overflow-auto" style={{ maxHeight: 600 }}>
        <TreeDataTable
          columns={columns}
          data={treeData}
          sortable={false}
          dense
        />
      </div>
      <ReportFooter label="Closing Cash Balance" values={[closingBalance]} />
    </div>
  );
};

export default RPT_FS_CF;
