import { useEffect, useState } from "react";
import TreeDataTable from "@/components/TreeDataTable";
import InputText from "@/components/InputText";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_LR_JR = ({ listData, onRegisterExport }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Group journal lines per entry (by reference no)
  const entryMap = {};
  listData.forEach((row) => {
    const key = row.jrnlm_refno || `${row.jrnlm_trdat}-${row.jrnlc_chtac}`;
    if (!entryMap[key]) {
      entryMap[key] = {
        id: key,
        date: (row.jrnlm_trdat || "").split("T")[0],
        trnType: row.jrnlm_trtyp,
        trnNo: row.jrnlm_refno,
        narration: row.jrnlm_narrt,
        totalDr: 0,
        totalCr: 0,
        lines: [],
      };
    }
    entryMap[key].totalDr += Number(row.jrnlc_drval) || 0;
    entryMap[key].totalCr += Number(row.jrnlc_crval) || 0;
    entryMap[key].lines.push({
      accountName: row.chtac_cname,
      chartNo: row.chtac_chtno,
      description: row.jrnlc_descr || "",
      party: row.party_cname || "",
      debit: Number(row.jrnlc_drval) || 0,
      credit: Number(row.jrnlc_crval) || 0,
    });
  });

  const treeData = Object.values(entryMap).map((entry) => ({
    ...entry,
    isRoot: true,
    children: entry.lines.map((line, i) => ({
      ...line,
      id: `${entry.id}-${i}`,
    })),
  }));

  const filtered = searchQuery
    ? treeData.filter((e) =>
        [e.narration, e.trnNo, e.trnType, e.date]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : treeData;

  const hasReportData = treeData.length > 0;

  // Register CSV export for the holder Export button
  useEffect(() => {
    if (!onRegisterExport) return;
    if (!hasReportData) {
      onRegisterExport(null);
      return;
    }
    const rows = [];
    Object.values(entryMap).forEach((entry) => {
      entry.lines.forEach((line) => {
        rows.push({
          date: entry.date || "",
          trnNo: entry.trnNo || "",
          type: entry.trnType || "",
          narration: entry.narration || "",
          account: line.accountName || "",
          debit: line.debit,
          credit: line.credit,
        });
      });
    });
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["date", "trnNo", "type", "narration", "account", "debit", "credit"],
          ["Date", "Trn No", "Type", "Narration", "Account", "Debit", "Credit"],
        ),
        "journal-register.csv",
      ),
    );
  }, [onRegisterExport, listData]);

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (v, node) => (node.isRoot ? v || "—" : ""),
    },
    {
      key: "trnType",
      header: "Type",
      render: (v, node) =>
        node.isRoot ? (v ? <Badge variant="primary">{v}</Badge> : "—") : "",
    },
    {
      key: "trnNo",
      header: "Trn No",
      render: (v, node) => (node.isRoot ? v || "—" : ""),
    },
    {
      key: "narration",
      header: "Narration / Account",
      render: (v, node) =>
        node.isRoot ? (
          <span className="fw-semibold">{v || "—"}</span>
        ) : (
          <span style={{ paddingLeft: 8 }}>
            {node.accountName}
            {node.description && (
              <span className="text-muted small ms-2">— {node.description}</span>
            )}
          </span>
        ),
    },
    {
      key: "debit",
      header: "Debit",
      align: "right",
      render: (v, node) =>
        node.isRoot ? (
          <span className="fw-semibold">{formatNumber(node.totalDr)}</span>
        ) : v > 0 ? (
          formatNumber(v)
        ) : (
          "—"
        ),
    },
    {
      key: "credit",
      header: "Credit",
      align: "right",
      render: (v, node) =>
        node.isRoot ? (
          <span className="fw-semibold">{formatNumber(node.totalCr)}</span>
        ) : v > 0 ? (
          formatNumber(v)
        ) : (
          "—"
        ),
    },
  ];

  if (!hasReportData) {
    return <EmptyState message="No journal entries found for the selected period." />;
  }

  return (
    <div>
      <div className="d-flex align-center gap-2 mb-3">
        <div style={{ width: 300 }}>
          <InputText
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dense
          />
        </div>
        <span className="small text-muted" style={{ whiteSpace: "nowrap" }}>
          {filtered.length} entries
        </span>
      </div>
      <div className="overflow-auto" style={{ maxHeight: 600 }}>
        <TreeDataTable
          columns={columns}
          data={filtered}
          sortable={false}
          dense
        />
      </div>
    </div>
  );
};

export default RPT_LR_JR;
