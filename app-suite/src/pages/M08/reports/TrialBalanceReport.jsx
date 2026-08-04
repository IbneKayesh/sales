import { IconActivity } from "@/icons";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";

const typeBadgeVariant = {
  Assets: "primary",
  Liabilities: "warning",
  Equity: "success",
  Income: "success",
  Expenses: "danger",
};

const TrialBalanceReport = ({ data, isLoading, fmt }) => {
  if (isLoading)
    return (
      <EmptyState
        variant="info"
        title="Loading..."
        message="Calculating trial balance..."
      />
    );
  if (!data)
    return (
      <EmptyState
        icon={<IconActivity size={32} />}
        title="No Data"
        message="No trial balance data available."
      />
    );

  const { items, totalDr, totalCr } = data;
  const isBalanced = Math.abs(totalDr - totalCr) < 0.01;
  if (!items.length)
    return (
      <EmptyState
        title="No Accounts"
        message="No accounts with balances found."
      />
    );

  const columns = [
    {
      key: "name",
      header: "Account",
      width: "250px",
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{v}</div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: 1,
            }}
          >
            {row.chartNo}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "120px",
      render: (v) => (
        <Badge variant={typeBadgeVariant[v] || "muted"}>{v}</Badge>
      ),
    },
    {
      key: "drVal",
      header: "Debit (Dr)",
      width: "140px",
      align: "right",
      render: (v) => (v > 0 ? fmt(v) : "—"),
    },
    {
      key: "crVal",
      header: "Credit (Cr)",
      width: "140px",
      align: "right",
      render: (v) => (v > 0 ? fmt(v) : "—"),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={items}
        pageSize={100}
        sortable
        striped
        hoverable
        dense
        emptyMessage="No trial balance data"
      />
      <div className="page-card__footer">
        <span className="fw-semibold">Total</span>
        <div className="d-flex gap-4">
          <span
            className="fw-bold"
            style={{
              minWidth: "120px",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmt(totalDr)}
          </span>
          <span
            className="fw-bold"
            style={{
              minWidth: "120px",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmt(totalCr)}
          </span>
        </div>
      </div>
      <div
        className={`page-card__footer fw-semibold ${isBalanced ? "text-success" : "text-danger"}`}
      >
        {isBalanced
          ? "✓ Trial Balance is Balanced"
          : `✗ Difference: ${fmt(Math.abs(totalDr - totalCr))}`}
      </div>
    </div>
  );
};

export default TrialBalanceReport;
