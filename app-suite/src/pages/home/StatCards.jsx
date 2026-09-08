import DataCard, { DataCardGrid } from "@/components/DataCard";
import { IconUsers, IconDollar, IconBox, IconActivity } from "@/icons";
import { formatCurrency } from "@/utils/misc";

export default function StatCards({ summary }) {
  return (
    <DataCardGrid>
      <DataCard
        variant="accent"
        icon={<IconUsers size={22} />}
        value={summary.totalUsers}
        label="Total Users"
        badge={`${summary.activeUsers} active`}
      />
      <DataCard
        variant="success"
        icon={<IconDollar size={22} />}
        value={formatCurrency(summary.totalRevenue)}
        label="Revenue"
        badge="+8.2%"
        trend="up"
      />
      <DataCard
        variant="warning"
        icon={<IconBox size={22} />}
        value={formatCurrency(summary.totalExpenses)}
        label="Expenses"
        badge="-3.1%"
        trend="down"
      />
      <DataCard
        variant="secondary"
        icon={<IconActivity size={22} />}
        value={summary.totalTransactions}
        label="Transactions"
        badge={`${summary.pendingCount} pending`}
      />
    </DataCardGrid>
  );
}