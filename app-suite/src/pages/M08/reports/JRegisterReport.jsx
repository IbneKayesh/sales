import { useState } from "react";
import { IconFile, IconSearch } from "@/icons";
import EmptyState from "@/components/EmptyState";
import InputText from "@/components/InputText";
import Badge from "@/components/Badge";
import TreeDataTable from "@/components/TreeDataTable";

const JRegisterReport = ({ data, isLoading, fmt }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Loading journal register..." />;
  if (!data || !data.entries?.length) return <EmptyState icon={<IconFile size={32} />} title="No Data" message="No journal entries found." />;

  const filtered = searchQuery
    ? data.entries.filter((e) =>
        e.narration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.trnNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.trnType?.toLowerCase().includes(searchQuery.toLowerCase()))
    : data.entries;

  const treeData = filtered.map(entry => ({
    id: entry.id,
    date: entry.date,
    trnType: entry.trnType,
    trnNo: entry.trnNo,
    narration: entry.narration,
    totalDr: entry.totalDr,
    totalCr: entry.totalCr,
    isRoot: true,
    children: (entry.lines || []).map((line, i) => ({
      ...line,
      id: `${entry.id}-${i}`,
      isRoot: false
    }))
  }));

  const columns = [
    { key: "date", header: "Date", width: "120px", render: (v, node) => node.isRoot ? (v?.split("T")[0] || "—") : "" },
    { key: "trnType", header: "Type", width: "100px", render: (v, node) => node.isRoot ? <Badge variant="primary">{v}</Badge> : "" },
    { key: "trnNo", header: "Trn No", width: "120px", render: (v, node) => node.isRoot ? v : "" },
    {
      key: "narration_or_account", header: "Narration / Account",
      render: (v, node) => node.isRoot ? (
        <span className="fw-semibold">{node.narration || "—"}</span>
      ) : (
        <span>
          {node.accountName}
          {node.description && <span className="text-muted small ms-2">— {node.description}</span>}
        </span>
      )
    },
    { key: "debit", header: "Debit", align: "right", render: (v, node) => node.isRoot ? <span className="fw-semibold">{fmt(node.totalDr)}</span> : (v > 0 ? fmt(v) : "—") },
    { key: "credit", header: "Credit", align: "right", render: (v, node) => node.isRoot ? <span className="fw-semibold">{fmt(node.totalCr)}</span> : (v > 0 ? fmt(v) : "—") }
  ];

  return (
    <div>
      <div className="d-flex align-center gap-2 mb-3">
        <div style={{ width: "300px" }}>
          <InputText icon={<IconSearch size={14} />} placeholder="Search entries..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} dense />
        </div>
        <span className="small text-muted" style={{ whiteSpace: "nowrap" }}>{filtered.length} entries</span>
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

export default JRegisterReport;

