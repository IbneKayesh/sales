import { IconDollar } from "@/icons";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const BankRecReport = ({ data, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading bank reconciliation..." />;
  if (!data || !data.accounts?.length) return <EmptyState icon={<IconDollar size={32} />} title="No Data" message="No bank/cash accounts found." />;

  const { accounts } = data;
  const totalBalance = accounts.reduce((s, a) => s + a.bookBalance, 0);
  const totalTxns = accounts.reduce((s, a) => s + a.transactionCount, 0);

  const columns = [
    { key: "accountName", header: "Account", width: "180px", render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: "chartNo", header: "Chart No", width: "120px" },
    { key: "totalDr", header: "Total Debit", width: "120px", align: "right", render: (v) => fmt(v) },
    { key: "totalCr", header: "Total Credit", width: "120px", align: "right", render: (v) => fmt(v) },
    { key: "bookBalance", header: "Book Balance", width: "140px", align: "right",
      render: (v) => <span style={{ fontWeight: 700, color: v >= 0 ? "var(--success, #16a34a)" : "var(--danger, #dc2626)" }}>{fmt(v)}</span>
    },
    { key: "transactionCount", header: "Txns", width: "80px", align: "right" },
    { key: "lastTransaction", header: "Last Activity", width: "120px", render: (v) => v?.split("T")[0] || "—" },
  ];

  return (
    <div>
      <DataCardGrid cols={3} gap={8} style={{ marginBottom: 16 }}>
        <DataCard variant="accent" value={String(accounts.length)} label="Bank/Cash Accounts" />
        <DataCard variant={totalBalance >= 0 ? "success" : "danger"} value={fmt(totalBalance)} label="Total Book Balance" />
        <DataCard variant="accent" value={String(totalTxns)} label="Total Transactions" />
      </DataCardGrid>
      <DataTable columns={columns} data={accounts} pageSize={25} sortable searchable striped hoverable dense exportable exportFilename="bank-reconciliation.csv" emptyMessage="No bank accounts" />
      <div className="page-card__footer">
        <span className="fw-semibold">Total Book Balance</span>
        <span className="fw-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(totalBalance)}</span>
      </div>
    </div>
  );
};

export default BankRecReport;
