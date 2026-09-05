import { useMemo } from "react";
import TreeDataTable from "@/components/TreeDataTable";
import { IconCheck, IconClose } from "@/icons";
import Badge from "@/components/Badge";
import Chip from "@/components/Chip";
import ActionButton from "@/components/ActionButton";
import EmptyState from "@/components/EmptyState";
import InactiveText from "@/components/InactiveText";

/* ─── Colour variants ─── */
const ctypeVariants = {
  Assets: "primary",
  Liabilities: "warning",
  Equity: "success",
  Income: "success",
  Expenses: "danger",
};

const ctypeOrder = ["Assets", "Liabilities", "Equity", "Income", "Expenses"];

const ntypeVariants = {
  Dr: "danger",
  Cr: "success",
};

/* ─── Build a nested tree from a flat list, sorted by ctypeOrder then chart no ─── */
function sortTreeNodes(a, b) {
  const ai = ctypeOrder.indexOf(a.chtac_ctype);
  const bi = ctypeOrder.indexOf(b.chtac_ctype);
  const typeDiff = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  if (typeDiff !== 0) return typeDiff;

  // Same type → sort by chart number
  return (Number(a.chtac_chtno) || 0) - (Number(b.chtac_chtno) || 0);
}

function sortTree(nodes) {
  nodes.sort(sortTreeNodes);
  nodes.forEach((n) => {
    if (n.children?.length) sortTree(n.children);
  });
  return nodes;
}

function buildTree(list) {
  const map = {};
  const roots = [];

  list.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  list.forEach((item) => {
    const node = map[item.id];
    if (item.chtac_chtac && item.chtac_chtac !== "-" && map[item.chtac_chtac]) {
      map[item.chtac_chtac].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return sortTree(roots);
}

/* ─── COAList component ─── */
const COAList = ({ listData, onEdit, onDelete }) => {
  const treeData = useMemo(() => buildTree(listData), [listData]);

  /* ─── Type distribution summary ─── */
  const typeCounts = useMemo(() => {
    const counts = {};
    listData.forEach((row) => {
      const type = row.chtac_ctype || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [listData]);

  /* ─── Columns ─── */
  const dtColumns = [
    {
      key: "chtac_cname",
      header: "Account Name",
      width: "240px",
      render: (v, row) => {
        const hasChildren = row.children?.length > 0;
        return (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontWeight: hasChildren ? 800 : 400,
                color: hasChildren ? "var(--text-primary)" : "inherit",
              }}
            >
              <InactiveText
                text={`${row.chtac_chtno}-${v}` || "—"}
                active={row.chtac_actve}
              />

              {row.party_count > 0 && " "}
              {row.party_count > 0 && (
                <Chip
                  variant="primary"
                  size="sm"
                  style={{ marginLeft: "5px", fontWeight: 600 }}
                >
                  {row.party_count} Party
                </Chip>
              )}
            </span>
          </span>
        );
      },
    },
    {
      key: "chtac_chtno",
      header: "Chart No",
      width: "110px",
      align: "right",
      render: (v) => <span className="text-sm">{v || "—"}</span>,
    },
    {
      key: "chtac_ctype",
      header: "Type/Nature/Control",
      width: "110px",
      render: (_, row) => (
        <>
          <Badge variant={ctypeVariants[row.chtac_ctype] || "muted"}>
            {row.chtac_ctype || "—"}
          </Badge>
          <Chip variant={ntypeVariants[row.chtac_ntype] || "default"}>
            {row.chtac_ntype || "—"}
          </Chip>
          <Badge
            variant={row.chtac_ispst ? "danger" : "success"}
            icon={
              row.chtac_ispst ? (
                <IconClose size={12} />
              ) : (
                <IconCheck size={12} />
              )
            }
          >
            {row.chtac_ispst ? "No" : "Yes"}
          </Badge>
        </>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "110px",
      sortable: false,
      render: (_, row) => (
        <ActionButton
          rowData={row}
          actve={row.chtac_actve}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  /* ─── Empty state ─── */
  if (!listData.length) {
    return (
      <EmptyState
        title="No chart of accounts"
        message="There are no accounts yet. Click Add to create the first account head."
        variant="noData"
      />
    );
  }

  return (
    <div>
      {/* ── Type Distribution Summary ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "var(--sp-4)",
          padding: "var(--sp-3) var(--sp-4)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--text-muted)",
            marginRight: 4,
          }}
        >
          Distribution:
        </span>
        {ctypeOrder.map((type) => {
          const count = typeCounts[type] || 0;
          if (!count) return null;
          return (
            <Badge key={type} variant={ctypeVariants[type] || "muted"}>
              {type}: {count}
            </Badge>
          );
        })}
        <span
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--text-danger)",
            marginLeft: "auto",
          }}
        >
          {listData.length} total
        </span>
      </div>

      {/* ── Tree Table ── */}
      <TreeDataTable
        columns={dtColumns}
        data={treeData}
        treeColumn={0}
        sortable
        searchable
        searchPlaceholder="Search..."
        exportable
        exportFilename="data-export.csv"
        striped
        hoverable
        onRowClick={(row) => onEdit(row)}
        emptyMessage="No data found"
      />
    </div>
  );
};

export default COAList;
