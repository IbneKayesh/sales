import { IconUsers } from "@/icons";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const bucketVariant = {
  "Not Due": "success", "0-30 Days": "warning", "31-60 Days": "warning",
  "61-90 Days": "danger", "90+ Days": "danger",
};

const ARReport = ({ data, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading AR aging..." />;
  if (!data || !data.items?.length) return <EmptyState icon={<IconUsers size={32} />} title="No Data" message="No AR aging data available." />;

  const { items, totalAR, buckets } = data;

  const columns = [
    { key: "name", header: "Customer", width: "200px",
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{v}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Opening: {fmt(row.openingBalance)}</div>
        </div>
      )
    },
    { key: "lastTransaction", header: "Last Transaction", width: "140px", render: (v) => v?.split("T")[0] || "—" },
    { key: "daysOverdue", header: "Days", width: "80px", render: (v) => v > 0 ? `${v}d` : "—" },
    { key: "bucket", header: "Bucket", width: "120px", render: (v) => <Badge variant={bucketVariant[v] || "muted"}>{v}</Badge> },
    { key: "balance", header: "Balance", width: "140px", align: "right", render: (v) => fmt(v) },
  ];

  return (
    <div>
      <DataCardGrid cols={5} gap={8} style={{ marginBottom: 16 }}>
        <DataCard variant="accent" value={fmt(totalAR)} label="Total AR" />
        {Object.entries(buckets).map(([bucket, amount]) => (
          <DataCard key={bucket} variant={amount > 0 ? "warning" : "accent"} value={fmt(amount)} label={bucket} />
        ))}
      </DataCardGrid>
      <DataTable columns={columns} data={items} pageSize={25} sortable searchable striped hoverable dense exportable exportFilename="ar-aging.csv" emptyMessage="No customers found" />
      <div className="page-card__footer">
        <span className="fw-semibold">Total Outstanding</span>
        <span className="fw-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(totalAR)}</span>
      </div>
    </div>
  );
};

export default ARReport;
