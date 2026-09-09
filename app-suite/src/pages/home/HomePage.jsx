import useDashboard from "@/hooks/useDashboard";
import GreetingHeader from "@/components/GreetingHeader";
import Button from "@/components/Button";
import { toast } from "@/components/ToastBox";
import { IconActivity, IconArrowRight } from "@/icons";
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
      <GreetingHeader
        userName={user?.name}
        subtitle={`${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} \u00b7 ERP Dashboard`}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { refresh?.(); toast.info("Dashboard refreshed"); }}
              disabled={isLoading}
            >
              <IconActivity size={14} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="primary" size="sm" onClick={() => toast.success("Report exported")}>
              <IconArrowRight size={14} />
              Export Report
            </Button>
          </>
        }
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