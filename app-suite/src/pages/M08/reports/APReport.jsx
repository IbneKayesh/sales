import { IconUsers } from "@/icons";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import { DataCard, DataCardGrid } from "@/components/DataCard";

const bucketVariant = {
  "Not Due": "success", "0-30 Days": "warning", "31-60 Days": "warning",
  "61-90 Days": "danger", "90+ Days": "danger",
};

const APReport = ({ data, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading AP aging..." />;
  if (!data || !data.items?.length) return <EmptyState icon={<IconUsers size={32} />} title="No Data" message="No AP aging data available." />;

  const { items, totalAP, buckets } = data;

  const columns = [
    { key: "name", header: "Supplier", width: "200px", render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: "lastTransaction", header: "Last Transaction", width: "140px", render: (v) => v?.split("T")[0] || "—" },
    { key: "daysOverdue", header: "Days", width: "80px", render: (v) => v > 0 ? `${v}d` : "—" },
    { key: "bucket", header: "Bucket", width: "120px", render: (v) => <Badge variant={bucketVariant[v] || "muted"}>{v}</Badge> },
    { key: "balance", header: "Balance", width: "140px", align: "right", render: (v) => fmt(v) },
  ];

  return (
    <div>
      <DataCardGrid cols={5} gap={8} style={{ marginBottom: 16 }}>
        <DataCard variant="accent" value={fmt(totalAP)} label="Total AP" />
        {Object.entries(buckets).map(([bucket, amount]) => (
          <DataCard key={bucket} variant={amount > 0 ? "warning" : "accent"} value={fmt(amount)} label={bucket} />
        ))}
      </DataCardGrid>
      <DataTable columns={columns} data={items} pageSize={25} sortable searchable striped hoverable dense exportable exportFilename="ap-aging.csv" emptyMessage="No suppliers found" />
      <div className="page-card__footer">
        <span className="fw-semibold">Total Outstanding</span>
        <span className="fw-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(totalAP)}</span>
      </div>
    </div>
  );
};

export default APReport;
