import { useEffect, useState } from "react";
import TreeDataTable from "@/components/TreeDataTable";
import InputText from "@/components/InputText";
import EmptyState from "@/components/EmptyState";
import { formatNumber } from "@/utils/misc";
import { exportToCSV, buildColumns } from "@/utils/export";

const RPT_LR_GL = ({ listData, onRegisterExport }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Group journal lines per account
  const accountMap = {};
  listData.forEach((row) => {
    const key = row.jrnlc_chtac;
    if (!accountMap[key]) {
      accountMap[key] = {
        id: key,
        name: row.chtac_cname,
        chartNo: row.chtac_chtno,
        ctype: row.chtac_ctype,
        ntype: row.chtac_ntype,
        lines: [],
      };
    }
    accountMap[key].lines.push(row);
  });

  const treeData = Object.values(accountMap)
    .map((account) => {
      const sorted = [...account.lines].sort(
        (a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat),
      );
      // Debit/credit nature comes from chtac_ntype (fallback to ctype heuristics)
      const drNature = account.ntype
        ? account.ntype === "Dr"
        : account.ctype === "Assets" || account.ctype === "Expenses";
      let running = 0;
      const children = sorted.map((line, i) => {
        const dr = Number(line.jrnlc_drval) || 0;
        const cr = Number(line.jrnlc_crval) || 0;
        running += drNature ? dr - cr : cr - dr;
        return {
          id: `${account.id}-${i}`,
          date: (line.jrnlm_trdat || "").split("T")[0],
          trnType: line.jrnlm_trtyp,
          trnNo: line.jrnlm_refno,
          narration: line.jrnlm_narrt || line.jrnlc_descr || "",
          party: line.party_cname || "",
          debit: dr,
          credit: cr,
          runningBalance: running,
        };
      });
      return {
        id: account.id,
        name: account.name,
        chartNo: account.chartNo,
        ctype: account.ctype,
        ntype: account.ntype,
        entryCount: children.length,
        closingBalance: running,
        isRoot: true,
        children,
      };
    })
    .filter((a) => a.children.length > 0);

  const filtered = searchQuery
    ? treeData.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
    Object.values(accountMap).forEach((account) => {
      // Debit/credit nature comes from chtac_ntype (fallback to ctype heuristics)
      const drNature = account.ntype
        ? account.ntype === "Dr"
        : account.ctype === "Assets" || account.ctype === "Expenses";
      let running = 0;
      [...account.lines]
        .sort((a, b) => new Date(a.jrnlm_trdat) - new Date(b.jrnlm_trdat))
        .forEach((line) => {
          const dr = Number(line.jrnlc_drval) || 0;
          const cr = Number(line.jrnlc_crval) || 0;
          running += drNature ? dr - cr : cr - dr;
          rows.push({
            account: account.name,
            date: (line.jrnlm_trdat || "").split("T")[0],
            trnNo: line.jrnlm_refno || "",
            type: line.jrnlm_trtyp || "",
            narration: line.jrnlm_narrt || line.jrnlc_descr || "",
            debit: dr,
            credit: cr,
            balance: running,
          });
        });
    });
    onRegisterExport(() =>
      exportToCSV(
        rows,
        buildColumns(
          ["account", "date", "trnNo", "type", "narration", "debit", "credit", "balance"],
          ["Account", "Date", "Trn No", "Type", "Narration", "Debit", "Credit", "Balance"],
        ),
        "general-ledger.csv",
      ),
    );
  }, [onRegisterExport, listData]);

  const columns = [
    {
      key: "name",
      header: "Account / Date",
      render: (v, node) =>
        node.isRoot ? (
          <span className="fw-semibold">
            {node.name}{" "}
            <span className="text-muted small fw-normal">
              ({node.chartNo}) · {node.ctype} ({node.ntype || "—"}) ·{" "}
              {node.entryCount} entries
            </span>
          </span>
        ) : (
          <span style={{ paddingLeft: 8 }}>{node.date || "—"}</span>
        ),
    },
    {
      key: "trnType",
      header: "Type",
      render: (v, node) => (node.isRoot ? "" : v || "—"),
    },
    {
      key: "trnNo",
      header: "Trn No",
      render: (v, node) => (node.isRoot ? "" : v || "—"),
    },
    {
      key: "narration",
      header: "Narration",
      render: (v, node) => (node.isRoot ? "" : v || "—"),
    },
    {
      key: "debit",
      header: "Debit",
      align: "right",
      render: (v, node) =>
        node.isRoot ? "" : v > 0 ? formatNumber(v) : "—",
    },
    {
      key: "credit",
      header: "Credit",
      align: "right",
      render: (v, node) =>
        node.isRoot ? "" : v > 0 ? formatNumber(v) : "—",
    },
    {
      key: "runningBalance",
      header: "Balance",
      align: "right",
      render: (v, node) =>
        node.isRoot ? (
          <span className="fw-semibold">{formatNumber(node.closingBalance)}</span>
        ) : (
          formatNumber(v)
        ),
    },
  ];

  if (!hasReportData) {
    return <EmptyState message="No accounts found for the selected period." />;
  }

  return (
    <div>
      <div className="d-flex align-center gap-2 mb-3">
        <div style={{ width: 300 }}>
          <InputText
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dense
          />
        </div>
        <span className="small text-muted" style={{ whiteSpace: "nowrap" }}>
          {filtered.length} accounts
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

export default RPT_LR_GL;
