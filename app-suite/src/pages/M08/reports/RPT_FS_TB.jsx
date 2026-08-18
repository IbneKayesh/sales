import { useEffect } from "react";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import ReportFooter, { ReportStatus } from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const typeBadgeVariant = {
  Assets: "primary",
  Liabilities: "warning",
  Equity: "success",
  Income: "success",
  Expenses: "danger",
};

const RPT_FS_TB = ({ listData, onRegisterExport }) => {
  const dtcolumns_SYS_RPT_FS_TB = [
    {
      key: "name",
      header: "Account",
      width: "250px",
      body: (v, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{v}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {row.chartNo}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "140px",
      body: (v, row) => (
        <Badge variant={typeBadgeVariant[row.type] || "muted"}>
          {row.type} ({row.ntype || "—"})
        </Badge>
      ),
    },
    {
      key: "drVal",
      header: "Debit (Dr)",
      width: "140px",
      align: "right",
      body: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "crVal",
      header: "Credit (Cr)",
      width: "140px",
      align: "right",
      body: (v) => (v > 0 ? formatNumber(v) : "—"),
    },
    {
      key: "subVal",
      header: "Balance",
      width: "140px",
      align: "right",
      body: (v) => formatNumber(v),
    },
  ];

  const tb_data = Object.values(
    listData.reduce((acc, row) => {
      const key = row.chtac_chtno;

      if (!acc[key]) {
        acc[key] = {
          name: row.chtac_cname,
          chartNo: row.chtac_chtno,
          type: row.chtac_ctype,
          ntype: row.chtac_ntype,
          drVal: 0,
          crVal: 0,
          subVal: 0,
        };
      }

      acc[key].drVal += Number(row.jrnlc_drval || 0);
      acc[key].crVal += Number(row.jrnlc_crval || 0);
      acc[key].subVal +=
        Number(row.jrnlc_drval || 0) - Number(row.jrnlc_crval || 0);

      return acc;
    }, {}),
  );

  const hasReportData = tb_data.length > 0;

  const tb_data_sum = tb_data.reduce(
    (sum, row) => {
      sum.drVal += row.drVal;
      sum.crVal += row.crVal;
      sum.subVal += row.subVal;
      return sum;
    },
    {
      name: "Total",
      drVal: 0,
      crVal: 0,
      subVal: 0,
    },
  );

  const diffVal = Math.abs(tb_data_sum.drVal - tb_data_sum.crVal);
  const isBalanced = diffVal < 0.01;

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = [
      ...tb_data.map((r) => ({
        account: r.name,
        chartNo: r.chartNo,
        type: r.type,
        debit: r.drVal,
        credit: r.crVal,
        balance: r.subVal,
      })),
      {
        account: "Total",
        chartNo: "",
        type: "",
        debit: tb_data_sum.drVal,
        credit: tb_data_sum.crVal,
        balance: tb_data_sum.subVal,
      },
    ];
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["account", "chartNo", "type", "debit", "credit", "balance"],
          ["Account", "Chart No", "Type", "Debit", "Credit", "Balance"],
        ),
        "trial-balance.csv",
      ),
    );
  }, [onRegisterExport, listData]);

  if (!hasReportData) {
    return <EmptyState message="No accounts found for the selected period." />;
  }

  return (
    <>
      <DataTable
        columns={dtcolumns_SYS_RPT_FS_TB}
        data={tb_data}
        pageSize={100}
        sortable
        striped
        hoverable
        dense
      />
      <ReportFooter
        label="Total"
        values={[tb_data_sum.drVal, tb_data_sum.crVal, tb_data_sum.subVal]}
      />

      <ReportStatus
        text={
          isBalanced
            ? "✓ Trial Balance is Balanced"
            : `✗ Difference: ${formatNumber(diffVal)}`
        }
        tone={isBalanced ? "success" : "danger"}
      />
    </>
  );
};
export default RPT_FS_TB;
