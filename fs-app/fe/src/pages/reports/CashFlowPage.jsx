import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  Landmark,
} from "lucide-react";
import {
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  PageHeader,
  StatCard,
} from "../../components/ui";
import { useCashFlow } from "../../hooks/useCashFlow";
import { bankTotalBalance } from "../../lib/domain/aggregates";
import { formatMoney, formatMonth } from "../../lib/domain/format";

export function CashFlowPage() {
  const {
    accounts,
    transactions,
    loading,
    months,
    selectedMonth,
    setMonth,
    rows,
    totals,
  } = useCashFlow();

  const columns = [
    {
      key: "bank",
      header: "Bank",
      render: (row) => (
        <div>
          <div className="cell-name">{row.bank.name}</div>
          <div className="cell-muted">{row.bank.branch || "—"}</div>
        </div>
      ),
    },
    {
      key: "deposits",
      header: "Deposits",
      className: "cell-amount",
      render: (row) => formatMoney(row.deposits),
    },
    {
      key: "profit",
      header: "Profit",
      className: "cell-amount",
      render: (row) => (
        <span className={row.profit > 0 ? "u-text-success" : undefined}>
          {formatMoney(row.profit)}
        </span>
      ),
    },
    {
      key: "withdrawals",
      header: "Withdrawals",
      className: "cell-amount",
      render: (row) => formatMoney(row.withdrawals),
    },
    {
      key: "transfers",
      header: "Transfers / DPS-FD",
      className: "cell-amount",
      render: (row) => formatMoney(row.transfers),
    },
    {
      key: "charges",
      header: "Charges",
      className: "cell-amount",
      render: (row) => formatMoney(row.charges),
    },
    {
      key: "net",
      header: "Net flow",
      className: "cell-amount",
      render: (row) => (
        <span className={row.net >= 0 ? "u-text-success" : "u-text-danger"}>
          {row.net >= 0 ? "+" : "−"} {formatMoney(Math.abs(row.net))}
        </span>
      ),
    },
    {
      key: "balance",
      header: "Current balance",
      className: "cell-amount",
      render: (row) =>
        formatMoney(bankTotalBalance(row.bank, accounts, transactions)),
    },
  ];

  const footer = (
    <tr>
      <td>Total</td>
      <td className="cell-amount">{formatMoney(totals.deposits)}</td>
      <td className="cell-amount">{formatMoney(totals.profit)}</td>
      <td className="cell-amount">{formatMoney(totals.withdrawals)}</td>
      <td className="cell-amount">{formatMoney(totals.transfers)}</td>
      <td className="cell-amount">{formatMoney(totals.charges)}</td>
      <td className={`cell-amount ${totals.net >= 0 ? "u-text-success" : "u-text-danger"}`}>
        {totals.net >= 0 ? "+" : "−"} {formatMoney(Math.abs(totals.net))}
      </td>
      <td />
    </tr>
  );

  return (
    <>
      <PageHeader
        title="Monthly Cash Flow"
        subtitle={`Deposits, profit and withdrawals per bank${
          selectedMonth ? ` · ${formatMonth(selectedMonth)}` : ""
        }`}
        actions={
          <select
            className="select"
            value={selectedMonth}
            aria-label="Report month"
            disabled={!months.length}
            onChange={(event) => setMonth(event.target.value)}
          >
            {months.length === 0 ? (
              <option value="">No transactions</option>
            ) : (
              months.map((value) => (
                <option key={value} value={value}>
                  {formatMonth(value)}
                </option>
              ))
            )}
          </select>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={ArrowDownLeft}
          tone="success"
          label="Money in"
          value={formatMoney(totals.moneyIn)}
          hint="deposits + profit"
          valueTone="success"
        />
        <StatCard
          icon={ArrowUpRight}
          tone="danger"
          label="Money out"
          value={formatMoney(totals.moneyOut)}
          hint="withdrawals + transfers + charges"
          valueTone="danger"
        />
        <StatCard
          icon={BarChart3}
          tone="brand"
          label="Net flow"
          value={formatMoney(totals.net)}
          hint={formatMonth(selectedMonth)}
          valueTone={totals.net >= 0 ? "success" : "danger"}
        />
        <StatCard
          icon={ArrowLeftRight}
          tone="info"
          label="Transactions"
          value={totals.count}
          hint="entries this month"
        />
      </div>

      <Card>
        <CardHeader title="Cash flow by bank" icon={Landmark} />
        <DataTable
          columns={columns}
          rows={months.length ? rows : []}
          rowKey={(row) => row.bank._id}
          loading={loading}
          loadingText="Loading cash flow…"
          footer={months.length ? footer : null}
          empty={
            <EmptyState
              icon={BarChart3}
              title="No transactions to report"
              description="Record deposits, profit or withdrawals to build a monthly cash-flow report."
            />
          }
        />
      </Card>
    </>
  );
}
