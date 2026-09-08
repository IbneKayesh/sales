import useDashboard from "@/hooks/useDashboard";
import WelcomeHeader from "./WelcomeHeader";
import StatCards from "./StatCards";
import RevenueChart from "./RevenueChart";
import RecentTransactions from "./RecentTransactions";
import QuickStats from "./QuickStats";

export default function HomePage() {
  const {
    user,
    summary,
    chartData,
    recentTransactions,
    isLoading,
    refresh,
  } = useDashboard();

  return (
    <div className="page-wrap">
      {/* Welcome Section */}
      <WelcomeHeader
        userName={user?.name}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      {/* Stat Cards */}
      <StatCards summary={summary} />

      {/* Revenue/Expenses Chart */}
      <RevenueChart chartData={chartData} />

      {/* Quick Summary Row */}
      <div className="grid" style={{ gap: "var(--sp-4)" }}>
        <div className="col-span-8">
          <RecentTransactions transactions={recentTransactions} />
        </div>

        <div className="col-span-4">
          <QuickStats summary={summary} />
        </div>
      </div>
    </div>
  );
}