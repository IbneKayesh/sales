import { IconTrendingUp, IconTrendingDown } from "@/icons";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import TreeDataTable from "@/components/TreeDataTable";

const PnLReport = ({ data, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Calculating profit & loss..." />;
  if (!data) return <EmptyState icon={<IconTrendingUp size={32} />} title="No Data" message='No P&L data available.' />;

  const { incomeItems, expenseItems, totalIncome, totalExpenses, netProfit } = data;
  if (!incomeItems.length && !expenseItems.length) return <EmptyState title="No Transactions" message="No transactions found for the selected period." />;

  const treeData = [
    {
      id: "income",
      name: "INCOME",
      isRoot: true,
      icon: <IconTrendingUp size={14} className="text-success" />,
      balance: totalIncome,
      children: incomeItems.map(item => ({ ...item, id: `inc-${item.id}`, isRoot: false }))
    },
    {
      id: "expenses",
      name: "EXPENSES",
      isRoot: true,
      icon: <IconTrendingDown size={14} className="text-danger" />,
      balance: totalExpenses,
      children: expenseItems.map(item => ({ ...item, id: `exp-${item.id}`, isRoot: false }))
    },
    {
      id: "netProfit",
      name: `NET ${netProfit >= 0 ? "PROFIT" : "LOSS"}`,
      isRoot: true,
      isFooter: true,
      icon: netProfit >= 0 ? <IconTrendingUp size={16} className="text-success" /> : <IconTrendingDown size={16} className="text-danger" />,
      balance: Math.abs(netProfit),
      children: []
    }
  ];

  const columns = [
    {
      key: "name", header: "Account",
      render: (v, node) => {
        if (node.isFooter) return <span className="fw-bold d-flex align-center gap-1" style={{ fontSize: "0.9375rem" }}>{node.icon}{node.name}</span>;
        if (node.isRoot) return <span className="fw-bold d-flex align-center gap-1">{node.icon}{node.name}</span>;
        return <span style={{ paddingLeft: 8 }}>{node.name}</span>;
      }
    },
    { key: "chartNo", header: "Chart No", render: (v, node) => node.isRoot ? "" : <span className="text-muted">{v}</span> },
    {
      key: "balance", header: "Amount", align: "right",
      render: (v, node) => {
        if (node.isFooter) return <span className={`fw-bold ${netProfit >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "0.9375rem" }}>{fmt(node.balance)}</span>;
        if (node.isRoot) return <span className="fw-bold">{fmt(node.balance)}</span>;
        return fmt(Math.abs(v));
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
    </div>
  );
};

export default PnLReport;
