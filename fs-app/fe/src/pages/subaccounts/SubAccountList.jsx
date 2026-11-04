import {
  CalendarClock,
  Coins,
  Landmark,
  Pencil,
  PiggyBank,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  AccountTypeBadge,
  Button,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  PageHeader,
  Progress,
  SearchField,
  StatCard,
  StatusBadge,
} from "../../components/ui";
import {
  dpsProgress,
  subAccountBalance,
} from "../../lib/domain/aggregates";
import { formatDate, formatMoney } from "../../lib/domain/format";

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "Savings", label: "Savings" },
  { value: "DPS", label: "DPS" },
  { value: "FD", label: "FD" },
];

export function SubAccountList({
  rows,
  accounts,
  transactions,
  loading,
  reload,
  typeFilter,
  setTypeFilter,
  accountFilter,
  setAccountFilter,
  search,
  setSearch,
  stats,
  openCreate,
  openEdit,
  requestDelete,
}) {
  const columns = [
    {
      key: "account",
      header: "Sub account",
      render: (account) => (
        <div>
          <div className="cell-name">{account.label}</div>
          <div className="cell-mono">{account.accountNo}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (account) => <AccountTypeBadge type={account.type} />,
    },
    {
      key: "parent",
      header: "Bank account",
      render: (account) => (
        <div>
          <div>{account.bankName || "—"}</div>
          <div className="cell-mono cell-muted">{account.parentAccountNo || "—"}</div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (account) => {
        if (account.type === "DPS") {
          return (
            <span className="plan-label">
              {formatMoney(account.installmentAmount)} × {account.installmentsTotal} ·{" "}
              {account.rate}%
            </span>
          );
        }

        if (account.type === "FD") {
          return (
            <span className="plan-label">
              {formatMoney(account.principal)} · {account.rate}% ·{" "}
              {account.interestPaymentType}
            </span>
          );
        }

        return <span className="plan-label">Operating sub account</span>;
      },
    },
    {
      key: "value",
      header: "Progress / balance",
      render: (account) => {
        if (account.type === "Savings") {
          return (
            <div>
              <div className="cell-name">
                {formatMoney(subAccountBalance(account, transactions))}
              </div>
              <div className="cell-muted">ledger balance</div>
            </div>
          );
        }

        if (account.type === "FD") {
          return (
            <div>
              <div className="cell-name">{formatMoney(account.maturityAmount)}</div>
              <div className="cell-muted">
                interest {formatMoney(account.totalInterest)}
              </div>
            </div>
          );
        }

        const progress = dpsProgress(account);

        return (
          <div className="progress-block">
            <div className="progress-block__meta">
              <span>
                {account.installmentsPaid}/{account.installmentsTotal} paid
              </span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={Number(account.installmentsPaid) || 0}
              max={Number(account.installmentsTotal) || 100}
              tone={progress >= 100 ? "success" : "brand"}
              label={`${account.label} installment progress`}
            />
            <div className="progress-block__caption">
              {formatMoney(account.totalPaid)} paid · interest{" "}
              {formatMoney(account.interestEarned)}
            </div>
          </div>
        );
      },
    },
    {
      key: "nextDate",
      header: "Next date",
      render: (account) => (
        <span className="cell-muted">
          {formatDate(
            account.type === "DPS"
              ? account.nextInstallmentDate
              : account.type === "FD"
                ? account.nextInterestPaymentDate
                : account.closeDate
          )}
        </span>
      ),
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
            aria-label={`Edit ${account.label}`}
            onClick={() => openEdit(account)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label={`Delete ${account.label}`}
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
        title="Sub Accounts"
        subtitle="Savings, DPS and FD accounts under each bank account"
        actions={
          <Button variant="primary" onClick={() => openCreate("Savings")}>
            <Plus size={15} /> Add sub account
          </Button>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={Landmark}
          tone="brand"
          label="Savings balance"
          value={formatMoney(stats.savingsBalance)}
          hint="posted through the journal"
        />
        <StatCard
          icon={CalendarClock}
          tone="violet"
          label="DPS paid"
          value={formatMoney(stats.dpsPaid)}
          hint={`${stats.dpsCount} DPS accounts`}
        />
        <StatCard
          icon={Coins}
          tone="success"
          label="DPS interest earned"
          value={formatMoney(stats.dpsInterest)}
          hint="credited so far"
          valueTone="success"
        />
        <StatCard
          icon={PiggyBank}
          tone="info"
          label="FD maturity value"
          value={formatMoney(stats.fdMaturity)}
          hint={`principal ${formatMoney(stats.fdPrincipal)}`}
        />
      </div>

      <Card>
        <CardHeader
          title="All sub accounts"
          icon={PiggyBank}
          actions={
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              onClick={reload}
              aria-label="Refresh sub accounts"
            >
              <RefreshCw size={14} />
            </Button>
          }
        />

        <div className="toolbar">
          <div className="segmented" role="group" aria-label="Filter by type">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`segmented__item${
                  typeFilter === filter.value ? " is-active" : ""
                }`}
                aria-pressed={typeFilter === filter.value}
                onClick={() => setTypeFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <select
            className="select"
            value={accountFilter}
            aria-label="Filter by bank account"
            onChange={(event) => setAccountFilter(event.target.value)}
          >
            <option value="all">All bank accounts</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.bankName} — {account.accountNo}
              </option>
            ))}
          </select>

          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search account no or label…"
            label="Search sub accounts"
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(account) => account._id}
          loading={loading}
          loadingText="Loading sub accounts…"
          empty={
            <EmptyState
              icon={PiggyBank}
              title={search ? "No matching sub accounts" : "No sub accounts yet"}
              description={
                search
                  ? "Try a different type, bank account or search term."
                  : "Add a Savings, DPS or FD account under one of your bank accounts."
              }
              action={
                search ? null : (
                  <Button variant="primary" onClick={() => openCreate("Savings")}>
                    <Plus size={15} /> Add sub account
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
