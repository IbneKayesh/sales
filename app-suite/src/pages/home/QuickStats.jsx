import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import StatListItem from "@/components/StatListItem";
import { formatCurrency } from "@/utils/misc";

export default function QuickStats({ summary }) {
  return (
    <PageCard>
      <PageCardHeader>
        <PageCardTitle title="Quick Stats" subtitle="At-a-glance overview" />
      </PageCardHeader>
      <PageCardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
          <StatListItem
            label="Total Users"
            value={summary.totalUsers}
            sub={`${summary.activeUsers} active · ${summary.adminCount} admin · ${summary.editorCount} editor`}
            color="var(--primary)"
          />
          <StatListItem
            label="Transactions"
            value={summary.totalTransactions}
            sub={`${summary.completedCount} completed · ${summary.pendingCount} pending · ${summary.failedCount} failed`}
            color="var(--warning)"
          />
          <StatListItem
            label="Revenue"
            value={formatCurrency(summary.totalRevenue)}
            sub={`Expenses: ${formatCurrency(summary.totalExpenses)} · ${summary.revenueShare}% of total flow`}
            color="var(--success)"
          />
          <StatListItem
            label="Net Balance"
            value={formatCurrency(summary.netBalance)}
            sub={`${summary.completionRate}% completion rate · ${summary.totalTransactions} total transactions`}
            color={summary.netBalance >= 0 ? "var(--success)" : "var(--danger)"}
          />
        </div>
      </PageCardBody>
    </PageCard>
  );
}