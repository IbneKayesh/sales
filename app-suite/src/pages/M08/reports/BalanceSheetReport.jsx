import { IconTrendingUp, IconTrendingDown } from "@/icons";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import TreeDataTable from "@/components/TreeDataTable";

const BalanceSheetReport = ({ data, pnlData, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Calculating balance sheet..." />;
  if (!data) return <EmptyState icon={<IconTrendingUp size={32} />} title="No Data" message="No balance sheet data available." />;

  const { assetItems, liabilityItems, equityItems, totalAssets, totalLiabilities, totalEquity } = data;
  const netProfit = pnlData?.netProfit || 0;
  const totalLiabilitiesEquity = totalLiabilities + totalEquity + netProfit;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesEquity) < 0.01;

  const treeData = [
    {
      id: "assets",
      name: "ASSETS",
      isRoot: true,
      icon: <IconTrendingUp size={14} />,
      children: [
        ...assetItems.map(item => ({ ...item, id: `ast-${item.id}`, isRoot: false })),
        { id: "ast-total", name: "Total Assets", isSubtotal: true, balance: totalAssets, children: [] }
      ]
    },
    {
      id: "liabilities",
      name: "LIABILITIES",
      isRoot: true,
      icon: <IconTrendingDown size={14} />,
      children: [
        ...liabilityItems.map(item => ({ ...item, id: `lia-${item.id}`, isRoot: false })),
        { id: "lia-total", name: "Total Liabilities", isSubtotal: true, balance: totalLiabilities, children: [] }
      ]
    },
    {
      id: "equity",
      name: "EQUITY",
      isRoot: true,
      icon: <IconTrendingUp size={14} />,
      children: [
        ...equityItems.map(item => ({ ...item, id: `eq-${item.id}`, isRoot: false })),
        ...(netProfit !== 0 ? [{
          id: "eq-net",
          name: `Current Year ${netProfit >= 0 ? "Earnings" : "Loss"}`,
          isSubtotal: false,
          isProfit: true,
          icon: netProfit >= 0 ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />,
          balance: Math.abs(netProfit),
          children: []
        }] : []),
        { id: "eq-total", name: "Total Equity", isSubtotal: true, balance: totalEquity + netProfit, children: [] }
      ]
    },
    {
      id: "total_le",
      name: "Total Liabilities & Equity",
      isFooter: true,
      balance: totalLiabilitiesEquity,
      children: []
    }
  ];

  const columns = [
    {
      key: "name", header: "Account",
      render: (v, node) => {
        if (node.isFooter) return <span className="fw-bold d-flex align-center gap-1" style={{ fontSize: "0.9375rem" }}>{node.name}</span>;
        if (node.isRoot) return <span className="fw-bold d-flex align-center gap-1">{node.icon}{node.name}</span>;
        if (node.isSubtotal) return <span className="fw-semibold d-block text-muted" style={{ paddingLeft: 16 }}>{node.name}</span>;
        if (node.isProfit) return (
          <span className={`fw-semibold d-flex align-center gap-1 ${netProfit >= 0 ? "text-success" : "text-danger"}`} style={{ paddingLeft: 16 }}>
            {node.icon}{node.name}
          </span>
        );
        return <span style={{ paddingLeft: 16 }}>{node.name}</span>;
      }
    },
    {
      key: "balance", header: "Amount", align: "right",
      render: (v, node) => {
        if (node.isFooter) return <span className="fw-bold" style={{ fontSize: "0.9375rem" }}>{fmt(node.balance)}</span>;
        if (node.isRoot) return null;
        if (node.isSubtotal) return <span className="fw-semibold text-muted">{fmt(node.balance)}</span>;
        if (node.isProfit) return <span className={`fw-semibold ${netProfit >= 0 ? "text-success" : "text-danger"}`}>{fmt(node.balance)}</span>;
        return fmt(node.balance);
      }
    }
  ];

  return (
    <div className="overflow-auto" style={{ maxHeight: "600px" }}>
      <TreeDataTable
        columns={columns}
        data={treeData}
        sortable={false}
        dense
      />
      <div className={`p-3 d-flex align-center justify-between fw-semibold mt-2 rounded ${isBalanced ? "bg-success-light text-success" : "bg-danger-light text-danger"}`} style={{ border: `1px solid ${isBalanced ? "var(--success-border, #bbf7d0)" : "var(--danger-border, #fecaca)"}` }}>
        <span className="d-flex align-center gap-2">
          {isBalanced ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />}
          {isBalanced ? "Balance Sheet is balanced" : "Balance Sheet is out of balance"}
        </span>
        {!isBalanced && <span>Diff: {fmt(Math.abs(totalAssets - totalLiabilitiesEquity))}</span>}
      </div>
    </div>
  );
};

export default BalanceSheetReport;
