import CSVExport from "@/components/CSVExport";
import EmptyState from "@/components/EmptyState";

// ─── shared primitives ───────────────────────────────────────────────────────
const fmtAmt = (val) => {
  const n = Number(val);
  if (n < 0)
    return `(${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2 })})`;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

const S = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    padding: "0.5rem 1rem",
  },
  toolbar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "1.25rem",
  },
  report: {
    width: "100%",
    maxWidth: "540px",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "1.25rem",
    color: "var(--text-color, #1f2937)",
  },
  sectionHeader: {
    fontWeight: 700,
    fontSize: "0.78rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--primary-color, #3b82f6)",
    padding: "10px 0 4px",
    borderBottom: "2px solid var(--primary-color, #3b82f6)",
    marginBottom: "2px",
  },
  row: (indent, bold) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "4px 0",
    paddingLeft: indent ? "1.25rem" : 0,
    fontWeight: bold ? 600 : 400,
    color: "var(--text-color, #1f2937)",
  }),
  amount: {
    minWidth: "9rem",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  divider: {
    borderTop: "1px solid #d1d5db",
    margin: "3px 0",
  },
  grandDivider: {
    borderTop: "2px solid var(--text-color, #1f2937)",
    margin: "3px 0",
  },
  spacer: { height: "1rem" },
};

const Row = ({ label, amount, bold = false, indent = false }) => (
  <div style={S.row(indent, bold)}>
    <span>{label}</span>
    <span style={S.amount}>{fmtAmt(amount)}</span>
  </div>
);

const SectionHeader = ({ label }) => (
  <div style={S.sectionHeader}>{label}</div>
);

// ─── component ───────────────────────────────────────────────────────────────
const BalanceSheetComp = ({ pageAuth, dataList }) => {
  if (!dataList || dataList.length === 0) return <EmptyState />;

  // Derive sections from flat API array
  const rawAssets  = dataList.filter((r) => r.chtac_ctype === "Asset");
  const rawEquity  = dataList.filter((r) => r.chtac_ctype === "Equity");
  const rawIncome  = dataList.filter((r) => r.chtac_ctype === "Income");
  const rawExpense = dataList.filter((r) => r.chtac_ctype === "Expense");

  const totalIncome  = rawIncome .reduce((s, r) => s + (Number(r.cr) - Number(r.dr)), 0);
  const totalExpense = rawExpense.reduce((s, r) => s + (Number(r.dr) - Number(r.cr)), 0);
  const netProfit    = totalIncome - totalExpense;

  // Asset balance = dr − cr  (debit-normal)
  const assets = rawAssets.map((r) => ({
    label:  r.chtac_cname,
    amount: Number(r.dr) - Number(r.cr),
  }));

  // Equity balance = cr − dr (credit-normal; negative = drawings/contra)
  const equityItems = rawEquity.map((r) => ({
    label:  r.chtac_cname,
    amount: Number(r.cr) - Number(r.dr),
  }));

  const totalAssets     = assets    .reduce((s, r) => s + r.amount, 0);
  const totalEquityBase = equityItems.reduce((s, r) => s + r.amount, 0);
  const totalEquity     = totalEquityBase + netProfit;

  // CSV export
  const export_columns = [
    { header: "Section", accessor: "section" },
    { header: "Account", accessor: "chtac_cname" },
    { header: "Amount",  accessor: "amount" },
  ];
  const flatList = [
    ...rawAssets .map((r) => ({ ...r, section: "ASSETS",  amount: Number(r.dr) - Number(r.cr) })),
    ...rawEquity .map((r) => ({ ...r, section: "EQUITY",  amount: Number(r.cr) - Number(r.dr) })),
    { section: "EQUITY", chtac_cname: "Net Profit", amount: netProfit },
  ];

  return (
    <div style={S.wrapper}>
      {/* Toolbar */}
      <div style={S.toolbar}>
        <CSVExport
          data={flatList}
          fileName={`balance-sheet-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth?.extpr}
        />
      </div>

      {/* Report */}
      <div style={S.report}>
        <div style={S.title}>Balance Sheet</div>

        {/* ASSETS */}
        <SectionHeader label="Assets" />
        {assets.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div style={S.divider} />
        <Row label="Total Assets" amount={totalAssets} bold />

        <div style={S.spacer} />

        {/* EQUITY */}
        <SectionHeader label="Equity" />
        {equityItems.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        {netProfit !== 0 && (
          <Row
            label={netProfit >= 0 ? "Add: Net Profit" : "Less: Net Loss"}
            amount={netProfit}
            indent
          />
        )}
        <div style={S.divider} />
        <Row label="Total Equity" amount={totalEquity} bold />

        <div style={{ ...S.spacer, height: "1.5rem" }} />

        {/* Grand Total */}
        <div style={S.grandDivider} />
        <Row label="TOTAL  (Assets = Equity)" amount={totalAssets} bold />
        <div style={S.grandDivider} />
      </div>
    </div>
  );
};

export default BalanceSheetComp;