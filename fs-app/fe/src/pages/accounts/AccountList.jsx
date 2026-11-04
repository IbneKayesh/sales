import {
  Landmark,
  Pencil,
  PiggyBank,
  Plus,
  RefreshCw,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  PageHeader,
  SearchField,
  StatCard,
  StatusBadge,
} from "../../components/ui";
import { accountBalance } from "../../lib/domain/aggregates";
import { formatMoney } from "../../lib/domain/format";

export function AccountList({
  rows,
  banks,
  savings,
  dps,
  fd,
  transactions,
  loading,
  reload,
  search,
  setSearch,
  bankFilter,
  setBankFilter,
  stats,
  openCreate,
  openEdit,
  requestDelete,
}) {
  const childCount = (account) =>
    [...savings, ...dps, ...fd].filter((child) => child.accountId === account._id)
      .length;

  const columns = [
    {
      key: "account",
      header: "Bank account",
      render: (account) => (
        <div>
          <div className="cell-name">{account.accountName}</div>
          <div className="cell-mono">{account.accountNo}</div>
        </div>
      ),
    },
    {
      key: "bank",
      header: "Bank",
      render: (account) => (
        <div>
          <div>{account.bankName || "—"}</div>
          <div className="cell-muted">{account.branch || "—"}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (account) => <Badge tone="brand">{account.type || "Savings"}</Badge>,
    },
    {
      key: "opening",
      header: "Opening balance",
      className: "cell-amount",
      render: (account) => formatMoney(account.openingBalance),
    },
    {
      key: "balance",
      header: "Current balance",
      className: "cell-amount",
      render: (account) => formatMoney(accountBalance(account, transactions)),
    },
    {
      key: "children",
      header: "Sub accounts",
      render: (account) => childCount(account),
    },
    {
      key: "status",
      header: "Status",
      render: (account) => <StatusBadge status={account.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "cell-actions",
      render: (account) => (
        <div className="row-actions">
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label={`Edit ${account.accountName}`}
            onClick={() => openEdit(account)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label={`Delete ${account.accountName}`}
            onClick={() => requestDelete(account)}
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
        title="Bank Accounts"
        subtitle="Bank accounts, each with Savings, DPS and FD sub accounts"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus size={15} /> Add bank account
          </Button>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={Wallet}
          tone="brand"
          label="Bank accounts"
          value={stats.total}
          hint="across all banks"
        />
        <StatCard
          icon={Landmark}
          tone="success"
          label="Combined balance"
          value={formatMoney(stats.balance)}
          hint="opening + credits − debits"
          valueTone="success"
        />
        <StatCard
          icon={Landmark}
          tone="info"
          label="Banks covered"
          value={stats.banks}
          hint="banks with an account"
        />
        <StatCard
          icon={PiggyBank}
          tone="violet"
          label="Sub accounts"
          value={stats.childCount}
          hint="Savings, DPS & FD"
        />
      </div>

      <Card>
        <CardHeader
          title="All bank accounts"
          icon={Wallet}
          actions={
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              onClick={reload}
              aria-label="Refresh bank accounts"
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

          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search account name or no…"
            label="Search bank accounts"
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(account) => account._id}
          loading={loading}
          loadingText="Loading bank accounts…"
          empty={
            <EmptyState
              icon={Wallet}
              title={search ? "No matching accounts" : "No bank accounts yet"}
              description={
                search
                  ? "Try a different bank or search term."
                  : "Add a savings account under one of your banks."
              }
              action={
                search ? null : (
                  <Button variant="primary" onClick={openCreate}>
                    <Plus size={15} /> Add bank account
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
