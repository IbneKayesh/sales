import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

const fmtAmt = (val) =>
  Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

const S = {
  wrapper: { display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.875rem", fontFamily: "inherit", padding: "0.5rem 1rem" },
  toolbar: { width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" },
  report:  { width: "100%", maxWidth: "540px" },
  title:   { textAlign: "center", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "1.25rem", color: "var(--text-color, #1f2937)" },
  sectionHeader: { fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--primary-color, #3b82f6)", padding: "10px 0 4px", borderBottom: "2px solid var(--primary-color, #3b82f6)", marginBottom: "2px" },
  row: (indent, bold) => ({ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 0", paddingLeft: indent ? "1.25rem" : 0, fontWeight: bold ? 600 : 400, color: "var(--text-color, #1f2937)" }),
  amount: { minWidth: "9rem", textAlign: "right", fontVariantNumeric: "tabular-nums" },
  divider: { borderTop: "1px solid #d1d5db", margin: "3px 0" },
  grandDivider: { borderTop: "2px solid var(--text-color, #1f2937)", margin: "3px 0" },
  dashed: { borderTop: "1px dashed #d1d5db", margin: "3px 0" },
  spacer: { height: "1rem" },
};

const Row = ({ label, amount, bold = false, indent = false }) => (
  <div style={S.row(indent, bold)}>
    <span>{label}</span>
    <span style={S.amount}>{fmtAmt(amount)}</span>
  </div>
);

const SectionHeader = ({ label }) => <div style={S.sectionHeader}>{label}</div>;

// API fields: { chtac_ctype, chtac_cname, dr, cr }
// Inflows  = Income (cr−dr) + Equity where cr > dr (capital contributions)
// Outflows = Expense (dr−cr) + Equity where dr > cr (drawings / withdrawals)
const CashFlowComp = ({ pageAuth, dataList }) => {
  if (!dataList || dataList.length === 0) return <EmptyState />;

  const incomeRows = dataList
    .filter((r) => r.chtac_ctype === "Income")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.cr) - Number(r.dr) }));

  const equityInRows = dataList
    .filter((r) => r.chtac_ctype === "Equity" && Number(r.cr) > Number(r.dr))
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.cr) - Number(r.dr) }));

  const expenseRows = dataList
    .filter((r) => r.chtac_ctype === "Expense")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.dr) - Number(r.cr) }));

  const equityOutRows = dataList
    .filter((r) => r.chtac_ctype === "Equity" && Number(r.dr) > Number(r.cr))
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.dr) - Number(r.cr) }));

  const inflows  = [...equityInRows, ...incomeRows];
  const outflows = [...expenseRows, ...equityOutRows];

  const totalInflow  = inflows .reduce((s, r) => s + r.amount, 0);
  const totalOutflow = outflows.reduce((s, r) => s + r.amount, 0);
  const netCashFlow  = totalInflow - totalOutflow;
  const openingCash  = 0;
  const closingCash  = openingCash + netCashFlow;

  const export_columns = [
    { header: "Category",    accessor: "category" },
    { header: "Description", accessor: "label" },
    { header: "Amount",      accessor: "amount" },
  ];
  const flatList = [
    ...inflows .map((r) => ({ ...r, category: "CASH INFLOWS" })),
    ...outflows.map((r) => ({ ...r, category: "CASH OUTFLOWS" })),
  ];

  return (
    <div style={S.wrapper}>
      <div style={S.toolbar}>
        <CSVExport
          data={flatList}
          fileName={`cash-flow-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth?.extpr}
        />
      </div>

      <div style={S.report}>
        <div style={S.title}>Cash Flow Statement</div>

        {/* INFLOWS */}
        <SectionHeader label="Cash Inflows" />
        {inflows.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div style={S.divider} />
        <Row label="Total Inflow" amount={totalInflow} bold />

        <div style={S.spacer} />

        {/* OUTFLOWS */}
        <SectionHeader label="Cash Outflows" />
        {outflows.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div style={S.divider} />
        <Row label="Total Outflow" amount={totalOutflow} bold />

        <div style={{ height: "1.5rem" }} />

        {/* NET CASH FLOW */}
        <div style={S.grandDivider} />
        <Row label="NET CASH FLOW" amount={netCashFlow} bold />
        <div style={S.grandDivider} />

        {/* CLOSING SUMMARY */}
        <div style={{ marginTop: "1.25rem" }}>
          <Row label="Opening Cash" amount={openingCash} />
          <Row label="Net Increase"  amount={netCashFlow} />
          <div style={S.dashed} />
          <Row label="Closing Cash"  amount={closingCash} bold />
        </div>
      </div>
    </div>
  );
};

export default CashFlowComp;