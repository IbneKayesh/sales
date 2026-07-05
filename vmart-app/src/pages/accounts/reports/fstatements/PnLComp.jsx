import CSVExport from "@/components/CSVExport";
import { Button } from "primereact/button";
import EmptyState from "@/components/EmptyState";
import "./PnLComp.css";

const fmtAmt = (val) =>
  Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

const Row = ({ label, amount, bold = false, indent = false }) => (
  <div className={`pnl-row ${indent ? 'pnl-row-indent' : ''} ${bold ? 'pnl-row-bold' : 'pnl-row-normal'}`}>
    <span>{label}</span>
    <span className="pnl-amount">{fmtAmt(amount)}</span>
  </div>
);

const SectionHeader = ({ label }) => <div className="pnl-section-header">{label}</div>;

const PnLComp = ({ pageAuth, dataList }) => {
  if (!dataList || dataList.length === 0) return <EmptyState />;

  const aggList = dataList?.reduce((acc, row) => {
    const existing = acc.find(item => item.chtac_cname === row.chtac_cname);
    if (existing) {
      existing.djrnl_drval = Number(existing.djrnl_drval || 0) + Number(row.djrnl_drval || 0);
      existing.djrnl_crval = Number(existing.djrnl_crval || 0) + Number(row.djrnl_crval || 0);
    } else {
      acc.push({ ...row, djrnl_drval: Number(row.djrnl_drval || 0), djrnl_crval: Number(row.djrnl_crval || 0) });
    }
    return acc;
  }, []) || [];

  const income = aggList
    .filter((r) => r.chtac_ctype === "Income")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.djrnl_crval) - Number(r.djrnl_drval) }));

  const expenses = aggList
    .filter((r) => r.chtac_ctype === "Expense")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.djrnl_drval) - Number(r.djrnl_crval) }));

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
    <div className="pnl-wrapper">
      <div className="pnl-toolbar hide-on-print">
        <CSVExport
          data={flatList}
          fileName={`pnl-${new Date().toISOString().slice(0, 10)}`}
          columns={export_columns}
          disable={pageAuth?.extpr}
        />
        <Button
          label="Print"
          icon="pi pi-print"
          size="small"
          severity="info"
          className="ml-2"
          onClick={() => window.print()}
        />
      </div>

      <div className="pnl-report">
        <div className="pnl-title">Profit &amp; Loss Statement</div>

        <SectionHeader label="Income" />
        {income.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div className="pnl-divider" />
        <Row label="Total Income" amount={totalIncome} bold />

        <div className="pnl-spacer" />

        <SectionHeader label="Expenses" />
        {expenses.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div className="pnl-divider" />
        <Row label="Total Expenses" amount={totalExpenses} bold />

        <div className="pnl-spacer-lg" />
        <div className="pnl-grand-divider" />
        <Row label={netProfit >= 0 ? "NET PROFIT" : "NET LOSS"} amount={Math.abs(netProfit)} bold />
        <div className="pnl-grand-divider" />
      </div>
    </div>
  );
};

export default PnLComp;