import { useState } from "react";
import { IconFile, IconSearch } from "@/icons";
import EmptyState from "@/components/EmptyState";
import InputText from "@/components/InputText";
import TreeDataTable from "@/components/TreeDataTable";

const GLedgerReport = ({ data, isLoading, fmt }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading general ledger..." />;
  if (!data || !data.accounts?.length) return <EmptyState icon={<IconFile size={32} />} title="No Data" message="No general ledger data available." />;

  const filtered = searchQuery ? data.accounts.filter((a) => a.accountName.toLowerCase().includes(searchQuery.toLowerCase())) : data.accounts;

  const treeData = filtered.map(a => ({
    id: a.accountId,
    accountName: a.accountName,
    chartNo: a.chartNo,
    balance: a.transactions?.[a.transactions.length - 1]?.runningBalance || 0,
    isRoot: true,
    children: (a.transactions || []).map(t => ({
      ...t,
      id: t.id,
      isRoot: false
    }))
  }));

  const columns = [
    {
      key: "name_or_date", header: "Account / Date", width: "300px",
      render: (v, node) => node.isRoot ? (
        <span className="fw-semibold">
          {node.accountName} <span className="text-muted small fw-normal">({node.chartNo}) · {node.children?.length || 0} entries</span>
        </span>
      ) : (
        <span style={{ paddingLeft: 8 }}>{node.date?.split("T")[0] || "—"}</span>
      )
    },
    { key: "trnType", header: "Type", render: (v, node) => node.isRoot ? "" : v },
    { key: "trnNo", header: "Trn No", render: (v, node) => node.isRoot ? "" : v },
    { key: "narration", header: "Narration", render: (v, node) => node.isRoot ? "" : v },
    { key: "debit", header: "Debit", align: "right", render: (v, node) => node.isRoot ? "" : (v > 0 ? fmt(v) : "—") },
    { key: "credit", header: "Credit", align: "right", render: (v, node) => node.isRoot ? "" : (v > 0 ? fmt(v) : "—") },
    { key: "runningBalance", header: "Balance", align: "right", render: (v, node) => node.isRoot ? <span className="fw-semibold">{fmt(node.balance)}</span> : fmt(v) }
  ];

  return (
    <div>
      <div className="d-flex align-center gap-2 mb-3">
        <div style={{ width: "300px" }}>
          <InputText icon={<IconSearch size={14} />} placeholder="Search accounts..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} dense />
        </div>
        <span className="small text-muted" style={{ whiteSpace: "nowrap" }}>{filtered.length} accounts</span>
      </div>
      <div className="overflow-auto" style={{ maxHeight: "600px" }}>
        <TreeDataTable
          columns={columns}
          data={treeData}
          sortable={false}
          dense
        />
      </div>
    </div>
  );
};

export default GLedgerReport;

