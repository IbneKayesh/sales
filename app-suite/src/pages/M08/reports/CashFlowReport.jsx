import { IconDollar, IconTrendingUp, IconTrendingDown } from "@/icons";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";
import TreeDataTable from "@/components/TreeDataTable";

const CashFlowReport = ({ data, isLoading, fmt }) => {
  if (isLoading) return <EmptyState variant="info" title="Loading..." message="Calculating cash flow..." />;
  if (!data) return <EmptyState icon={<IconDollar size={32} />} title="No Data" message='No cash flow data available.' />;

  const { openingBalance, closingBalance, operatingFlow, investingFlow, financingFlow, netCashFlow, cashAccounts } = data;

  const treeData = [
    {
      id: "cash_bank",
      name: "CASH & BANK ACCOUNTS",
      isRoot: true,
      icon: <IconDollar size={14} />,
      children: [
        ...(cashAccounts.length > 0 
          ? cashAccounts.map(acct => ({ ...acct, id: `csh-${acct.id}`, isRoot: false }))
          : [{ id: "csh-empty", name: "No cash/bank accounts found", balance: null, isRoot: false, isPlaceholder: true }])
      ]
    },
    {
      id: "operating",
      name: "OPERATING ACTIVITIES",
      isRoot: true,
      icon: <IconTrendingUp size={14} />,
      children: [
        { id: "op-net-income", name: "Net Income (from P&L)", balance: operatingFlow, isRoot: false },
        { id: "op-total", name: "Net Cash from Operating Activities", isSubtotal: true, balance: operatingFlow, children: [] }
      ]
    },
    {
      id: "investing",
      name: "INVESTING ACTIVITIES",
      isRoot: true,
      icon: <IconTrendingDown size={14} />,
      children: [
        { id: "inv-placeholder", name: "(Simplified — requires asset transaction data)", balance: null, isRoot: false, isPlaceholder: true },
        { id: "inv-total", name: "Net Cash from Investing Activities", isSubtotal: true, balance: investingFlow, children: [] }
      ]
    },
    {
      id: "financing",
      name: "FINANCING ACTIVITIES",
      isRoot: true,
      icon: <IconDollar size={14} />,
      children: [
        { id: "fin-placeholder", name: "(Simplified — requires loan/equity transaction data)", balance: null, isRoot: false, isPlaceholder: true },
        { id: "fin-total", name: "Net Cash from Financing Activities", isSubtotal: true, balance: financingFlow, children: [] }
      ]
    },
    {
      id: "net_cash",
      name: "Net Cash Flow",
      isFooter: true,
      balance: netCashFlow,
      children: []
    }
  ];

  const columns = [
    {
      key: "name", header: "Cash Flow Statement",
      render: (v, node) => {
        if (node.isFooter) return <span className="fw-bold d-flex align-center gap-1" style={{ fontSize: "0.9375rem" }}>{node.name}</span>;
        if (node.isRoot) return <span className="fw-bold d-flex align-center gap-1">{node.icon}{node.name}</span>;
        if (node.isSubtotal) return <span className="fw-semibold d-block text-muted" style={{ paddingLeft: 16 }}>{node.name}</span>;
        if (node.isPlaceholder) return <span className="text-muted" style={{ fontStyle: "italic", paddingLeft: 16 }}>{node.name}</span>;
        return <span style={{ paddingLeft: 16 }}>{node.name}</span>;
      }
    },
    {
      key: "balance", header: "Amount", align: "right", minWidth: 140,
      render: (v, node) => {
        if (node.isFooter) return <span className={`fw-bold ${node.balance >= 0 ? "text-success" : "text-danger"}`} style={{ fontSize: "0.9375rem" }}>{node.balance >= 0 ? fmt(node.balance) : `(${fmt(Math.abs(node.balance))})`}</span>;
        if (node.isRoot) return null;
        if (node.isSubtotal) return <span className={`fw-semibold ${node.balance >= 0 ? "text-success" : "text-danger"}`}>{node.balance >= 0 ? fmt(node.balance) : `(${fmt(Math.abs(node.balance))})`}</span>;
        if (node.isPlaceholder) return <span className="text-muted">—</span>;
        return node.balance >= 0 ? fmt(node.balance) : `(${fmt(Math.abs(node.balance))})`;
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
      
      <div className="d-flex flex-column gap-2 mt-3 p-3 bg-surface rounded border">
        <div className="d-flex justify-between">
          <span className="fw-medium text-muted">Opening Cash Balance</span>
          <span className="font-tabular">{fmt(openingBalance)}</span>
        </div>
        <div className="d-flex justify-between pt-2" style={{ borderTop: "1px dashed var(--border-light)" }}>
          <span className="fw-bold">Closing Cash Balance</span>
          <span className="fw-bold font-tabular">{fmt(closingBalance)}</span>
        </div>
      </div>
    </div>
  );
};

export default CashFlowReport;
