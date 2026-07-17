import CSVExport from "@/components/CSVExport";
import { Button } from "primereact/button";
import EmptyState from "@/components/EmptyState";
import "./CashFlowComp.css";

const fmtAmt = (val) =>
  Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 });

const Row = ({ label, amount, bold = false, indent = false }) => (
  <div className={`cf-row ${indent ? 'cf-row-indent' : ''} ${bold ? 'cf-row-bold' : 'cf-row-normal'}`}>
    <span>{label}</span>
    <span className="cf-amount">{fmtAmt(amount)}</span>
  </div>
);

const SectionHeader = ({ label }) => <div className="cf-section-header">{label}</div>;

// API fields: { chtac_ctype, chtac_cname, dr, cr }
// Inflows  = Income (cr−dr) + Equity where cr > dr (capital contributions)
// Outflows = Expense (dr−cr) + Equity where dr > cr (drawings / withdrawals)
const CashFlowComp = ({ pageAuth, dataList }) => {
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

  const incomeRows = aggList
    .filter((r) => r.chtac_ctype === "Income")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.djrnl_crval) - Number(r.djrnl_drval) }));

  const equityInRows = aggList
    .filter((r) => r.chtac_ctype === "Equity" && Number(r.djrnl_crval) > Number(r.djrnl_drval))
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.djrnl_crval) - Number(r.djrnl_drval) }));

  const expenseRows = aggList
    .filter((r) => r.chtac_ctype === "Expense")
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.djrnl_drval) - Number(r.djrnl_crval) }));

  const equityOutRows = aggList
    .filter((r) => r.chtac_ctype === "Equity" && Number(r.djrnl_drval) > Number(r.djrnl_crval))
    .map((r) => ({ label: r.chtac_cname, amount: Number(r.djrnl_drval) - Number(r.djrnl_crval) }));

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
    <div className="cf-wrapper">
      <div className="cf-toolbar hide-on-print">
        <CSVExport
          data={flatList}
          fileName={`cash-flow-${new Date().toISOString().slice(0, 10)}`}
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

      <div className="cf-report">
        <div className="cf-title">Cash Flow Statement</div>

        {/* INFLOWS */}
        <SectionHeader label="Cash Inflows" />
        {inflows.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div className="cf-divider" />
        <Row label="Total Inflow" amount={totalInflow} bold />

        <div className="cf-spacer" />

        {/* OUTFLOWS */}
        <SectionHeader label="Cash Outflows" />
        {outflows.map((row, i) => (
          <Row key={i} label={row.label} amount={row.amount} indent />
        ))}
        <div className="cf-divider" />
        <Row label="Total Outflow" amount={totalOutflow} bold />

        <div className="cf-spacer-lg" />

        {/* NET CASH FLOW */}
        <div className="cf-grand-divider" />
        <Row label="NET CASH FLOW" amount={netCashFlow} bold />
        <div className="cf-grand-divider" />

        {/* CLOSING SUMMARY */}
        <div className="cf-closing-summary">
          <Row label="Opening Cash" amount={openingCash} />
          <Row label="Net Increase"  amount={netCashFlow} />
          <div className="cf-dashed" />
          <Row label="Closing Cash"  amount={closingCash} bold />
        </div>
      </div>
    </div>
  );
};

export default CashFlowComp;