import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Pencil,
  Plus,
  RefreshCw,
  Scale,
  Trash2,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  PageHeader,
  SearchField,
  StatCard,
  TransactionBadge,
} from "../../components/ui";
import { creditEntry, debitEntry } from "../../lib/domain/aggregates";
import { TRANSACTION_TYPE_OPTIONS } from "../../lib/domain/constants";
import { formatDate, formatMoney } from "../../lib/domain/format";

function Leg({ entry }) {
  if (!entry) return <span className="cell-muted">—</span>;

  return (
    <div>
      <div className="cell-name">{entry.name}</div>
      <div className="cell-mono cell-muted">
        {entry.accountNo || entry.type}
        {entry.bankName ? ` · ${entry.bankName}` : ""}
      </div>
    </div>
  );
}

export function TransactionList({
  rows,
  banks,
  loading,
  reload,
  bankFilter,
  setBankFilter,
  typeFilter,
  setTypeFilter,
  search,
  setSearch,
  stats,
  openCreate,
  openEdit,
  requestDelete,
}) {
  const columns = [
    {
      key: "date",
      header: "Date",
      className: "w-110",
      render: (tx) => <span className="cell-muted">{formatDate(tx.date)}</span>,
    },
    {
      key: "debit",
      header: "Debit (Dr)",
      render: (tx) => <Leg entry={debitEntry(tx)} />,
    },
    {
      key: "credit",
      header: "Credit (Cr)",
      render: (tx) => <Leg entry={creditEntry(tx)} />,
    },
    {
      key: "type",
      header: "Type",
      render: (tx) => <TransactionBadge type={tx.type} />,
    },
    {
      key: "amount",
      header: "Amount",
      className: "cell-amount",
      render: (tx) => formatMoney(tx.amount),
    },
    {
      key: "reference",
      header: "Reference",
      className: "cell-mono",
      render: (tx) => tx.reference || "—",
    },
    {
      key: "description",
      header: "Description",
      className: "cell-truncate",
      render: (tx) => <span title={tx.description}>{tx.description || "—"}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "cell-actions",
      render: (tx) => (
        <div className="row-actions">
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label="Edit transaction"
            onClick={() => openEdit(tx)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label="Delete transaction"
            onClick={() => requestDelete(tx)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Journal"
        subtitle="Every transaction is a balanced double entry posted to a sub account"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus size={15} /> New journal entry
          </Button>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={ArrowLeftRight}
          tone="brand"
          label="Entries"
          value={stats.count}
          hint={`of ${stats.total} total`}
        />
        <StatCard
          icon={ArrowDownLeft}
          tone="success"
          label="Money in"
          value={formatMoney(stats.totalIn)}
          hint="net per bank · deposits & profit"
          valueTone="success"
        />
        <StatCard
          icon={ArrowUpRight}
          tone="danger"
          label="Money out"
          value={formatMoney(stats.totalOut)}
          hint="net per bank · withdrawals & charges"
          valueTone="danger"
        />
        <StatCard
          icon={Scale}
          tone="info"
          label="Net flow"
          value={formatMoney(stats.net)}
          hint="money in − money out"
          valueTone={stats.net >= 0 ? "success" : "danger"}
        />
      </div>

      <Card>
        <CardHeader
          title="All journal entries"
          icon={ArrowLeftRight}
          actions={
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              onClick={reload}
              aria-label="Refresh transactions"
            >
              <RefreshCw size={14} />
            </Button>
          }
        />

        <div className="toolbar">
          <select
            className="select"
            value={bankFilter}
            aria-label="Filter by bank"
            onChange={(event) => setBankFilter(event.target.value)}
          >
            <option value="all">All banks</option>
            {banks.map((bank) => (
              <option key={bank._id} value={bank._id}>
                {bank.name}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={typeFilter}
            aria-label="Filter by transaction type"
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All types</option>
            {TRANSACTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search sub account, description, reference…"
            label="Search transactions"
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(tx) => tx._id}
          loading={loading}
          loadingText="Loading journal…"
          empty={
            <EmptyState
              icon={ArrowLeftRight}
              title={search ? "No matching journal entries" : "No transactions yet"}
              description={
                search
                  ? "Try a different bank, type or search term."
                  : "Post a deposit, withdrawal, DPS installment or transfer."
              }
              action={
                search ? null : (
                  <Button variant="primary" onClick={openCreate}>
                    <Plus size={15} /> New journal entry
                  </Button>
                )
              }
            />
          }
        />
      </Card>
    </>
  );
}
