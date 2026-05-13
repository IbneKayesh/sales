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
  spacer: { height: "1rem" },
};

const Row = ({ label, amount, bold = false, indent = false }) => (
  <div style={S.row(indent, bold)}>
    <span>{label}</span>
    <span style={S.amount}>{fmtAmt(amount)}</span>
  </div>
);

const SectionHeader = ({ label }) => <div style={S.sectionHeader}>{label}</div>;

const PnLComp = ({ pageAuth, dataList }) => {
  if (!dataList || dataList.length === 0) return <EmptyState />;

  const income = dataList
    .filter((r) => r.chtac_ctype === "Income")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.cr) - Number(r.dr) }));

  const expenses = dataList
    .filter((r) => r.chtac_ctype === "Expense")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.dr) - Number(r.cr) }));

  const totalIncome   = income  .reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
  const netProfit     = totalIncome - totalExpenses;

  const export_columns = [
    { header: "Category", accessor: "category" },
    { header: "Account",  accessor: "label" },
    { header: "Amount",   accessor: "amount" },
  ];
  const flatList = [
    ...income  .map((r) => ({ ...r, category: "INCOME" })),
    ...expenses.map((r) => ({ ...r, category: "EXPENSES" })),
  ];

  return (
    <div style={S.wrapper}>
      <div style={S.toolbar}>
        <CSVExport
          data={flatList}
          fileName={`pnl-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth?.extpr}
        />
      </div>

      <div style={S.report}>
        <div style={S.title}>Profit &amp; Loss Statement</div>

        <SectionHeader label="Income" />
        {income.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div style={S.divider} />
        <Row label="Total Income" amount={totalIncome} bold />

        <div style={S.spacer} />

        <SectionHeader label="Expenses" />
        {expenses.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div style={S.divider} />
        <Row label="Total Expenses" amount={totalExpenses} bold />

        <div style={{ height: "1.5rem" }} />
        <div style={S.grandDivider} />
        <Row label={netProfit >= 0 ? "NET PROFIT" : "NET LOSS"} amount={Math.abs(netProfit)} bold />
        <div style={S.grandDivider} />
      </div>
    </div>
  );
};

export default PnLComp;