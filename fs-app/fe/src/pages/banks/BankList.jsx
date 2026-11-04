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

export function BankList({
  rows,
  accounts,
  dps,
  fd,
  transactions,
  loading,
  reload,
  search,
  setSearch,
  stats,
  openCreate,
  openEdit,
  requestDelete,
}) {
  const balanceOf = (bank) =>
    accounts
      .filter((account) => account.bankId === bank._id)
      .reduce((total, account) => total + accountBalance(account, transactions), 0);

  const columns = [
    {
      key: "bank",
      header: "Bank",
      render: (bank) => (
        <div>
          <div className="cell-name">{bank.name}</div>
          <div className="cell-muted">{bank.branch || "—"}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (bank) => <StatusBadge status={bank.status} />,
    },
    {
      key: "accounts",
      header: "Bank accounts",
      render: (bank) =>
        accounts.filter((account) => account.bankId === bank._id).length,
    },
    {
      key: "children",
      header: "DPS / FD",
      render: (bank) => {
        const bankDps = dps.filter((account) => account.bankId === bank._id).length;
        const bankFd = fd.filter((account) => account.bankId === bank._id).length;
        return `${bankDps} / ${bankFd}`;
      },
    },
    {
      key: "balance",
      header: "Total balance",
      className: "cell-amount",
      render: (bank) => formatMoney(balanceOf(bank)),
    },
    {
      key: "actions",
      header: "",
      className: "cell-actions",
      render: (bank) => (
        <div className="row-actions">
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label={`Edit ${bank.name}`}
            onClick={() => openEdit(bank)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label={`Delete ${bank.name}`}
            onClick={() => requestDelete(bank)}
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
        title="Bank List"
        subtitle="Banks, branches and their account footprint"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus size={15} /> Add bank
          </Button>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={Landmark}
          tone="brand"
          label="Banks"
          value={stats.total}
          hint="registered banks"
        />
        <StatCard
          icon={Wallet}
          tone="success"
          label="Active"
          value={stats.active}
          hint="open for operations"
          valueTone="success"
        />
        <StatCard
          icon={Wallet}
          tone="info"
          label="Bank accounts"
          value={stats.accountCount}
          hint="savings accounts"
        />
        <StatCard
          icon={PiggyBank}
          tone="violet"
          label="DPS / FD"
          value={stats.childCount}
          hint="child accounts"
        />
      </div>

      <Card>
        <CardHeader
          title="All banks"
          icon={Landmark}
          actions={
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              onClick={reload}
              aria-label="Refresh banks"
            >
              <RefreshCw size={14} />
            </Button>
          }
        />
        <div className="toolbar">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search bank or branch…"
            label="Search banks"
          />
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(bank) => bank._id}
          loading={loading}
          loadingText="Loading banks…"
          empty={
            <EmptyState
              icon={Landmark}
              title={search ? "No matching banks" : "No banks yet"}
              description={
                search
                  ? "Try a different search term."
                  : "Add your first bank to start tracking accounts."
              }
              action={
                search ? null : (
                  <Button variant="primary" onClick={openCreate}>
                    <Plus size={15} /> Add bank
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
