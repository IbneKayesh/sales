import { useEffect } from "react";
import DataTable from "@/components/DataTable";
import { DataCard, DataCardGrid } from "@/components/DataCard";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const bucketVariant = {
  "Not Due": "success",
  "0-30 Days": "warning",
  "31-60 Days": "warning",
  "61-90 Days": "danger",
  "90+ Days": "danger",
};

const daysDiff = (dateStr) => {
  if (!dateStr) return 0;
  const d = new Date(dateStr.includes("T") ? dateStr.split("T")[0] : dateStr);
  return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
};

const getBucket = (days) => {
  if (days <= 0) return "Not Due";
  if (days <= 30) return "0-30 Days";
  if (days <= 60) return "31-60 Days";
  if (days <= 90) return "61-90 Days";
  return "90+ Days";
};

const RPT_RP_APA = ({ listData, onRegisterExport }) => {
  // Payable accounts (liability, name contains "payable")
  const payableIds = new Set(
    listData
      .filter(
        (r) =>
          r.chtac_ctype === "Liabilities" &&
          (r.chtac_cname || "").toLowerCase().includes("payable"),
      )
      .map((r) => r.jrnlc_chtac),
  );

  // Per-supplier balance on payable accounts
  const supplierMap = {};
  listData.forEach((row) => {
    if (row.party_ptype !== "Supplier" || !payableIds.has(row.jrnlc_chtac)) {
      return;
    }
    const key = row.jrnlc_party;
    if (!supplierMap[key]) {
      supplierMap[key] = {
        id: key,
        name: row.party_cname,
        balance: 0,
        lastTransaction: null,
      };
    }
    supplierMap[key].balance +=
      (Number(row.jrnlc_crval) || 0) - (Number(row.jrnlc_drval) || 0);
    if (
      row.jrnlm_trdat &&
      (!supplierMap[key].lastTransaction ||
        row.jrnlm_trdat > supplierMap[key].lastTransaction)
    ) {
      supplierMap[key].lastTransaction = row.jrnlm_trdat;
    }
  });

  const items = Object.values(supplierMap)
    .filter((s) => s.balance > 0)
    .map((s) => {
      const dd = daysDiff(s.lastTransaction);
      return {
        ...s,
        balance: Math.abs(s.balance),
        daysOverdue: dd,
        bucket: getBucket(dd),
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const hasReportData = items.length > 0;

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = items.map((i) => ({
      supplier: i.name,
      lastTxn: i.lastTransaction ? i.lastTransaction.split("T")[0] : "",
      days: i.daysOverdue,
      bucket: i.bucket,
      balance: i.balance,
    }));
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["supplier", "lastTxn", "days", "bucket", "balance"],
          ["Supplier", "Last Transaction", "Days", "Bucket", "Balance"],
        ),
        "ap-aging.csv",
      ),
    );
  }, [onRegisterExport, items]);

  if (!hasReportData) {
    return <EmptyState message="No suppliers found for the selected period." />;
  }

  const totalAP = items.reduce((s, c) => s + c.balance, 0);
  const buckets = {
    "Not Due": 0,
    "0-30 Days": 0,
    "31-60 Days": 0,
    "61-90 Days": 0,
    "90+ Days": 0,
  };
  items.forEach((s) => {
    buckets[s.bucket] += s.balance;
  });

  const columns = [
    {
      key: "name",
      header: "Supplier",
      width: "200px",
      body: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      key: "lastTransaction",
      header: "Last Transaction",
      width: "140px",
      body: (v) => (v ? v.split("T")[0] : "—"),
    },
    {
      key: "daysOverdue",
      header: "Days",
      width: "80px",
      body: (v) => (v > 0 ? `${v}d` : "—"),
    },
    {
      key: "bucket",
      header: "Bucket",
      width: "120px",
      body: (v) => <Badge variant={bucketVariant[v] || "muted"}>{v}</Badge>,
    },
    {
      key: "balance",
      header: "Balance",
      width: "140px",
      align: "right",
      body: (v) => formatNumber(v),
    },
  ];

  return (
    <div>
      <DataCardGrid cols={5} gap={8} style={{ marginBottom: 16 }}>
        <DataCard variant="accent" value={formatNumber(totalAP)} label="Total AP" />
        {Object.entries(buckets).map(([bucket, amount]) => (
          <DataCard
            key={bucket}
            variant={amount > 0 ? "warning" : "accent"}
            value={formatNumber(amount)}
            label={bucket}
          />
        ))}
      </DataCardGrid>
      <DataTable
        columns={columns}
        data={items}
        pageSize={25}
        sortable
        searchable
        striped
        hoverable
        dense
        exportable
        exportFilename="ap-aging.csv"
      />
      <ReportFooter label="Total Outstanding" values={[totalAP]} />
    </div>
  );
};

export default RPT_RP_APA;
