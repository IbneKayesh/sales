import {
  CalendarClock,
  Coins,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  PageHeader,
  StatCard,
} from "../../components/ui";
import { useDashboard } from "../../hooks/useDashboard";
import {
  accountBalance,
  creditEntry,
  debitEntry,
  dpsProgress,
} from "../../lib/domain/aggregates";
import { TRANSACTION_TYPES } from "../../lib/domain/constants";
import { formatDate, formatMoney } from "../../lib/domain/format";
import { navigate } from "../../lib/router";

export function DashboardPage() {
  const { banks, accounts, transactions, loading, summary, upcoming, recent } =
    useDashboard();

  if (loading && !banks.length) {
    return (
      <div className="loading-state">
        <span className="spinner" aria-hidden="true" />
        Loading dashboard…
      </div>
    );
  }

  const balanceColumns = [
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
      key: "accounts",
      header: "Accounts",
      render: (bank) =>
        accounts.filter((account) => account.bankId === bank._id).length,
    },
    {
      key: "balance",
      header: "Balance",
      className: "cell-amount",
      render: (bank) =>
        formatMoney(
          accounts
            .filter((account) => account.bankId === bank._id)
            .reduce(
              (total, account) => total + accountBalance(account, transactions),
              0
            )
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`${summary.bankCount} banks · ${summary.accountCount} accounts · ${summary.dps.length} DPS · ${summary.fd.length} FD`}
        actions={
          <>
            <Button onClick={() => navigate("/cash-flow")}>Monthly cash flow</Button>
            <Button variant="primary" onClick={() => navigate("/transactions")}>
              Record transaction
            </Button>
          </>
        }
      />

      <div className="stats-grid">
        <StatCard
          icon={Landmark}
          tone="brand"
          label="Savings balance"
          value={formatMoney(summary.totalBalance)}
          hint={`across ${summary.accountCount} bank accounts`}
          onClick={() => navigate("/accounts")}
        />
        <StatCard
          icon={CalendarClock}
          tone="violet"
          label="DPS collected"
          value={formatMoney(summary.dpsPaid)}
          hint={`of ${formatMoney(summary.dpsPayable)} planned`}
          onClick={() => navigate("/sub-accounts")}
        />
        <StatCard
          icon={PiggyBank}
          tone="info"
          label="FD principal"
          value={formatMoney(summary.fdPrincipal)}
          hint={`${summary.fd.length} fixed deposits`}
          onClick={() => navigate("/sub-accounts")}
        />
        <StatCard
          icon={Coins}
          tone="success"
          label="Interest earned"
          value={formatMoney(summary.dpsInterest)}
          hint={`${formatMoney(summary.fdInterest)} expected from FD`}
          valueTone="success"
        />
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader
            title="Next DPS installments"
            icon={CalendarClock}
            badge={<span className="badge badge--violet">{upcoming.length}</span>}
          />
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="No installments scheduled"
              description="Add a DPS account to track its monthly installment."
            />
          ) : (
            <div className="list">
              {upcoming.map((account) => (
                <div className="list__item" key={account._id}>
                  <span className="list__dot list__dot--violet" aria-hidden="true" />
                  <span className="list__body">
                    <span className="list__title">
                      {account.label} · {account.accountNo}
                    </span>
                    <span className="list__meta">
                      {account.bankName} · {account.installmentsPaid}/
                      {account.installmentsTotal} paid ({dpsProgress(account)}%)
                    </span>
                  </span>
                  <span className="list__trail">
                    <span className="list__amount">
                      {formatMoney(account.installmentAmount)}
                    </span>
                    <span className="list__date">
                      {formatDate(account.nextInstallmentDate)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent transactions"
            icon={Wallet}
            actions={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/transactions")}
              >
                View all
              </Button>
            }
          />
          {recent.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No transactions yet"
              description="Record a deposit, withdrawal or DPS installment to see it here."
              action={
                <Button variant="primary" onClick={() => navigate("/transactions")}>
                  Record transaction
                </Button>
              }
            />
          ) : (
            <div className="list">
              {recent.map((tx) => (
                <div className="list__item" key={tx._id}>
                  <span
                    className={`list__dot list__dot--${
                      TRANSACTION_TYPES[tx.type]?.tone === "danger"
                        ? "danger"
                        : "success"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="list__body">
                    <span className="list__title">
                      {TRANSACTION_TYPES[tx.type]?.label ?? tx.type}
                    </span>
                    <span className="list__meta">
                      Dr {debitEntry(tx)?.name || "—"} → Cr{" "}
                      {creditEntry(tx)?.name || "—"}
                    </span>
                  </span>
                  <span className="list__trail">
                    <span className="list__amount list__amount--in">
                      {formatMoney(tx.amount)}
                    </span>
                    <span className="list__date">{formatDate(tx.date)}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="dashboard-grid__full">
          <CardHeader
            title="Balance by bank"
            icon={Landmark}
            actions={
              <Button size="sm" variant="ghost" onClick={() => navigate("/bank")}>
                Manage banks
              </Button>
            }
          />
          <DataTable
            columns={balanceColumns}
            rows={banks}
            rowKey={(bank) => bank._id}
            loading={loading}
            loadingText="Loading banks…"
            onRowClick={() => navigate("/accounts")}
            empty={
              <EmptyState
                icon={Landmark}
                title="No banks yet"
                description="Add your first bank to start tracking balances."
                action={
                  <Button variant="primary" onClick={() => navigate("/bank")}>
                    Add bank
                  </Button>
                }
              />
            }
          />
        </Card>
      </div>
    </>
  );
}
