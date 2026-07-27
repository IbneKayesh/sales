import { IconDollar } from "@/icons";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const OutStandReport = ({ data, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading outstanding report..." />;
  if (!data || !data.items?.length) return <EmptyState icon={<IconDollar size={32} />} title="No Data" message="No outstanding balances found." />;

  const { items, totalOutstandingDr, totalOutstandingCr, totalOutstanding } = data;

  const columns = [
    { key: "name", header: "Party Name", width: "200px", render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: "type", header: "Type", width: "100px", render: (v) => <Badge variant={v === "Customer" ? "success" : "warning"}>{v}</Badge> },
    { key: "accountNames", header: "Accounts", width: "180px", render: (v) => <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{v || "—"}</span> },
    { key: "transactionCount", header: "Txns", width: "80px", align: "right" },
    { key: "balanceType", header: "Side", width: "100px", render: (v) => (
      <Badge variant={v === "Dr" ? "success" : "danger"}>{v === "Dr" ? "Receivable" : "Payable"}</Badge>
    )},
    { key: "balance", header: "Balance", width: "140px", align: "right", render: (v) => fmt(v) },
  ];

  return (
    <div>
      <DataCardGrid cols={4} gap={8} style={{ marginBottom: 16 }}>
        <DataCard variant="success" value={fmt(totalOutstandingDr)} label="Total Receivable (Dr)" />
        <DataCard variant="danger" value={fmt(totalOutstandingCr)} label="Total Payable (Cr)" />
        <DataCard variant="accent" value={fmt(totalOutstanding)} label="Net Outstanding" />
        <DataCard variant="accent" value={String(items.length)} label="Parties" />
      </DataCardGrid>
      <DataTable columns={columns} data={items} pageSize={25} sortable searchable striped hoverable dense exportable exportFilename="outstanding.csv" emptyMessage="No outstanding items" />
      <div className="page-card__footer">
        <span className="fw-semibold">Total Outstanding</span>
        <span className="fw-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(totalOutstanding)}</span>
      </div>
    </div>
  );
};

export default OutStandReport;
