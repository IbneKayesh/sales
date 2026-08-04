import { useEffect } from "react";
import DataTable from "@/components/DataTable";
import { DataCard, DataCardGrid } from "@/components/DataCard";
import Badge from "@/components/Badge";
import ReportEmpty from "./ReportEmpty";
import ReportFooter from "./ReportFooter";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_RP_OST = ({ listData, onRegisterExport }) => {
  // Per-party net balance across all lines
  const partyMap = {};
  listData.forEach((row) => {
    if (
      row.party_ptype !== "Customer" &&
      row.party_ptype !== "Supplier"
    ) {
      return;
    }
    const key = row.jrnlc_party;
    if (!partyMap[key]) {
      partyMap[key] = {
        id: key,
        name: row.party_cname,
        ptype: row.party_ptype,
        balance: 0,
        accountNames: new Set(),
        transactionCount: 0,
      };
    }
    partyMap[key].balance +=
      (Number(row.jrnlc_drval) || 0) - (Number(row.jrnlc_crval) || 0);
    partyMap[key].accountNames.add(row.chtac_cname);
    partyMap[key].transactionCount += 1;
  });

  const items = Object.values(partyMap)
    .map((p) => ({
      ...p,
      balance: Math.abs(p.balance),
      balanceType: p.balance >= 0 ? "Dr" : "Cr",
      accountNames: [...p.accountNames].slice(0, 3).join(", "),
    }))
    .filter((i) => i.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const hasReportData = items.length > 0;

  const totalDr = items
    .filter((i) => i.balanceType === "Dr")
    .reduce((s, i) => s + i.balance, 0);
  const totalCr = items
    .filter((i) => i.balanceType === "Cr")
    .reduce((s, i) => s + i.balance, 0);

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = items.map((i) => ({
      party: i.name,
      type: i.ptype,
      accounts: i.accountNames,
      txns: i.transactionCount,
      side: i.balanceType,
      balance: i.balance,
    }));
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["party", "type", "accounts", "txns", "side", "balance"],
          ["Party", "Type", "Accounts", "Transactions", "Side", "Balance"],
        ),
        "outstanding.csv",
      ),
    );
  }, [onRegisterExport, items]);

  const columns = [
    {
      key: "name",
      header: "Party Name",
      width: "200px",
      render: (v) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      key: "ptype",
      header: "Type",
      width: "100px",
      render: (v) => (
        <Badge variant={v === "Customer" ? "success" : "warning"}>{v}</Badge>
      ),
    },
    {
      key: "accountNames",
      header: "Accounts",
      width: "180px",
      render: (v) => (
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
          {v || "—"}
        </span>
      ),
    },
    {
      key: "transactionCount",
      header: "Txns",
      width: "80px",
      align: "right",
    },
    {
      key: "balanceType",
      header: "Side",
      width: "100px",
      render: (v) => (
        <Badge variant={v === "Dr" ? "success" : "danger"}>
          {v === "Dr" ? "Receivable" : "Payable"}
        </Badge>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      width: "140px",
      align: "right",
      render: (v) => formatNumber(v),
    },
  ];

  if (!hasReportData) {
    return <ReportEmpty message="No outstanding parties found for the selected period." />;
  }

  return (
    <div>
      <DataCardGrid cols={4} gap={8} style={{ marginBottom: 16 }}>
        <DataCard
          variant="success"
          value={formatNumber(totalDr)}
          label="Total Receivable (Dr)"
        />
        <DataCard
          variant="danger"
          value={formatNumber(totalCr)}
          label="Total Payable (Cr)"
        />
        <DataCard
          variant="accent"
          value={formatNumber(totalDr + totalCr)}
          label="Net Outstanding"
        />
        <DataCard variant="accent" value={String(items.length)} label="Parties" />
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
        exportFilename="outstanding.csv"
      />
      <ReportFooter label="Total Outstanding" values={[totalDr + totalCr]} />
    </div>
  );
};

export default RPT_RP_OST;
