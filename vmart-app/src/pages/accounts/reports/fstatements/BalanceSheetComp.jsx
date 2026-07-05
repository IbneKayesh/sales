import CSVExport from "@/components/CSVExport";
import { Button } from "primereact/button";
import EmptyState from "@/components/EmptyState";
import "./BalanceSheetComp.css";

// ─── shared primitives ───────────────────────────────────────────────────────
const fmtAmt = (val) => {
  const n = Number(val);
  if (n < 0)
    return `(${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2 })})`;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

const Row = ({ label, amount, bold = false, indent = false }) => (
  <div className={`bs-row ${indent ? 'bs-row-indent' : ''} ${bold ? 'bs-row-bold' : 'bs-row-normal'}`}>
    <span>{label}</span>
    <span className="bs-amount">{fmtAmt(amount)}</span>
  </div>
);

const SectionHeader = ({ label }) => (
  <div className="bs-section-header">{label}</div>
);

// ─── component ───────────────────────────────────────────────────────────────
const BalanceSheetComp = ({ pageAuth, dataList }) => {
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

  // Derive sections from flat API array
  const rawAssets  = aggList.filter((r) => r.chtac_ctype === "Asset");
  const rawEquity  = aggList.filter((r) => r.chtac_ctype === "Equity");
  const rawIncome  = aggList.filter((r) => r.chtac_ctype === "Income");
  const rawExpense = aggList.filter((r) => r.chtac_ctype === "Expense");

  const totalIncome  = rawIncome .reduce((s, r) => s + (Number(r.djrnl_crval) - Number(r.djrnl_drval)), 0);
  const totalExpense = rawExpense.reduce((s, r) => s + (Number(r.djrnl_drval) - Number(r.djrnl_crval)), 0);
  const netProfit    = totalIncome - totalExpense;

  // Asset balance = dr − cr  (debit-normal)
  const assets = rawAssets.map((r) => ({
    label:  r.chtac_cname,
    amount: Number(r.djrnl_drval) - Number(r.djrnl_crval),
  }));

  // Equity balance = cr − dr (credit-normal; negative = drawings/contra)
  const equityItems = rawEquity.map((r) => ({
    label:  r.chtac_cname,
    amount: Number(r.djrnl_crval) - Number(r.djrnl_drval),
  }));

  const totalAssets     = assets    .reduce((s, r) => s + r.amount, 0);
  const totalEquityBase = equityItems.reduce((s, r) => s + r.amount, 0);
  const totalEquity     = totalEquityBase + netProfit;

  // CSV export
  const export_columns = [
    { header: "Section", accessor: "section" },
    { header: "Account", accessor: "chtac_cname" },
    { header: "Amount",  amount: "amount" },
  ];
  const flatList = [
    ...rawAssets .map((r) => ({ ...r, section: "ASSETS",  amount: Number(r.djrnl_drval) - Number(r.djrnl_crval) })),
    ...rawEquity .map((r) => ({ ...r, section: "EQUITY",  amount: Number(r.djrnl_crval) - Number(r.djrnl_drval) })),
    { section: "EQUITY", chtac_cname: "Net Profit", amount: netProfit },
  ];

  return (
    <div className="bs-wrapper">
      {/* Toolbar */}
      <div className="bs-toolbar hide-on-print">
        <CSVExport
          data={flatList}
          fileName={`balance-sheet-${new Date().toISOString().slice(0, 10)}`}
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

      {/* Report */}
      <div className="bs-report">
        <div className="bs-title">Balance Sheet</div>

        {/* ASSETS */}
        <SectionHeader label="Assets" />
        {assets.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div className="bs-divider" />
        <Row label="Total Assets" amount={totalAssets} bold />

        <div className="bs-spacer" />

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
        <div className="bs-divider" />
        <Row label="Total Equity" amount={totalEquity} bold />

        <div className="bs-spacer-lg" />

        {/* Grand Total */}
        <div className="bs-grand-divider" />
        <Row label="TOTAL  (Assets = Equity)" amount={totalAssets} bold />
        <div className="bs-grand-divider" />
      </div>
    </div>
  );
};

export default BalanceSheetComp;